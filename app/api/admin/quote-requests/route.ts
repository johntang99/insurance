import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId    = searchParams.get('siteId');
  const status    = searchParams.get('status');
  const coverage  = searchParams.get('coverage');
  const agentId   = searchParams.get('agentId');
  const from      = searchParams.get('from');
  const to        = searchParams.get('to');
  const page      = parseInt(searchParams.get('page') || '1');
  const limit     = parseInt(searchParams.get('limit') || '25');

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ leads: [], total: 0, stats: {} });
  }

  let query = supabase
    .from('quote_requests')
    .select('*, agents(name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (siteId)   query = query.eq('site_id', siteId);
  if (status)   query = query.eq('status', status);
  if (agentId)  query = query.eq('assigned_agent_id', agentId);
  if (coverage) query = query.contains('coverage_types', [coverage]);
  if (from)     query = query.gte('created_at', from);
  if (to)       query = query.lte('created_at', to);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // Stats summary
  const { data: statsData } = await supabase
    .from('quote_requests')
    .select('status')
    .eq('site_id', siteId || '');

  const stats = (statsData || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({ leads: data ?? [], total: count ?? 0, stats });
}
