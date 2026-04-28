// src/contexts/AuthContext.tsx
// PRODUZIONE — Supabase Auth reale
// Sostituisce completamente il mock con localStorage
//
// PREREQUISITI:
// 1. npm install @supabase/supabase-js
// 2. Crea src/services/supabase.ts (vedi sotto)
// 3. .env: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
// 4. Schema luminel-complete-schema.sql eseguito su Supabase

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

// ─── TIPI ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  // Supabase Auth
  id: string;
  email?: string;

  // Da profiles table
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  plan: 'free' | 'premium' | 'vip';
  planExpiresAt?: string;

  // Progressi
  ikigaiStage?: string;
  level?: number;
  xpTotal?: number;
  streakDays?: number;
  sessionCount?: number;
  minutesTotal?: number;

  // Preferenze (usate da Settings)
  preferredLanguage?: string;
  theme?: string;

  // Ikigai assessment (WelcomePage)
  ikigaiLoves?: string[];
  ikigaiGoodAt?: string[];
  ikigaiWorldNeeds?: string[];
  ikigaiPaidFor?: string[];
  ikigaiSummary?: string;

  // Compatibilità con codice esistente
  goals?: string[];
  experience?: string;
  stressLevel?: number;
  sleepQuality?: number;
  energyLevel?: number;
  sessionDuration?: string;
  preferredTime?: string;
  voiceGender?: string;
  backgroundSound?: string;
  privacyConsents?: {
    dataProcessing: boolean;
    analytics: boolean;
    notifications: boolean;
  };

  // Metadati Supabase (accesso diretto)
  user_metadata?: Record<string, any>;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  upgradePlan: (plan: 'premium' | 'vip') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── HELPER: mappa profilo DB → UserProfile ───────────────────────────────────
