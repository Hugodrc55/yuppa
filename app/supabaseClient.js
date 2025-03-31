import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtnufiklwdvzelsfohzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10bnVmaWtsd2R2emVsc2ZvaHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTQwMDQsImV4cCI6MjA1ODM5MDAwNH0.fk67KG3A9PUgueEsiwVPOD0ViJTAhAgd46FHqFqrajQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
