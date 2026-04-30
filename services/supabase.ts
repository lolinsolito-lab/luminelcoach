// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY mancanti nel file .env\n' +
    'Copia da: Supabase Dashboard → Settings → API'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
      // Bypassa il lock del navigator per evitare errori HMR e timeout
      return await fn();
    }
  },
});

export async function getCurrentPlan(): Promise<'free' | 'premium' | 'vip'> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'free';
  const { data } = await supabase
    .from('profiles').select('plan').eq('id', user.id).single();
  return (data?.plan ?? 'free') as 'free' | 'premium' | 'vip';
}

export async function addXP(xp: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.rpc('add_xp', { p_user_id: user.id, p_xp: xp });
}

export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from('avatars').upload(path, file, { upsert: true });
  if (error) { console.error('Avatar upload error:', error); return null; }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}