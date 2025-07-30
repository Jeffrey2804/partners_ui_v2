// 🧠 supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ✅ Load from .env.local via Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🛡️ Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    [
      '❌ Supabase is not initialized!',
      'Missing environment variables in `.env.local`.',
      '',
      'Please ensure the following are set:',
      'VITE_SUPABASE_URL=https://your-project.supabase.co',
      'VITE_SUPABASE_ANON_KEY=your-anon-key',
    ].join('\n')
  );
}

// 🔐 Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
