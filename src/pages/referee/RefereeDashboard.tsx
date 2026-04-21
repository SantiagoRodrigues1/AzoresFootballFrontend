/**
 * RefereeDashboard.tsx
 * Dashboard principal para árbitros aprovados
 * 
 * Mostra APENAS os jogos atribuídos ao árbitro:
 * - Equipas, data/hora, estádio
 * - Equipa de arbitragem completa (4 árbitros com tipos)
 * - A função deste árbitro em cada jogo
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
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardContent,
} from '@ionic/react';
import {
  settings,
  logOut,
  refresh,
  footballOutline,
  calendarOutline,
  locationOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import refereeService from '@/services/refereeService';
import './RefereeDashboard.css';

interface RefereeTeamEntry {
  referee: {
    _id: string;
    name: string;
    tipo?: string;
    photo?: string;
  };
  tipo: string;
}

interface MatchData {
  _id: string;
  homeTeam: { _id: string; name?: string; equipa?: string; logo?: string };
  awayTeam: { _id: string; name?: string; equipa?: string; logo?: string };
  date: string;
  time?: string;
  stadium?: string;
  status: string;
  competition?: { _id: string; name: string };
  refereeTeam?: RefereeTeamEntry[];
  myRole?: string;
  homeScore?: number;
  awayScore?: number;
}

const RefereeDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await refereeService.getMyMatches(token || undefined);
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<any>) => {
    try {
      await loadMatches();
    } finally {
      event.detail.complete();
    }
  };

  useEffect(() => {
    loadMatches();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatTime = (dateStr: string, time?: string) => {
    if (time) return time;
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      scheduled: { label: 'Agendado', color: 'primary' },
      live: { label: 'Ao Vivo', color: 'danger' },
      finished: { label: 'Terminado', color: 'medium' },
      cancelled: { label: 'Cancelado', color: 'dark' },
    };
    const s = map[status] || { label: status, color: 'medium' };
    return <IonBadge color={s.color}>{s.label}</IonBadge>;
  };

  if (loading && matches.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Meus Jogos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando jogos..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Meus Jogos</IonTitle>
          <IonButton slot="end" fill="clear" color="light" onClick={() => navigate('/profile')}>
            <IonIcon icon={settings} />
          </IonButton>
          <IonButton slot="end" fill="clear" color="light" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refresh}
            pullingText="Puxe para recarregar"
            refreshingSpinner="crescent"
            refreshingText="Recarregando..."
          />
        </IonRefresher>

        {/* Welcome */}
        <div className="referee-dashboard-header ion-margin">
          <div className="profile-section">
            <div className="profile-info">
              <h1 className="greeting">Bem-vindo, {user?.name?.split(' ')[0]}!</h1>
              <p className="status">
                {matches.length} jogo{matches.length !== 1 ? 's' : ''} atribuído{matches.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Match list */}
        <div className="ion-margin">
          {matches.length > 0 ? (
            matches.map((match) => (
              <IonCard key={match._id} className="mb-3">
                <IonCardHeader className="pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IonIcon icon={footballOutline} color="primary" />
                      <span className="font-bold text-base">
                        {match.homeTeam?.equipa || match.homeTeam?.name} vs {match.awayTeam?.equipa || match.awayTeam?.name}
                      </span>
                    </div>
                    {getStatusBadge(match.status)}
                  </div>
                  {match.status === 'finished' && (
                    <p className="text-lg font-bold mt-1">{match.homeScore ?? 0} - {match.awayScore ?? 0}</p>
                  )}
                </IonCardHeader>
                <IonCardContent>
                  {/* My role */}
                  {match.myRole && (
                    <div className="mb-2">
                      <IonBadge color="tertiary">{match.myRole}</IonBadge>
                    </div>
                  )}

                  {/* Date/time/stadium */}
                  <div className="flex flex-col gap-1 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <IonIcon icon={calendarOutline} />
                      <span>{formatDate(match.date)} {formatTime(match.date, match.time)}</span>
                    </div>
                    {match.stadium && (
                      <div className="flex items-center gap-2">
                        <IonIcon icon={locationOutline} />
                        <span>{match.stadium}</span>
                      </div>
                    )}
                    {match.competition && (
                      <div className="flex items-center gap-2">
                        <IonIcon icon={footballOutline} />
                        <span>{match.competition.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Referee team */}
                  {match.refereeTeam && match.refereeTeam.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <IonIcon icon={peopleOutline} />
                        <span className="font-semibold text-sm">Equipa de Arbitragem</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {match.refereeTeam.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm pl-2">
                            <span className="text-muted-foreground min-w-[140px]">{entry.tipo}:</span>
                            <span className="font-medium">{entry.referee?.name || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="empty-state text-center py-8">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-muted-foreground">Sem jogos atribuídos no momento</p>
            </div>
          )}
        </div>
      </IonContent>

      <IonToast
        isOpen={!!error}
        onDidDismiss={() => setError(null)}
        message={error || ''}
        duration={3000}
        color="danger"
      />
    </IonPage>
  );
};

export default RefereeDashboard;
