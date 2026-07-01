import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqmuszquprxtmgcwvojw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbXVzenF1cHJ4dG1nY3d2b2p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjczMTk4OCwiZXhwIjoyMDk4MzA3OTg4fQ.Kg0TDd3MaWbgxDg_MH55ZwajQqKda2GCxGDaHxkoEpA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  // Supabase doesn't have a direct "list tables" in the JS client easily without RPC or querying postgrest directly
  // But we can try to query some common table names or use an RPC if defined.
  // Alternatively, we can use the REST API to see what's exposed.
  
  const { data, error } = await supabase.from('builders').select('*').limit(1);
  if (error) {
    console.log('Table "builders" not found or error:', error.message);
  } else {
    console.log('Table "builders" found!');
  }

  const { data: teams, error: teamsError } = await supabase.from('teams').select('*').limit(1);
  if (teamsError) {
    console.log('Table "teams" not found or error:', teamsError.message);
  } else {
    console.log('Table "teams" found!');
  }
}

checkTables();
