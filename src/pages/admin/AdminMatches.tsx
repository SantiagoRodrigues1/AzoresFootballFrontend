/**
 * AdminMatches.tsx
 * Página ADMIN para gerir todos os jogos e atribuir árbitros
 * 
 * Mostra:
 * - Lista de todos os jogos
 * - Botão para selecionar árbitros
 * - Status de atribuição de árbitros
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
  IonButtons,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import matchService from '@/services/matchService';
import { refresh, arrowBack, peopleOutline, add } from 'ionicons/icons';
import { CreateMatchModal } from '@/components/admin/CreateMatchModal';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import './AdminMatches.css';

interface Match {
  id?: string;
  _id?: string;
  homeTeam: any; // { name?: string; equipa?: string; logo?: string } | string
  awayTeam: any; // same as homeTeam
  status?: string;
  date?: string;
  venue?: string;
  competition?: string;
  // suportar ambos formatos: { main, assistant1, ... } ou campo singular `referee`
  referees?: {
    main?: string;
    assistant1?: string;
    assistant2?: string;
    fourthReferee?: string;
  };
  referee?: any;
}

type MatchFilter = 'all' | 'with-referees' | 'without-referees';

/**
 * AdminMatches Component
 * Página ADMIN para gerir jogos
 */
const AdminMatches: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Carregar todos os jogos
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const matches = await matchService.getAllAdminMatches(token || undefined);
      setAllMatches(matches);
    } catch (err) {
      setError('Erro ao carregar jogos. Tente novamente.');
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

  useEffect(() => {
    loadMatches();
  }, [token]);

  // Filtrar jogos
  const filteredMatches = allMatches.filter(match => {
    const hasAnyReferees = !!(
      match.referees && (
        match.referees.main || match.referees.assistant1 || match.referees.assistant2 || match.referees.fourthReferee
      )
    ) || !!match.referee;

    if (filter === 'with-referees') {
      return hasAnyReferees;
    } else if (filter === 'without-referees') {
      return !hasAnyReferees;
    } else {
      return true;
    }
  });

  const withRefereesCount = allMatches.filter(m => {
    return !!(
      (m.referees && (m.referees.main || m.referees.assistant1 || m.referees.assistant2 || m.referees.fourthReferee))
      || m.referee
    );
  }).length;

  const withoutRefereesCount = allMatches.length - withRefereesCount;

  // Verificar se tem árbitros atribuídos
  const hasReferees = (match: Match) => {
    return !!(
      (match.referees && (match.referees.main || match.referees.assistant1 || match.referees.assistant2 || match.referees.fourthReferee))
      || match.referee
    );
  };

  if (loading && allMatches.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Gestão de Jogos</IonTitle>
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
          <IonTitle>Gestão de Jogos</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowCreateModal(true)}>
              <IonIcon icon={add} slot="start" />
              Novo Jogo
            </IonButton>
          </IonButtons>
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

        {/* STATS */}
        <div className="ion-margin">
          <IonGrid className="stats-grid">
            <IonRow>
              <IonCol size="12" sizeMd="4">
                <div className="stat-box">
                  <p className="stat-value">{allMatches.length}</p>
                  <p className="stat-label">Total de Jogos</p>
                </div>
              </IonCol>
              <IonCol size="12" sizeMd="4">
                <div className="stat-box success">
                  <p className="stat-value">{withRefereesCount}</p>
                  <p className="stat-label">Com Árbitros</p>
                </div>
              </IonCol>
              <IonCol size="12" sizeMd="4">
                <div className="stat-box danger">
                  <p className="stat-value">{withoutRefereesCount}</p>
                  <p className="stat-label">Sem Árbitros</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* FILTRO */}
        <div className="ion-margin">
          <IonSegment 
            value={filter} 
            onIonChange={(e) => setFilter(e.detail.value as MatchFilter)}
          >
            <IonSegmentButton value="all">
              <IonLabel>Todos ({allMatches.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="with-referees">
              <IonLabel>Com ✓ ({withRefereesCount})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="without-referees">
              <IonLabel>Sem ✗ ({withoutRefereesCount})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* LISTA DE JOGOS */}
        <div className="ion-margin">
          {filteredMatches && filteredMatches.length > 0 ? (
            <div className="matches-list">
              {filteredMatches.map((match) => {
                const matchDate = new Date(match.date);
                const formattedDate = format(matchDate, 'd MMM HH:mm', { locale: pt });

                return (
                  <IonCard key={match.id || match._id} className="match-admin-card">
                    <IonCardContent className="ion-no-padding">
                      <IonGrid className="ion-no-padding">
                        {/* Header: Teams & Status */}
                        <IonRow className="card-header ion-align-items-center">
                          <IonCol size="8">
                            <div className="teams-info">
                              <strong>{match.homeTeam?.name || match.homeTeam?.equipa || (typeof match.homeTeam === 'string' ? match.homeTeam : '')}</strong>
                              <span className="vs"> vs </span>
                              <strong>{match.awayTeam?.name || match.awayTeam?.equipa || (typeof match.awayTeam === 'string' ? match.awayTeam : '')}</strong>
                            </div>
                            <p className="match-competition">{match.competition}</p>
                          </IonCol>
                          <IonCol size="4" className="ion-text-right">
                            {hasReferees(match) ? (
                              <IonBadge color="success">✓ Com Árbitros</IonBadge>
                            ) : (
                              <IonBadge color="danger">✗ Sem Árbitros</IonBadge>
                            )}
                          </IonCol>
                        </IonRow>

                        {/* Info: Date & Venue */}
                        <IonRow className="card-info ion-margin-top">
                          <IonCol size="12">
                            <p className="info-item">📅 {formattedDate}</p>
                            <p className="info-item">📍 {match.venue}</p>
                          </IonCol>
                        </IonRow>

                        {/* Referees Info */}
                        {hasReferees(match) && (
                          <IonRow className="card-referees ion-margin-top">
                            <IonCol size="12">
                              <p className="referees-label">⚽ Árbitros Atribuídos:</p>
                              <ul className="referees-list">
                                {match.referees ? (
                                  <>
                                    {match.referees.main && <li>🎯 Principal: <strong>{match.referees.main}</strong></li>}
                                    {match.referees.assistant1 && <li>⚪ Assistente 1: <strong>{match.referees.assistant1}</strong></li>}
                                    {match.referees.assistant2 && <li>⚪ Assistente 2: <strong>{match.referees.assistant2}</strong></li>}
                                    {match.referees.fourthReferee && <li>🟡 4º Árbitro: <strong>{match.referees.fourthReferee}</strong></li>}
                                  </>
                                ) : match.referee ? (
                                  <li>🎯 Principal: <strong>{match.referee.name || match.referee}</strong></li>
                                ) : null}
                              </ul>
                            </IonCol>
                          </IonRow>
                        )}

                        {/* Action Button */}
                        <IonRow className="card-action ion-margin-top">
                          <IonCol size="12">
                            <IonButton 
                              expand="block" 
                              color={hasReferees(match) ? 'secondary' : 'primary'}
                              onClick={() => navigate(`/admin/matches/${match.id || match._id}/assign-referees`)}
                            >
                              <IonIcon icon={peopleOutline} slot="start" />
                              {hasReferees(match) ? 'Alterar Árbitros' : 'Selecionar Árbitros'}
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-message">Sem jogos para mostrar</p>
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

      <CreateMatchModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        token={token || ''}
        onSave={() => {
          setShowCreateModal(false);
          loadMatches();
        }}
      />
    </IonPage>
  );
};

export default AdminMatches;
