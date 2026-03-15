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
  // Site-level admin modules
  { name: 'Site Settings', href: '/admin/site-settings', iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Content', href: '/admin/content', iconKey: 'fileText', group: 'site' },
  { name: 'Blog Posts', href: '/admin/blog-posts', iconKey: 'bookOpen', group: 'site' },
  // Insurance-specific modules (added in Phase 0C):
  { name: 'Services', href: '/admin/services', iconKey: 'fileText', group: 'site' },
  { name: 'Media', href: '/admin/media', iconKey: 'image', group: 'site' },

  // System-level modules
  { name: 'Sites', href: '/admin/sites', iconKey: 'building2', group: 'system', preserveContext: false },
  { name: 'Onboarding', href: '/admin/onboarding', iconKey: 'rocket', group: 'system', preserveContext: false, superAdminOnly: true },
  { name: 'Onboarding QA Checklist', href: '/admin/onboarding-checklist', iconKey: 'fileText', group: 'system', preserveContext: false },
  { name: 'Components', href: '/admin/components', iconKey: 'layoutGrid', group: 'system', preserveContext: false },
  { name: 'Variants', href: '/admin/variants', iconKey: 'layers', group: 'system', preserveContext: false },
  { name: 'Users', href: '/admin/users', iconKey: 'users', group: 'system', preserveContext: false },
  { name: 'Settings', href: '/admin/settings', iconKey: 'settings', group: 'system', preserveContext: false },
];

export async function AdminSidebar() {
  const session = await getSession();
  const isAdmin = session?.user ? isSuperAdmin(session.user) : false;
  const items = isAdmin ? navigation : navigation.filter((item) => !item.superAdminOnly && item.name !== 'Users');
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-lg font-semibold">Insurance Admin</span>
      </div>
      <AdminSidebarNav items={items} />
    </aside>
  );
}
