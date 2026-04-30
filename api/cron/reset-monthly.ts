import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials in environment' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabase.rpc('reset_monthly_voice');
  
  if (error) {
    console.error('Error in reset_monthly_voice cron:', error);
    return res.status(500).json({ error });
  }
  
  return res.status(200).json({ ok: true, task: 'reset_monthly_voice', time: new Date().toISOString() });
}
