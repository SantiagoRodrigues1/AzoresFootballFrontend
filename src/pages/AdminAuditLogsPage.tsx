// src/pages/AdminAuditLogsPage.tsx
import { useEffect, useState } from 'react';
import { History, AlertCircle, Clock, User, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';
import { IonButton } from '@ionic/react';

interface AuditLog {
  _id: string;
  action: string;
  entity: string;
  entityName: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  description?: string;
}

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, [page, action]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = new URL(`${API_URL}/admin/dashboard/audit-logs`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '20');
      if (action) url.searchParams.append('action', action);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao carregar logs');
      const data = await response.json();
      setLogs(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    const colors: {[key: string]: string} = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'EXPORT': 'bg-yellow-100 text-yellow-800'
    };
    return colors[action] || 'bg-slate-100 text-slate-800';
  };

  const getEntityIcon = (entity: string) => {
    const icons: {[key: string]: string} = {
      'Club': '🏆',
      'Match': '⚽',
      'Referee': '👨‍⚖️',
      'User': '👤',
      'Player': '👕'
    };
    return icons[entity] || '📋';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-muted-foreground">A carregar logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-50 shadow-lg safe-top rounded-b-3xl overflow-hidden">
        <div className="px-4 pt-6 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Auditoria</h1>
              <p className="text-sm text-white/70">Histórico de alterações ({total})</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'].map((a) => (
              <button
                key={a}
                onClick={() => { setAction(a); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  action === a
                    ? 'bg-white text-primary shadow-lg'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {a || 'Todas'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Sem logs para exibir</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log._id}
                className="bg-white rounded-xl p-4 shadow-md border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1">
                    <div className="text-2xl">{getEntityIcon(log.entity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {log.entity}
                        </span>
                      </div>
                      <p className="font-medium text-foreground mt-1 break-words">
                        {log.entityName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {log.userEmail}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(log.createdAt).toLocaleString('pt-PT')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-8">
            <IonButton
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              fill="outline"
            >
              ← Anterior
            </IonButton>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Página {page}
            </span>
            <IonButton
              disabled={page * 20 >= total}
              onClick={() => setPage(page + 1)}
              fill="outline"
            >
              Próxima →
            </IonButton>
          </div>
        )}
      </main>
    </div>
  );
}
