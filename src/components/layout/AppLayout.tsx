import { ReactNode } from 'react';
import { TabBar } from '@/components/navigation/TabBar';
import { PageLoader } from '@/components/feedback/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Páginas que têm seu próprio header e não precisam do TabBar
  // Escondemos o TabBar para rotas exatas (e.g. '/team') ou sub-rotas (e.g. '/team/:id')
  const hideTabBarRoutes = ['/team', '/player', '/admin-panel', '/match-lineup'];
  const shouldHideTabBar = hideTabBarRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <PageLoader label="A sincronizar a tua área pessoal..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
      {!shouldHideTabBar && <TabBar />}
    </div>
  );
}
