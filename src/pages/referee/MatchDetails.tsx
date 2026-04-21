/**
 * MatchDetails.tsx
 * Página com detalhes completos de um jogo
 * 
 * Mostra:
 * - Informações do jogo (equipas, local, etc)
 * - Equipa de arbitragem (4 árbitros)
 * - Botões de ação (confirmar presença, indisponível, enviar relatório)
 */

import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLoading,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonAlert,
  IonBadge
} from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import matchService from '@/services/matchService';
import refereeService from '@/services/refereeService';
import { arrowBack, calendar, location, checkmarkCircle, closeCircle, documentText } from 'ionicons/icons';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import './MatchDetails.css';

interface Match {
  id: string;
  homeTeam: { name: string; logo?: string; id: string };
  awayTeam: { name: string; logo?: string; id: string };
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
  date: string;
  venue: string;
  competition: string;
  referees?: {
    main?: string;
    assistant1?: string;
    assistant2?: string;
    fourthReferee?: string;
  };
}

/**
 * MatchDetails Component
 * Detalhes completos de um jogo atribuído ao árbitro
 */
const MatchDetails: React.FC = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Carregar detalhes do jogo
  const loadMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!matchId) {
        setError('ID do jogo inválido');
        return;
      }

      const matchData = await matchService.getMatchById(matchId, token || undefined);
      setMatch(matchData);
    } catch (err) {
      setError('Erro ao carregar detalhes do jogo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar presença
  const handleConfirmAttendance = async () => {
    try {
      if (!matchId) return;
      
      setLoading(true);
      await refereeService.confirmRefereeAttendance(matchId, token || undefined);
      setSuccess('✅ Presença confirmada com sucesso!');
      setShowConfirmDialog(false);
      loadMatch();
    } catch (err) {
      setError('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Marcar como indisponível
  const handleMarkUnavailable = async () => {
    try {
      if (!matchId) return;
      
      setLoading(true);
      await refereeService.markRefereeUnavailable(matchId, token || undefined);
      setSuccess('⚠️ Marcado como indisponível');
      loadMatch();
    } catch (err) {
      setError('Erro ao marcar indisponibilidade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
  }, [matchId, token]);

  if (loading && !match) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Detalhes do Jogo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando detalhes..." />
        </IonContent>
      </IonPage>
    );
  }

  if (!match) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Detalhes do Jogo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-padding ion-text-center">
            <p className="text-lg text-danger">Jogo não encontrado</p>
            <IonButton onClick={() => navigate(-1)}>Voltar</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const matchDate = new Date(match.date);
  const formattedDate = format(matchDate, "EEEE, d MMMM 'de' yyyy 'às' HH:mm", { locale: pt });

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Detalhes do Jogo</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* CONTENT */}
      <IonContent>
        {/* CARD: INFORMAÇÕES DO JOGO */}
        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle className="text-center">
              <div className="match-competition">{match.competition}</div>
              <Badge color={match.status === 'finished' ? 'success' : 'primary'}>
                {match.status === 'finished' ? '✓ Terminado' : '🔵 Agendado'}
              </Badge>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonGrid className="ion-no-padding">
              {/* Equipas e Placar */}
              <IonRow className="ion-margin-bottom match-score">
                <IonCol size="4" className="ion-text-center">
                  <div className="team">
                    {match.homeTeam.logo && (
                      <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="team-logo" />
                    )}
                    <p className="team-name">{match.homeTeam.name}</p>
                  </div>
                </IonCol>

                <IonCol size="4" className="ion-text-center">
                  {match.status === 'finished' ? (
                    <div className="score">
                      <p className="score-value">{match.homeScore} - {match.awayScore}</p>
                    </div>
                  ) : (
                    <div className="time">
                      <p className="time-value">{format(matchDate, 'HH:mm')}</p>
                    </div>
                  )}
                </IonCol>

                <IonCol size="4" className="ion-text-center">
                  <div className="team">
                    {match.awayTeam.logo && (
                      <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="team-logo" />
                    )}
                    <p className="team-name">{match.awayTeam.name}</p>
                  </div>
                </IonCol>
              </IonRow>

              {/* Detalhes: Data e Local */}
              <IonRow className="match-details">
                <IonCol size="12" className="ion-margin-bottom">
                  <div className="detail-item">
                    <IonIcon icon={calendar} />
                    <span>{formattedDate}</span>
                  </div>
                </IonCol>
                <IonCol size="12">
                  <div className="detail-item">
                    <IonIcon icon={location} />
                    <span>{match.venue}</span>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* CARD: EQUIPA DE ARBITRAGEM */}
        {match.referees && (
          <IonCard className="ion-margin">
            <IonCardHeader>
              <IonCardTitle>⚽ Equipa de Arbitragem</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="referees-list">
                {match.referees.main && (
                  <div className="referee-item">
                    <span className="referee-role">🎯 Árbitro Principal</span>
                    <span className="referee-name">Árbitro Designado</span>
                  </div>
                )}
                {match.referees.assistant1 && (
                  <div className="referee-item">
                    <span className="referee-role">⚪ Assistente 1</span>
                    <span className="referee-name">Assistente Designado</span>
                  </div>
                )}
                {match.referees.assistant2 && (
                  <div className="referee-item">
                    <span className="referee-role">⚪ Assistente 2</span>
                    <span className="referee-name">Assistente Designado</span>
                  </div>
                )}
                {match.referees.fourthReferee && (
                  <div className="referee-item">
                    <span className="referee-role">🟡 4º Árbitro</span>
                    <span className="referee-name">4º Árbitro Designado</span>
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* AÇÕES */}
        <div className="ion-margin">
          <h3 className="section-title">⚡ Ações</h3>
          <IonGrid className="ion-no-padding">
            {match.status !== 'finished' ? (
              <>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonButton 
                      expand="block" 
                      color="success"
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      <IonIcon icon={checkmarkCircle} slot="start" />
                      Confirmar Presença
                    </IonButton>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonButton 
                      expand="block" 
                      color="danger"
                      onClick={handleMarkUnavailable}
                    >
                      <IonIcon icon={closeCircle} slot="start" />
                      Morcar Indisponível
                    </IonButton>
                  </IonCol>
                </IonRow>
              </>
            ) : (
              <IonRow>
                <IonCol size="12">
                  <IonButton 
                    expand="block" 
                    color="primary"
                    onClick={() => navigate(`/referee/matches/${matchId}/upload-report`)}
                  >
                    <IonIcon icon={documentText} slot="start" />
                    Enviar Relatório
                  </IonButton>
                </IonCol>
              </IonRow>
            )}
          </IonGrid>
        </div>
      </IonContent>

      {/* AlertDialog: Confirmar Presença */}
      <IonAlert
        isOpen={showConfirmDialog}
        onDidDismiss={() => setShowConfirmDialog(false)}
        header="Confirmar Presença"
        message={`Vai confirmar a sua presença no jogo ${match.homeTeam.name} vs ${match.awayTeam.name}?`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Confirmar',
            handler: handleConfirmAttendance,
            cssClass: 'alert-button-confirm'
          }
        ]}
      />

      {/* Toast: Sucesso */}
      <IonToast
        isOpen={!!success}
        onDidDismiss={() => setSuccess(null)}
        message={success}
        duration={3000}
        color="success"
      />

      {/* Toast: Erro */}
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

// Componente Badge auxiliar
const Badge: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{
    display: 'inline-block',
    backgroundColor: color === 'success' ? '#36d399' : '#3b82f6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '8px'
  }}>
    {children}
  </span>
);

export default MatchDetails;
