import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// GET — list carriers assigned to a site (with full carrier details)
export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ siteCarriers: [] });
  }

  const { data, error } = await supabase
    .from('site_carriers')
    .select('*, carriers(*)')
    .eq('site_id', siteId)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ siteCarriers: data ?? [] });
}

// PUT — update carrier assignments for a site (replaces all existing)
export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { siteId, assignments } = body as {
    siteId: string;
    assignments: Array<{ carrier_id: string; sort_order: number; is_featured: boolean }>;
  };

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  // Delete existing assignments and replace
  const { error: deleteError } = await supabase
    .from('site_carriers')
    .delete()
    .eq('site_id', siteId);

  if (deleteError) {
    return NextResponse.json({ message: deleteError.message }, { status: 500 });
  }

  if (assignments && assignments.length > 0) {
    const rows = assignments.map((a) => ({ site_id: siteId, ...a }));
    const { error: insertError } = await supabase.from('site_carriers').insert(rows);
    if (insertError) {
      return NextResponse.json({ message: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
