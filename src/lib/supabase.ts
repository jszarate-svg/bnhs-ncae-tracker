import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eahundmtxiaryxgqmxia.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaHVuZG10eGlhcnl4Z3FteGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMTM3MjgsImV4cCI6MjEwNzY4OTcyOH0.3DlnxabuMYOOpILbkj7CwvFc4FB9yHDpw0x9eI4BFEQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
