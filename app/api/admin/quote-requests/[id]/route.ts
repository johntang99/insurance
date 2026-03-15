import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// PUT — update status, notes, assigned agent
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
  const allowed = ['status', 'notes', 'assigned_agent_id'];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await supabase
    .from('quote_requests')
    .update(update)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}
