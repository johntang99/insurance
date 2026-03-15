import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from('carriers')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ carrier: data });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
  }

  const { error } = await supabase.from('carriers').delete().eq('id', params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
