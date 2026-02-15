import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/types/database.types';

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  let session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session ?? null;
  } catch (error) {
    console.error('[Journal API] Supabase session check failed. Returning empty list.', error);
    return NextResponse.json([], { status: 200 });
  }

  if (!session) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Journal API] Supabase query error. Returning empty list.', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(dreams ?? [], { status: 200 });
  } catch (error) {
    console.error('[Journal API] Unexpected fetch error. Returning empty list.', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  let session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session ?? null;
  } catch (error) {
    console.error('[Journal API] Supabase session check failed during delete.', error);
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let dreamId: string | null = null;
  try {
    const body = await request.json();
    dreamId = typeof body?.id === 'string' ? body.id : null;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!dreamId) {
    return NextResponse.json({ error: 'Dream id is required.' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', dreamId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('[Journal API] Supabase delete error.', error);
      return NextResponse.json({ error: 'Failed to delete dream.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Journal API] Unexpected delete error.', error);
    return NextResponse.json({ error: 'Failed to delete dream.' }, { status: 500 });
  }
}
