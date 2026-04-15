import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/feedback/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { hasClubManagerAccess, isClubManagerRole } from '@/utils/access';

interface TeamManagerRouteProps {
  children: ReactNode;
  allowAdmin?: boolean;
}

export function TeamManagerRoute({ children, allowAdmin = false }: TeamManagerRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const hasAccess = allowAdmin ? hasClubManagerAccess(user) : isClubManagerRole(user.role);
  if (!hasAccess) {
    return <Navigate to="/matches" replace />;
  }

  return <>{children}</>;
}