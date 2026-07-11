// @/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore.ts';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. If not authenticated, redirect to the login page and store where the user tried to go
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If allowedRoles are provided, check if the user has any of the allowed roles
  const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];
  if (allowedRoles && !rolesArray.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/home" replace />;
  }

  // 3. If all checks pass, render the child components
  return <Outlet />;
}
