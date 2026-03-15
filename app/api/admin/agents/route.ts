import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ agents: [] });
  }

  let query = supabase.from('agents').select('*').order('sort_order');
  if (siteId) query = query.eq('site_id', siteId);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ agents: data ?? [] });
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
    .from('agents')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ agent: data }, { status: 201 });
}
