/**
 * MatchCard.tsx
 * Card reutilizável para exibir informações de um jogo
 * 
 * Uso:
 * <MatchCard 
 *   match={match} 
 *   onDetailsClick={() => navigate(`/referee/matches/${match.id}`)}
 * />
 */

import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { IonCard, IonCardContent, IonButton, IonIcon, IonBadge, IonGrid, IonRow, IonCol } from '@ionic/react';
import { chevronForward, location, calendar } from 'ionicons/icons';

interface MatchCardProps {
  match: {
    id: string;
    homeTeam: { name: string; logo?: string };
    awayTeam: { name: string; logo?: string };
    homeScore?: number;
    awayScore?: number;
    status: string;
    date: string;
    venue: string;
    competition: string;
  };
  onDetailsClick?: () => void;
  showScore?: boolean;
  showStatus?: boolean;
}

/**
 * Componente de Card do Jogo
 * Exibe informações básicas de um jogo de forma clara e profissional
 */
const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onDetailsClick,
  showScore = true,
  showStatus = true
}) => {
  // Formatar data
  const matchDate = new Date(match.date);
  const formattedDate = format(matchDate, "d MMM, HH:mm", { locale: pt });
  
  // Cor do badge baseado no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'warning';
      case 'live':
        return 'danger';
      case 'halftime':
        return 'danger';
      case 'finished':
        return 'success';
      case 'postponed':
        return 'medium';
      default:
        return 'medium';
    }
  };

  // Texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'live':
        return 'Em Direto';
      case 'halftime':
        return 'Intervalo';
      case 'finished':
        return 'Terminado';
      case 'postponed':
        return 'Adiado';
      default:
        return status;
    }
  };

  return (
    <IonCard className="match-card">
      <IonCardContent className="ion-no-padding">
        <IonGrid className="ion-no-padding ion-margin">
          {/* Header: Competição e Status */}
          <IonRow className="ion-align-items-center ion-margin-bottom">
            <IonCol size="12" sizeMd="6">
              <span className="text-sm text-muted-foreground">{match.competition}</span>
            </IonCol>
            {showStatus && (
              <IonCol size="12" sizeMd="6" className="ion-text-right">
                <IonBadge color={getStatusColor(match.status)}>
                  {getStatusText(match.status)}
                </IonBadge>
              </IonCol>
            )}
          </IonRow>

          {/* Equipas */}
          <IonRow className="ion-align-items-center ion-margin-bottom">
            <IonCol size="4" className="ion-text-center">
              <div className="team">
                {match.homeTeam.logo && (
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name}
                    className="team-logo"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <p className="team-name">{match.homeTeam.name}</p>
              </div>
            </IonCol>

            <IonCol size="4" className="ion-text-center">
              {showScore && match.status === 'finished' ? (
                <div className="score-final">
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
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name}
                    className="team-logo"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <p className="team-name">{match.awayTeam.name}</p>
              </div>
            </IonCol>
          </IonRow>

          {/* Info: Data, Local */}
          <IonRow className="ion-margin-bottom ion-text-center">
            <IonCol size="12">
              <div className="match-info">
                <span className="info-item">
                  <IonIcon icon={calendar} />
                  {formattedDate}
                </span>
                <span className="info-item">
                  <IonIcon icon={location} />
                  {match.venue}
                </span>
              </div>
            </IonCol>
          </IonRow>

          {/* Botão Detalhes */}
          {onDetailsClick && (
            <IonRow>
              <IonCol size="12">
                <IonButton 
                  onClick={onDetailsClick}
                  expand="block"
                  color="primary"
                >
                  Ver Detalhes
                  <IonIcon icon={chevronForward} slot="end" />
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>

      <style>{`
        .match-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .team-logo {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
        }

        .team-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--ion-text-color);
          margin: 0;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .score-final {
          font-size: 20px;
          font-weight: bold;
          color: var(--ion-color-primary);
        }

        .score-value {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .time {
          font-size: 14px;
        }

        .time-value {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--ion-color-primary);
        }

        .match-info {
          display: flex;
          gap: 16px;
          justify-content: center;
          font-size: 12px;
          color: var(--ion-color-medium);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .info-item ion-icon {
          font-size: 14px;
        }
      `}</style>
    </IonCard>
  );
};

export default MatchCard;
