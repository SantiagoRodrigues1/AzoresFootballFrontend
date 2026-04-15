/**
 * RefereeDashboard.tsx
 * Dashboard principal para árbitros aprovados
 * 
 * Mostra:
 * - Estatísticas (total jogos, este mês, relatórios)
 * - Próximos jogos atribuídos
 * - Notificações
 */

import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/react';
import {
  calendar,
  documentText,
  settings,
  logOut,
  refresh
} from 'ionicons/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import refereeService from '@/services/refereeService';
import matchService from '@/services/matchService';
import StatsCard from '@/components/referee/StatsCard';
import MatchCard from '@/components/referee/MatchCard';
import './RefereeDashboard.css';

interface DashboardStats {
  totalMatches: number;
  matchesThisMonth: number;
  reportsSubmitted: number;
}

/**
 * RefereeDashboard Component
 * Página inicial para árbitros com resumo de atividade
 */
const RefereeDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMatches: 0,
    matchesThisMonth: 0,
    reportsSubmitted: 0
  });
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do dashboard
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do dashboard
      const dashboardData = await refereeService.getRefereeDashboard(token || undefined);
      
      if (dashboardData) {
        setStats({
          totalMatches: dashboardData.totalMatches || 0,
          matchesThisMonth: dashboardData.matchesThisMonth || 0,
          reportsSubmitted: dashboardData.reportsSubmitted || 0
        });
        setUpcomingMatches(dashboardData.upcomingMatches || []);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Recarregar dados ao puxar
  const handleRefresh = async (event: CustomEvent<any>) => {
    try {
      await loadDashboard();
    } finally {
      event.detail.complete();
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboard();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  if (loading && upcomingMatches.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Dashboard do Árbitro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando dashboard..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => navigate('/profile')}>
            <IonIcon icon={settings} />
          </IonButton>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      {/* CONTENT */}
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refresh}
            pullingText="Puxe para recarregar"
            refreshingSpinner="crescent"
            refreshingText="Recarregando..."
          />
        </IonRefresher>

        {/* Mensagem de Boas-vindas e Perfil */}
        <div className="referee-dashboard-header ion-margin">
          <div className="profile-section">
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
            )}
            <div className="profile-info">
              <h1 className="greeting">👋 Bem-vindo, {user?.name?.split(' ')[0]}!</h1>
              <p className="status">
                ✅ Status: Aprovado
              </p>
            </div>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="ion-margin">
          <h2 className="section-title">📊 Estatísticas</h2>
          <IonGrid className="stats-grid">
            <IonRow>
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <StatsCard
                  title="Total de Jogos"
                  value={stats.totalMatches}
                  icon={calendar}
                  color="primary"
                  onClick={() => navigate('/referee/matches')}
                />
              </IonCol>
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <StatsCard
                  title="Este Mês"
                  value={stats.matchesThisMonth}
                  icon={calendar}
                  color="success"
                />
              </IonCol>
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <StatsCard
                  title="Relatórios"
                  value={stats.reportsSubmitted}
                  icon={documentText}
                  color="warning"
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* PRÓXIMOS JOGOS */}
        <div className="ion-margin">
          <div className="section-header">
            <h2 className="section-title">🎯 Próximos Jogos</h2>
            <IonButton fill="clear" size="small" onClick={() => navigate('/referee/matches')}>
              Ver Todos
            </IonButton>
          </div>

          {upcomingMatches && upcomingMatches.length > 0 ? (
            <div className="matches-list">
              {upcomingMatches.slice(0, 3).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onDetailsClick={() => navigate(`/referee/matches/${match.id}`)}
                  showScore={false}
                />
              ))}
              {upcomingMatches.length > 3 && (
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={() => navigate('/referee/matches')}
                  className="ion-margin-top"
                >
                  Ver {upcomingMatches.length - 3} jogos a mais
                </IonButton>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-message">Sem jogos atribuídos no momento</p>
            </div>
          )}
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="ion-margin ion-margin-bottom">
          <h2 className="section-title">⚡ Ações Rápidas</h2>
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  color="primary"
                  onClick={() => navigate('/referee/matches')}
                >
                  Meus Jogos
                </IonButton>
              </IonCol>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  color="secondary"
                  onClick={() => navigate('/profile')}
                >
                  Definições
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>

      {/* Toast para erros */}
      <IonToast
        isOpen={!!error}
        onDidDismiss={() => setError(null)}
        message={error}
        duration={3000}
        color="danger"
      />
    </IonPage>
  );
};

export default RefereeDashboard;
