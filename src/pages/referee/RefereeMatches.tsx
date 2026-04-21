/**
 * RefereeMatches.tsx
 * Página com a lista de jogos atribuídos ao árbitro
 * 
 * Mostra:
 * - Próximos jogos
 * - Jogos passados (terminados)
 * - Filtros por status
 */

import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLoading,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import refereeService from '@/services/refereeService';
import matchService from '@/services/matchService';
import MatchCard from '@/components/referee/MatchCard';
import { refresh, arrowBack } from 'ionicons/icons';
import './RefereeMatches.css';

interface Match {
  id: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
  date: string;
  venue: string;
  competition: string;
}

type MatchFilter = 'upcoming' | 'finished';

/**
 * RefereeMatches Component
 * Lista de jogos atribuídos ao árbitro
 */
const RefereeMatches: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MatchFilter>('upcoming');
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Obter jogos do árbitro
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const matches = await refereeService.getMyMatches(token || undefined);
      setAllMatches(Array.isArray(matches) ? matches : []);
    } catch (err) {
      setError('Erro ao carregar os seus jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Recarregar dados ao puxar
  const handleRefresh = async (event: CustomEvent<any>) => {
    try {
      await loadMatches();
    } finally {
      event.detail.complete();
    }
  };

  // Carregar dados ao montar
  useEffect(() => {
    loadMatches();
  }, [user?.id, token]);

  // Filtrar jogos
  const filteredMatches = allMatches.filter(match => {
    if (filter === 'upcoming') {
      return match.status !== 'finished';
    } else {
      return match.status === 'finished';
    }
  });

  const upcomingCount = allMatches.filter(m => m.status !== 'finished').length;
  const finishedCount = allMatches.filter(m => m.status === 'finished').length;

  if (loading && allMatches.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
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
      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Meus Jogos</IonTitle>
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

        {/* FILTRO */}
        <div className="ion-margin-top ion-margin">
          <IonSegment 
            value={filter} 
            onIonChange={(e) => setFilter(e.detail.value as MatchFilter)}
          >
            <IonSegmentButton value="upcoming">
              <IonLabel>
                Próximos ({upcomingCount})
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finished">
              <IonLabel>
                Terminados ({finishedCount})
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* LISTA DE JOGOS */}
        <div className="ion-margin">
          {filteredMatches && filteredMatches.length > 0 ? (
            <div className="matches-list">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onDetailsClick={() => navigate(`/referee/matches/${match.id}`)}
                  showScore={true}
                  showStatus={true}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">
                {filter === 'upcoming' ? '📭' : '📋'}
              </p>
              <p className="empty-message">
                {filter === 'upcoming' 
                  ? 'Sem jogos próximos atribuídos' 
                  : 'Sem jogos terminados'}
              </p>
              <IonButton 
                fill="outline" 
                size="small"
                onClick={() => navigate('/referee/dashboard')}
              >
                Voltar ao Dashboard
              </IonButton>
            </div>
          )}
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

export default RefereeMatches;
