import { createClient } from "@supabase/supabase-js";
import env from "./env.js";

const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY, // use service key in backend
);

export default supabase;
