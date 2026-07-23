const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('guests')
    .insert([{ name: 'Test', owner: 'Bride', category: 'Friends' }])
    .select();
  console.log("With Bride:", error ? error.message : data);
  
  const { data: d2, error: e2 } = await supabase
    .from('guests')
    .insert([{ name: 'Test2', owner: 'bride', category: 'Friends' }])
    .select();
  console.log("With bride:", e2 ? e2.message : d2);
}
test();
