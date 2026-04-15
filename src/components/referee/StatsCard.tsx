/**
 * StatsCard.tsx
 * Card reutilizável para exibir estatísticas
 * 
 * Uso:
 * <StatsCard
 *   title="Total de Jogos"
 *   value={42}
 *   icon={statistics}
 *   color="primary"
 * />
 */

import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  onClick?: () => void;
}

/**
 * Componente de Card de Estatísticas
 * Mostra um valor com ícone, título e informação de tendência opcional
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  onClick
}) => {
  return (
    <IonCard 
      className={`stats-card stats-card-${color}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <IonCardContent className="ion-no-padding ion-margin">
        <div className="stats-content">
          <div className="stats-icon">
            <IonIcon icon={icon} color={color} />
          </div>
          
          <div className="stats-info">
            <p className="stats-title">{title}</p>
            <p className="stats-value">{value}</p>
            
            {trend && (
              <p className={`stats-trend trend-${trend.direction}`}>
                {trend.direction === 'up' ? '📈' : '📉'} {trend.label}
              </p>
            )}
          </div>
        </div>
      </IonCardContent>

      <style>{`
        .stats-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .stats-card-primary {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
        }

        .stats-card-success {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
        }

        .stats-card-danger {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
        }

        .stats-card-warning {
          background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05));
        }

        .stats-content {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .stats-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
        }

        .stats-icon ion-icon {
          font-size: 24px;
        }

        .stats-info {
          flex: 1;
        }

        .stats-title {
          margin: 0;
          font-size: 12px;
          color: var(--ion-color-medium);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-value {
          margin: 8px 0 0 0;
          font-size: 28px;
          font-weight: 700;
          color: var(--ion-text-color);
        }

        .stats-trend {
          margin: 4px 0 0 0;
          font-size: 12px;
          font-weight: 500;
        }

        .stats-trend.trend-up {
          color: var(--ion-color-success);
        }

        .stats-trend.trend-down {
          color: var(--ion-color-danger);
        }
      `}</style>
    </IonCard>
  );
};

export default StatsCard;
