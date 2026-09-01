-- ================================================================
-- LUMINEL ADMIN SETUP
-- Esegui nel SQL Editor di Supabase UNA SOLA VOLTA
-- ================================================================

-- 1. Aggiunge colonna ruolo a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- 2. Imposta Michael Jara come admin
-- Sostituisci con la tua email reale
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'jaramichael@hotmail.com'
  LIMIT 1
);

-- 3. Policy: admin può leggere TUTTI i profili
CREATE POLICY "admin_read_all_profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Policy: admin può aggiornare qualsiasi profilo
CREATE POLICY "admin_update_all_profiles" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Verifica — deve mostrare il tuo profilo con role = 'admin'
SELECT public.profiles.id, full_name, email_confirmed_at, role
FROM public.profiles
JOIN auth.users ON public.profiles.id = auth.users.id
WHERE public.profiles.role = 'admin';
