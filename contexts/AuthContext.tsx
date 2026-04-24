
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  upgradePlan: (plan: 'premium' | 'vip') => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('luminel_user_profile', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial check
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setProfile(prev => {
      if (!prev) return data as UserProfile;
      return { ...prev, ...data };
    });
    setLoading(false);
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate getting user from DB
    const existingProfile = profile && profile.fullName ? profile : {
      fullName: email.split('@')[0],
      goals: ['reduce-stress'],
      experience: 'beginner',
      stressLevel: 5,
      sleepQuality: 5,
      energyLevel: 5,
      privacyConsents: { dataProcessing: true, analytics: true, notifications: true },
      sessionDuration: '10',
      preferredTime: 'morning',
      voiceGender: 'female',
      backgroundSound: 'nature',
      plan: 'free'
    } as UserProfile;

    setProfile(existingProfile);
    setLoading(false);
  };

  const signup = async (name: string, email: string, password?: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newProfile: UserProfile = {
      fullName: name,
      goals: [],
      experience: 'beginner',
      stressLevel: 5,
      sleepQuality: 5,
      energyLevel: 5,
      privacyConsents: { dataProcessing: true, analytics: true, notifications: true },
      sessionDuration: '10',
      preferredTime: 'morning',
      voiceGender: 'female',
      backgroundSound: 'nature',
      plan: 'free'
    };

    setProfile(newProfile);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to ${email}`);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockProfile: UserProfile = {
      fullName: 'Utente Google',
      goals: ['mindfulness'],
      experience: 'beginner',
      stressLevel: 5,
      sleepQuality: 5,
      energyLevel: 5,
      privacyConsents: { dataProcessing: true, analytics: true, notifications: true },
      sessionDuration: '10',
      preferredTime: 'morning',
      voiceGender: 'female',
      backgroundSound: 'nature',
      plan: 'free'
    };

    setProfile(mockProfile);
    setLoading(false);
  };

  const upgradePlan = async (plan: 'premium' | 'vip') => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProfile(prev => {
        if(!prev) return null;
        return { ...prev, plan };
    });
    setLoading(false);
  };

  const signOut = () => {
    setProfile(null);
    localStorage.removeItem('luminel_user_profile');
    // We intentionally don't clear progress/streak data so it persists if they log back in
  };

  const isAuthenticated = !!profile && !!profile.fullName;

  return (
    <AuthContext.Provider value={{
      user: profile,
      profile,
      loading,
      isAuthenticated,
      updateUserProfile,
      login,
      signup,
      resetPassword,
      loginWithGoogle,
      upgradePlan,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
