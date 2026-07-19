require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
      .from("invitations")
      .select(`
        id,
        guest:guests!inner(name, owner, category)
      `)
      .limit(5);
      
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}
run();
