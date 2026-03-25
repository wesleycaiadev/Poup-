import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST() {
  // Limpar os cookies antigos manualmente iterando sobre eles
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Apagar todos os cookies de sessão sb-* do Supabase
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
      cookieStore.delete(cookie.name);
    }
  });

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
