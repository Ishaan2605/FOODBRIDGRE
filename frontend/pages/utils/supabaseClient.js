// frontend/pages/utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// 🔐 Replace with your actual project URL and anon key from Supabase
const supabaseUrl = 'https://dbvnwcywtjyvksvrjmsm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidm53Y3l3dGp5dmtzdnJqbXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Nzc4NDgsImV4cCI6MjA2MDQ1Mzg0OH0.SRvhoc0k2Uwb1gQtcq_igtU-E9FKHcFPiWeX9mzAphY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
