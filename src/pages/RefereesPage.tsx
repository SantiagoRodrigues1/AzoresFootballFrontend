import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RefereesManager } from '@/components/admin/EditRefereeModal';
import { ArrowLeft } from 'lucide-react';

export function RefereesPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin' || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <div className="text-center px-4">
          <p className="text-xl font-semibold mb-4">Acesso Negado</p>
          <p className="text-muted-foreground mb-6">Apenas administradores podem acessar esta página.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Árbitros</h1>
            <p className="text-xs text-white/70">Gestão de árbitros</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <RefereesManager token={token} />
      </main>
    </div>
  );
}
