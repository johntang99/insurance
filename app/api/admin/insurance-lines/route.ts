import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// GET — list insurance lines for a site
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
    return NextResponse.json({ lines: [] });
  }

  const { data, error } = await supabase
    .from('insurance_lines')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ lines: data ?? [] });
}

// PUT — update enabled/order for all lines of a site
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
  const { siteId, lines } = body as {
    siteId: string;
    lines: Array<{
      line_slug: string;
      is_enabled: boolean;
      is_featured: boolean;
      sort_order: number;
      custom_description?: string;
    }>;
  };

  if (!siteId || !lines) {
    return NextResponse.json({ message: 'siteId and lines are required' }, { status: 400 });
  }

  // Upsert each line
  const rows = lines.map((l) => ({ site_id: siteId, ...l }));
  const { error } = await supabase
    .from('insurance_lines')
    .upsert(rows, { onConflict: 'site_id,line_slug' });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
