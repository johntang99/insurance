import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ carriers: [] });
  }

  const { data, error } = await supabase
    .from('carriers')
    .select('*')
    .order('sort_order');

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ carriers: data ?? [] });
}

export async function POST(request: NextRequest) {
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
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ carrier: data }, { status: 201 });
}
