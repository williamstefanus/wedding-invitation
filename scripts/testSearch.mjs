import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const cleanQuery = "%John & Jane Doe%";
  const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select("id")
      .or(`name.ilike.${cleanQuery},phone.ilike.${cleanQuery}`);
  console.log("Guests:", guests);
  console.log("Guests Error:", guestsError?.message);
}
run();
