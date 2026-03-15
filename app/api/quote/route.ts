import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestSiteId } from '@/lib/content';

// POST — public quote request submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      coverageTypes,
      preferredLanguage,
      bestContactTime,
      message,
      details,
      source,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: 'First name, last name, and phone are required' },
        { status: 400 }
      );
    }

    const siteId = await getRequestSiteId();
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';

    const supabase = getSupabaseServerClient();

    if (!supabase) {
      // Graceful fallback when Supabase is not configured (local dev)
      console.log('[QUOTE REQUEST - LOCAL ONLY]', { siteId, firstName, lastName, phone, coverageTypes });
      return NextResponse.json(
        { success: true, id: 'local-dev', message: 'Quote request logged (Supabase not configured)' },
        { status: 201 }
      );
    }

    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        site_id:            siteId,
        first_name:         firstName,
        last_name:          lastName,
        phone,
        email:              email || null,
        coverage_types:     coverageTypes || [],
        preferred_language: preferredLanguage || 'English',
        best_contact_time:  bestContactTime || null,
        message:            message || null,
        details:            details || {},
        source:             source || 'website',
        status:             'new',
        ip_address:         ip,
        user_agent:         userAgent,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[QUOTE REQUEST ERROR]', error);
      return NextResponse.json({ message: 'Failed to submit quote request' }, { status: 500 });
    }

    // TODO (Phase 3): Send email notification to QUOTE_NOTIFICATION_EMAIL via Resend

    return NextResponse.json(
      { success: true, id: data.id, message: 'Quote request submitted successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[QUOTE ROUTE ERROR]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