function mapProfile(supabaseUser: User, dbProfile: any): UserProfile {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    fullName: dbProfile?.full_name ?? supabaseUser.user_metadata?.full_name ?? '',
    username: dbProfile?.username,
    avatarUrl: dbProfile?.avatar_url ?? supabaseUser.user_metadata?.avatar_url,
    bio: dbProfile?.bio,
    plan: (dbProfile?.plan ?? 'free') as 'free' | 'premium' | 'vip',
    planExpiresAt: dbProfile?.plan_expires_at,
    ikigaiStage: dbProfile?.ikigai_stage ?? 'scoperta',
    level: dbProfile?.level ?? 1,
    xpTotal: dbProfile?.xp_total ?? 0,
    streakDays: dbProfile?.streak_days ?? 0,
    sessionCount: dbProfile?.session_count ?? 0,
    minutesTotal: dbProfile?.minutes_total ?? 0,
    preferredLanguage: dbProfile?.preferred_language ?? 'it',
    theme: dbProfile?.theme ?? 'dark',
    ikigaiLoves: dbProfile?.ikigai_loves ?? [],
    ikigaiGoodAt: dbProfile?.ikigai_good_at ?? [],
    ikigaiWorldNeeds: dbProfile?.ikigai_world_needs ?? [],
    ikigaiPaidFor: dbProfile?.ikigai_paid_for ?? [],
    ikigaiSummary: dbProfile?.ikigai_summary,
    // Compatibilità
    goals: dbProfile?.ikigai_loves ?? [],
    experience: dbProfile?.ikigai_stage === 'scoperta' ? 'beginner' : 'intermediate',
    privacyConsents: { dataProcessing: true, analytics: true, notifications: true },
    sessionDuration: '10',
    preferredTime: 'morning',
    voiceGender: 'female',
    backgroundSound: 'nature',
    user_metadata: supabaseUser.user_metadata,
  };
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Carica profilo da Supabase ──
  const loadProfile = async (sbUser: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('loadProfile error:', error);
    }

    // Se il profilo non esiste ancora (primo login), il trigger lo crea
    // ma potrebbe non essere ancora disponibile — ritentiamo
    if (!data) {
      await new Promise(r => setTimeout(r, 800));
      const { data: retryData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();
      setProfile(mapProfile(sbUser, retryData));
    } else {
      setProfile(mapProfile(sbUser, data));
    }
  };

  // ── Aggiorna streak quando l'utente è attivo ──
  const updateStreak = async (userId: string) => {
    try {
      await supabase.rpc('update_user_streak', { p_user_id: userId });
    } catch { /* non critico */ }
  };

  // ── Inizializzazione — ascolta cambiamenti auth ──
  useEffect(() => {
    // Sessione corrente
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        setSupabaseUser(s.user);
        await loadProfile(s.user);
        updateStreak(s.user.id);
      }
      setLoading(false);
    });

    // Listener per login/logout/token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s);
        if (s?.user) {
          setSupabaseUser(s.user);
          await loadProfile(s.user);
          if (event === 'SIGNED_IN') updateStreak(s.user.id);
        } else {
          setSupabaseUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Refresh manuale profilo ──
  const refreshProfile = async () => {
    if (!supabaseUser) return;
    await loadProfile(supabaseUser);
  };

  // ── updateUserProfile — salva su Supabase ──
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!supabaseUser) throw new Error('Not authenticated');

    // Mappa campi camelCase → snake_case per Supabase
    const dbData: Record<string, any> = {
      id: supabaseUser.id,
      updated_at: new Date().toISOString(),
    };
    if (data.fullName !== undefined) dbData.full_name = data.fullName;
    if (data.username !== undefined) dbData.username = data.username;
    if (data.avatarUrl !== undefined) dbData.avatar_url = data.avatarUrl;
    if (data.bio !== undefined) dbData.bio = data.bio;
    if (data.plan !== undefined) dbData.plan = data.plan;
    if (data.preferredLanguage !== undefined) dbData.preferred_language = data.preferredLanguage;
    if (data.theme !== undefined) dbData.theme = data.theme;
    if (data.ikigaiLoves !== undefined) dbData.ikigai_loves = data.ikigaiLoves;
    if (data.ikigaiGoodAt !== undefined) dbData.ikigai_good_at = data.ikigaiGoodAt;
    if (data.ikigaiWorldNeeds !== undefined) dbData.ikigai_world_needs = data.ikigaiWorldNeeds;
    if (data.ikigaiPaidFor !== undefined) dbData.ikigai_paid_for = data.ikigaiPaidFor;
    if (data.ikigaiSummary !== undefined) dbData.ikigai_summary = data.ikigaiSummary;
    if (data.ikigaiStage !== undefined) dbData.ikigai_stage = data.ikigaiStage;

    const { error } = await supabase
      .from('profiles')
      .upsert(dbData);

    if (error) throw error;

    // Aggiorna anche user_metadata Supabase se cambia il nome
    if (data.fullName) {
      await supabase.auth.updateUser({ data: { full_name: data.fullName } });
    }

    // Aggiorna stato locale
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  // ── LOGIN ──
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw mapAuthError(error);
  };

  // ── SIGNUP ──
  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // emailRedirectTo: `${window.location.origin}/confirm` // se abiliti email confirm
      },
    });
    if (error) throw mapAuthError(error);
  };

  // ── GOOGLE OAuth ──
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) throw mapAuthError(error);
  };

  // ── RESET PASSWORD ──
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw mapAuthError(error);
  };

  // ── UPGRADE PIANO ──
  // In produzione: reindirizza a Stripe Checkout
  // Qui aggiorna direttamente per testing (Stripe webhook lo farà in prod)
  const upgradePlan = async (plan: 'premium' | 'vip') => {
    if (!supabaseUser) throw new Error('Not authenticated');

    // TODO produzione: redirect to Stripe Checkout
    // window.location.href = await createStripeCheckout(plan);

    // Per ora aggiorna direttamente (rimuovere in produzione, usa solo Stripe webhook)
    await updateUserProfile({ plan });
  };

  // ── SIGN OUT ──
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSupabaseUser(null);
    setSession(null);
  };

  const isAuthenticated = !!supabaseUser && !!session;

  return (
    <AuthContext.Provider value={{
      user: profile,
      profile,
      supabaseUser,
      session,
      loading,
      isAuthenticated,
      updateUserProfile,
      login,
      signup,
      loginWithGoogle,
      resetPassword,
      upgradePlan,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ─── HELPER: messaggi errore in italiano ─────────────────────────────────────
function mapAuthError(error: AuthError): Error {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email o password non corretti.',
    'Email not confirmed': 'Conferma la tua email prima di accedere.',
    'User already registered': 'Questo indirizzo email è già registrato.',
    'Password should be at least 6 characters': 'La password deve avere almeno 6 caratteri.',
    'Email rate limit exceeded': 'Troppi tentativi. Riprova tra qualche minuto.',
    'Invalid email': 'Indirizzo email non valido.',
  };
  return new Error(map[error.message] ?? error.message);
}