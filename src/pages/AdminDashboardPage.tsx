// src/pages/AdminDashboardPage.tsx
import { useEffect, useState } from 'react';
import { BarChart3, Users, Trophy, Zap, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';
import { IonButton } from '@ionic/react';

interface DashboardStats {
  kpis: {
    totalClubs: number;
    totalMatches: number;
    totalReferees: number;
    totalUsers: number;
  };
  recentActivity: any[];
  monthlyActivity: any[];
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao carregar stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      icon: Trophy,
      label: 'Equipas',
      value: stats?.kpis.totalClubs || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-card'
    },
    {
      icon: Zap,
      label: 'Jogos',
      value: stats?.kpis.totalMatches || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-card'
    },
    {
      icon: Users,
      label: 'Árbitros',
      value: stats?.kpis.totalReferees || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-card'
    },
    {
      icon: BarChart3,
      label: 'Utilizadores',
      value: stats?.kpis.totalUsers || 0,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-card'
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-50 shadow-lg safe-top rounded-b-3xl overflow-hidden">
        <div className="px-4 pt-6 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
              <p className="text-sm text-white/70">Estatísticas do sistema</p>
            </div>
          </div>
          <IonButton
            onClick={fetchStats}
            fill="outline"
            className="text-white border-white"
          >
            🔄 Atualizar
          </IonButton>
        </div>
      </header>

      {/* KPI Cards */}
      <main className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${card.bgColor} rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {card.value.toLocaleString('pt-PT')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Atividade Recente */}
        <section className="bg-card rounded-2xl shadow-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Atividade Recente
          </h2>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.userEmail} {activity.action === 'CREATE' ? 'criou' : 'atualizou'} {activity.entity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.entityName}
                    </p>
                  </div>
                  <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                    {new Date(activity.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Sem atividade recente</p>
          )}
        </section>
      </main>
    </div>
  );
}
