import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Solo POST per sicurezza o GET da Vercel Cron
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verifica che abbiamo le chiavi necessarie (URL e Service Role Key)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials in environment' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Chiama la RPC definita su Supabase
  const { error } = await supabase.rpc('reset_daily_counts');
  
  if (error) {
    console.error('Error in reset_daily_counts cron:', error);
    return res.status(500).json({ error });
  }
  
  return res.status(200).json({ ok: true, task: 'reset_daily_counts', time: new Date().toISOString() });
}
