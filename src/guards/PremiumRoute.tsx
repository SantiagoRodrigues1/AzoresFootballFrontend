import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/feedback/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { hasPremiumAccess } from '@/utils/access';

export function PremiumRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasPremiumAccess(user)) {
    return <Navigate to="/profile?upgrade=premium" replace />;
  }

  return <>{children}</>;
}