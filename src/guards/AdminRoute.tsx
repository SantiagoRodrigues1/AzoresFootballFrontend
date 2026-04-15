/**
 * AdminRoute.tsx
 * Guard de rota para proteger páginas exclusivas de administradores
 * 
 * Valida:
 * - Autenticação do utilizador (token)
 * - Role = "admin"
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Guard de rota para administradores
 * 
 * Uso:
 * <AdminRoute>
 *   <AdminMatches />
 * </AdminRoute>
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mentras carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4 animate-bounce">⚙️</span>
          <p className="text-muted-foreground">Verificando acesso admin...</p>
        </div>
      </div>
    );
  }

  // 1. Verificar se está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Verificar se tem role de admin
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // ✅ Autorizado
  return <>{children}</>;
};

export default AdminRoute;
