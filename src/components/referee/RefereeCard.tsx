/**
 * RefereeCard.tsx
 * Card reutilizável para exibir informações de um árbitro
 * Usado na seleção de árbitros (Admin)
 * 
 * Uso:
 * <RefereeCard 
 *   referee={referee}
 *   isSelected={selectedId === referee.id}
 *   onSelect={() => handleSelect(referee.id)}
 * />
 */

import React from 'react';
import { IonCard, IonCardContent, IonButton, IonIcon, IonBadge, IonGrid, IonRow, IonCol } from '@ionic/react';
import { checkmarkCircle, ellipse } from 'ionicons/icons';

interface RefereeCardProps {
  referee: {
    id: string;
    name: string;
    email?: string;
    federacao?: string;
    categoria?: string;
    avatar?: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  selectionType?: 'main' | 'assistant1' | 'assistant2' | 'fourthReferee';
  disabled?: boolean;
}

const selectionTypeLabels: Record<string, string> = {
  main: '🎯 Árbitro Principal',
  assistant1: '⚪ Assistente 1',
  assistant2: '⚪ Assistente 2',
  fourthReferee: '🟡 4º Árbitro'
};

/**
 * Componente de Card do Árbitro
 * Exibe informações de um árbitro com opção de seleção
 */
const RefereeCard: React.FC<RefereeCardProps> = ({
  referee,
  isSelected = false,
  onSelect,
  selectionType,
  disabled = false
}) => {
  return (
    <IonCard 
      className={`referee-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <IonCardContent className="ion-no-padding">
        <IonGrid className="ion-no-padding ion-margin">
          {/* Avatar e Info Básica */}
          <IonRow className="ion-align-items-center ion-margin-bottom">
            <IonCol size="auto">
              {referee.avatar ? (
                <img src={referee.avatar} alt={referee.name} className="referee-avatar" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="referee-avatar-placeholder">
                  {referee.name.charAt(0).toUpperCase()}
                </div>
              )}
            </IonCol>

            <IonCol>
              <div>
                <h3 className="referee-name">{referee.name}</h3>
                <p className="referee-email">{referee.email}</p>
              </div>
            </IonCol>

            {/* Ícone de Seleção */}
            <IonCol size="auto">
              {isSelected ? (
                <IonIcon icon={checkmarkCircle} color="success" className="selection-icon" />
              ) : (
                <IonIcon icon={ellipse} color="medium" className="selection-icon" />
              )}
            </IonCol>
          </IonRow>

          {/* Informações Adicionais */}
          {(referee.categoria || referee.federacao) && (
            <IonRow className="ion-margin-bottom ion-text-center">
              <IonCol size="12">
                <div className="referee-details">
                  {referee.categoria && (
                    <IonBadge color="primary">{referee.categoria}</IonBadge>
                  )}
                  {referee.federacao && (
                    <span className="text-xs text-muted-foreground">{referee.federacao}</span>
                  )}
                </div>
              </IonCol>
            </IonRow>
          )}

          {/* Tipo de Seleção (se especificado) */}
          {selectionType && isSelected && (
            <IonRow className="ion-margin-bottom">
              <IonCol size="12" className="ion-text-center">
                <IonBadge color="success">
                  {selectionTypeLabels[selectionType]}
                </IonBadge>
              </IonCol>
            </IonRow>
          )}

          {/* Botão de Seleção */}
          {onSelect && (
            <IonRow>
              <IonCol size="12">
                <IonButton 
                  onClick={onSelect}
                  expand="block"
                  color={isSelected ? 'success' : 'default'}
                  disabled={disabled}
                >
                  {isSelected ? '✓ Selecionado' : 'Selecionar'}
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>

      <style>{`
        .referee-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .referee-card:hover:not(.disabled) {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .referee-card.selected {
          border-color: var(--ion-color-success);
          background-color: rgba(54, 211, 153, 0.1);
        }

        .referee-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .referee-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .referee-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-primary-shade));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .referee-name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--ion-text-color);
        }

        .referee-email {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: var(--ion-color-medium);
        }

        .referee-details {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .selection-icon {
          font-size: 28px;
        }
      `}</style>
    </IonCard>
  );
};

export default RefereeCard;
