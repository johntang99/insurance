import { getSession } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { AdminSidebarNav } from './AdminSidebarNav';
import type { IconKey } from './AdminSidebarNav';

// BAAM System I — Insurance Brokerage Platform Admin Navigation
const navigation: Array<{
  name: string;
  href: string;
  iconKey: IconKey;
  group: 'site' | 'system';
  preserveContext?: boolean;
  superAdminOnly?: boolean;
}> = [
  // ── Site-level: Leads & Conversions ─────────────────────────
  { name: 'Quote Requests',    href: '/admin/quote-requests',    iconKey: 'fileText',         group: 'site' },
  // ── Site-level: Content ─────────────────────────────────────
  { name: 'Site Settings',     href: '/admin/site-settings',     iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Content',           href: '/admin/content',           iconKey: 'fileText',          group: 'site' },
  { name: 'Blog Posts',        href: '/admin/blog-posts',        iconKey: 'bookOpen',          group: 'site' },
  // ── Site-level: Insurance-specific ──────────────────────────
  { name: 'Agents',            href: '/admin/agents',            iconKey: 'users',             group: 'site' },
  { name: 'Insurance Lines',   href: '/admin/insurance-lines',   iconKey: 'layers',            group: 'site' },
  { name: 'Carrier Partners',  href: '/admin/carriers-admin',    iconKey: 'building2',         group: 'site' },
  // ── Site-level: Media ───────────────────────────────────────
  { name: 'Media',             href: '/admin/media',             iconKey: 'image',             group: 'site' },

  // ── System-level ─────────────────────────────────────────────
  { name: 'All Sites',         href: '/admin/sites',             iconKey: 'building2',         group: 'system', preserveContext: false },
  { name: 'Onboarding',        href: '/admin/onboarding',        iconKey: 'rocket',            group: 'system', preserveContext: false, superAdminOnly: true },
  { name: 'Components',        href: '/admin/components',        iconKey: 'layoutGrid',        group: 'system', preserveContext: false },
  { name: 'Variants',          href: '/admin/variants',          iconKey: 'layers',            group: 'system', preserveContext: false },
  { name: 'Admin Users',       href: '/admin/users',             iconKey: 'users',             group: 'system', preserveContext: false },
  { name: 'Settings',          href: '/admin/settings',          iconKey: 'settings',          group: 'system', preserveContext: false },
];

export async function AdminSidebar() {
  const session = await getSession();
  const isAdmin = session?.user ? isSuperAdmin(session.user) : false;
  const items = isAdmin
    ? navigation
    : navigation.filter(item => !item.superAdminOnly && item.name !== 'Admin Users');

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col items-start h-16 px-5 border-b border-gray-200 justify-center">
        <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading, serif)' }}>Insurance Admin</span>
        <span className="text-xs text-gray-400 font-medium">BAAM System I</span>
      </div>
      <AdminSidebarNav items={items} />
    </aside>
  );
}
