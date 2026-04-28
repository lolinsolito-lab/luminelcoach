// services/supabase.ts
// Client Supabase — importato da tutto il progetto

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY mancanti nel file .env.local\n' +
    'Copia da: Supabase Dashboard → Settings → API'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession:     true,   // mantieni sessione tra refresh
    autoRefreshToken:   true,   // rinnova token automaticamente
    detectSessionInUrl: true,   // per OAuth redirect (Google)
    storage:            localStorage,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

// ─── HELPER: piano utente corrente ────────────────────────────────────────────
export async function getCurrentPlan(): Promise<'free' | 'premium' | 'vip'> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'free';

  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  return (data?.plan ?? 'free') as 'free' | 'premium' | 'vip';
}

// ─── HELPER: aggiungi XP (usa RPC definita nello schema SQL) ──────────────────
export async function addXP(xp: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.rpc('add_xp', { p_user_id: user.id, p_xp: xp });
}

// ─── HELPER: upload avatar su Storage ────────────────────────────────────────
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (error) { console.error('Avatar upload error:', error); return null; }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
