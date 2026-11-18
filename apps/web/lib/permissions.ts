export type Role = 'Owner' | 'Store Manager' | 'Accountant';

// URL prefix -> page key stored in the database (user_pages.page)
export const ROUTE_TO_PAGE: Record<string, string> = {
  '/products': 'products',
  '/customers': 'customers',
  '/complaints': 'complaints',
  '/settings': 'settings',
};

export function pageForPath(pathname: string): string | null {
  const route = Object.keys(ROUTE_TO_PAGE).find(
    (r) => pathname === r || pathname.startsWith(r + '/')
  );
  return route ? ROUTE_TO_PAGE[route] : null;
}

// Allowed only if the page is assigned to this user. Paths with no entry
// above (e.g. /dashboard) are not page-gated.
export function canAccessRoute(pages: string[], pathname: string): boolean {
  const page = pageForPath(pathname);
  if (!page) return true;
  return pages.includes(page);
}
