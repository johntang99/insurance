import type { SiteConfig, User } from '@/lib/types';

// BAAM System I — Insurance Platform
// Super admin roles: 'super_admin' (medical legacy) + 'platform_super_admin' (insurance platform)
const SUPER_ADMIN_ROLES = ['super_admin', 'platform_super_admin'] as const;
const WRITE_ROLES = ['super_admin', 'platform_super_admin', 'site_admin', 'editor'] as const;
const MANAGE_ROLES = ['super_admin', 'platform_super_admin', 'site_admin'] as const;

function normalizeSiteId(siteId: string) {
  return siteId.trim().toLowerCase();
}

export function isSuperAdmin(user: User) {
  return SUPER_ADMIN_ROLES.includes(user.role as any);
}

export function canAccessSite(user: User, siteId: string) {
  const normalizedSiteId = normalizeSiteId(siteId);
  if (!normalizedSiteId) return false;
  if (isSuperAdmin(user)) return true;
  const uniqueSites = new Set(user.sites.map((entry) => normalizeSiteId(entry)));
  return uniqueSites.has(normalizedSiteId);
}

export function filterSitesForUser(sites: SiteConfig[], user: User) {
  if (isSuperAdmin(user)) return sites;
  const allowed = new Set(user.sites.map((entry) => normalizeSiteId(entry)));
  return sites.filter((site) => allowed.has(normalizeSiteId(site.id)));
}

export function requireRole(user: User, roles: User['role'][]) {
  // Insurance keeps a legacy high-privilege role name (`platform_super_admin`).
  // Any guard that allows `super_admin` must also allow that alias.
  if (roles.includes(user.role)) return;
  if (roles.includes('super_admin') && isSuperAdmin(user)) return;
  if (roles.includes('site_admin') && isSuperAdmin(user)) return;
  if (roles.includes('editor') && isSuperAdmin(user)) return;
  if (roles.includes('viewer') && isSuperAdmin(user)) return;
  throw new Error('Forbidden');
}

export function requireSiteAccess(user: User, siteId: string) {
  if (!canAccessSite(user, siteId)) {
    throw new Error('Forbidden');
  }
}

export function canWriteContent(user: User) {
  return WRITE_ROLES.includes(user.role as any);
}

export function canManageBookings(user: User) {
  return MANAGE_ROLES.includes(user.role as any);
}

export function canManageMedia(user: User) {
  return WRITE_ROLES.includes(user.role as any);
}
