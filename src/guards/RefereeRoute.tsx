/**
 * RefereeRoute.tsx
 * Guard de rota para proteger páginas exclusivas de árbitros
 * 
 * Valida:
 * - Autenticação do utilizador (token)
 * - Role = "referee"
 * - Status de aprovação do árbitro
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RefereeRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

/**
 * Guard de rota para árbitros
 * 
 * Uso:
 * <RefereeRoute>
 *   <RefereeDashboard />
 * </RefereeRoute>
 * 
 * Com requisito de aprovação:
 * <RefereeRoute requireApproval={true}>
 *   <RefereeMatches />
 * </RefereeRoute>
 */
export const RefereeRoute: React.FC<RefereeRouteProps> = ({ 
  children, 
  requireApproval = true 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mientras carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4 animate-bounce">⚽</span>
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // 1. Verificar se está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Verificar se tem role de árbitro
  if (user.role !== 'referee') {
    return <Navigate to="/" replace />;
  }

  // 3. Verificar status de aprovação (se necessário)
  if (requireApproval) {
    const refereeStatus = (user as any).refereeStatus || 'none';
    
    if (refereeStatus === 'pending') {
      return <Navigate to="/referee/pending-approval" replace />;
    }
    
    if (refereeStatus === 'rejected') {
      return <Navigate to="/profile" replace />;
    }
    
    if (refereeStatus !== 'approved') {
      return <Navigate to="/profile" replace />;
    }
  }

  // ✅ Autorizado
  return <>{children}</>;
};

export default RefereeRoute;
