import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import QuoteCTASection from '@/components/sections/QuoteCTASection';
import { Phone, Shield } from 'lucide-react';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const siteName = getSiteDisplayName(siteInfo, 'Peerless Brokerage');
  return buildPageMetadata({
    siteId, locale, slug: 'claims',
    title: isZh ? `理赔协助 | ${siteName}` : `Claims Assistance | ${siteName}`,
    description: isZh
      ? `${siteName} 协助您梳理理赔流程，从报案到跟进全程支持。`
      : `Filing a claim can be stressful. ${siteName} guides you through every step of the claims process.`,
  });
}

export default async function ClaimsPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<any>('claims', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const si = siteInfo as any;
  const phone = si?.phone || ("(718) 799-0472");
  const phoneHref = si?.phone ? `tel:${si.phone.replace(/\D/g, '')}` : 'tel:+17187990472';
  const ui = {
    title: isZh ? '理赔协助' : 'Claims Assistance',
    subline: isZh ? '理赔流程可能复杂，我们会陪您一步步处理。' : 'Filing a claim can be stressful. We\'re here to guide you through every step.',
    processHeadline: isZh ? '我们如何协助您理赔' : 'How We Help with Claims',
    cardTitle: isZh ? '开始理赔' : 'Start Your Claim',
    cardBody: isZh ? '发生事故后请尽快联系。紧急情况请先拨打 911。' : 'Call us immediately after an incident. For emergencies, always call 911 first.',
    emergency: isZh ? '⚠️ 危及生命的紧急情况，请先拨打 911。' : '⚠️ For life-threatening emergencies, call 911 first.',
    ctaHeadline: isZh ? '对保障范围有疑问？' : 'Have Questions About Your Coverage?',
    ctaSubline: isZh ? '提前确认保障细节，通常比事后理赔更省心。' : 'Prevention is better than a claim — make sure you\'re properly covered.',
  };

  const steps = content?.process?.steps || [
    isZh
      ? { step: 1, title: '先联系顾问', description: '建议先致电或邮件联系我们，再与保险公司直接沟通，以便确认更合适处理顺序。' }
      : { step: 1, title: 'Contact Us First', description: 'Call or email us before contacting your insurance carrier directly. We\'ll advise on the best approach for your situation.' },
    isZh
      ? { step: 2, title: '整理资料', description: '我们会协助您准备理赔所需资料，如现场照片、事故记录、医疗文件等。' }
      : { step: 2, title: 'Document Everything', description: 'We\'ll help you gather the right documentation — photos, police reports, medical records — to support your claim.' },
    isZh
      ? { step: 3, title: '提交理赔', description: '可由我们协助提交，或指导您按保险公司流程完成申报，避免遗漏关键信息。' }
      : { step: 3, title: 'File Your Claim', description: 'We file on your behalf or guide you through the carrier\'s claims process to ensure nothing is missed.' },
    isZh
      ? { step: 4, title: '持续跟进', description: '我们将协助跟进进度，推动理赔结果更及时、更合理。' }
      : { step: 4, title: 'Follow Up', description: 'We monitor your claim and advocate for a fair and timely resolution.' },
  ];

  return (
    <main>
      <section style={{ background: 'var(--navy-800)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container-custom">
          <Shield className="w-12 h-12 mx-auto" style={{ color: 'var(--gold-400)', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 12 }}>
            {content?.hero?.headline || ui.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            {content?.hero?.subline || ui.subline}
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-white)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 32 }}>
                {content?.process?.headline || ui.processHeadline}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {steps.map((s: any) => (
                  <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.9rem', flexShrink: 0, fontFamily: 'var(--font-heading)' }}>
                      {s.step}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy-800)', marginBottom: 6 }}>{s.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '.9375rem', lineHeight: 1.7, margin: 0 }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--navy-800)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: 12 }}>{ui.cardTitle}</h3>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem', marginBottom: 24, lineHeight: 1.6 }}>
                {ui.cardBody}
              </p>
              <a href={phoneHref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--gold-500)', color: '#fff', borderRadius: 10, padding: '14px 24px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: 14 }}>
                <Phone className="w-4 h-4" /> {phone}
              </a>
              <a href={`mailto:${si?.email || 'claims@pbiny.com'}`} style={{ display: 'block', color: 'rgba(255,255,255,.6)', fontSize: '.875rem' }}>
                {si?.email || 'claims@pbiny.com'}
              </a>
              <div style={{ marginTop: 24, padding: '14px', background: 'rgba(255,255,255,.08)', borderRadius: 10, fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>
                {ui.emergency}
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTASection
        variant="cta-only"
        headline={ui.ctaHeadline}
        subline={ui.ctaSubline}
        phone={phone}
        phoneHref={phoneHref}
        locale={locale}
      />
    </main>
  );
}
