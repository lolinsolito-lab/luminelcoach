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

  // Dal prompt SQL, la logica era UPDATE profiles SET streak_days = 0 WHERE last_active_at < NOW() - INTERVAL '2 days' AND streak_days > 0
  // Se non c'è una RPC, possiamo eseguirla lato server usando il client Supabase service role
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const { error } = await supabase
    .from('profiles')
    .update({ streak_days: 0 })
    .lt('last_active_at', twoDaysAgo.toISOString())
    .gt('streak_days', 0);
  
  if (error) {
    console.error('Error in reset_broken_streaks cron:', error);
    return res.status(500).json({ error });
  }
  
  return res.status(200).json({ ok: true, task: 'reset_broken_streaks', time: new Date().toISOString() });
}
