import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function seed() {
  const { data: phases } = await supabase.from('challenge_phases').select('id').order('order_index');
  if (!phases || phases.length === 0) return;

  const tasks = [
    { phase_id: phases[0].id, title: 'Problem Definition', description: 'Define the core problem you are solving.', points: 10 },
    { phase_id: phases[0].id, title: 'User Personas', description: 'Create 3 target user personas.', points: 10 },
    { phase_id: phases[1].id, title: 'Market Sizing', description: 'Calculate TAM/SAM/SOM.', points: 15 },
    { phase_id: phases[2].id, title: 'MVP Data Model', description: 'Design core database schema.', points: 20 },
  ];

  const { error } = await supabase.from('phase_tasks').insert(tasks);
  if (error) console.error('Error seeding tasks:', error);
  else console.log('Tasks seeded successfully');
}

seed();
