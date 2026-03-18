import { createClient } from '@supabase/supabase-js';

// Usamos placeholders para evitar que o 빌d do Next.js pife se as variáveis não estiverem no Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-build.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

