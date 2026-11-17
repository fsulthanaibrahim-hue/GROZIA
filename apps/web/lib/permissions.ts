export type Role = 'Owner' | 'Store Manager' | 'Accountant';

// Define who can see what. 
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/products': ['Owner', 'Store Manager'],
  '/customers': ['Owner', 'Store Manager', 'Accountant'],
  '/complaints': ['Owner', 'Store Manager'],
  '/settings': ['Owner'],
};

// Helper function to check if a role is allowed
export function canAccessRoute(role: string, pathname: string): boolean {
  const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find(route => 
    pathname.startsWith(route)
  );

  // If no rule exists for this route, it's public (or default allowed)
  if (!matchedRoute) return true; 

  // Check if the user's role is in the allowed list
  return ROUTE_PERMISSIONS[matchedRoute].includes(role as Role);
}
