import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: cohorts, error: cError } = await supabase.from('cohorts').select('*');
  if (cError) console.error('Cohorts error:', cError);
  else console.log('Cohorts found:', cohorts.length);

  const { data: phases, error: pError } = await supabase.from('challenge_phases').select('*');
  if (pError) console.error('Phases error:', pError);
  else console.log('Phases found:', phases.length);
}

check();
