import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

type ConditionStatus = 'available' | 'doubtful' | 'injured' | 'suspended';

interface PlayerConditionBadgeProps {
  status: ConditionStatus;
  showLabel?: boolean;
}

export const PlayerConditionBadge: React.FC<PlayerConditionBadgeProps> = ({
  status,
  showLabel = false,
}) => {
  const getConditionConfig = (status: ConditionStatus) => {
    switch (status) {
      case 'available':
        return {
          icon: CheckCircle,
          color: 'text-green-500 bg-green-50',
          label: 'Disponível',
          badge: '🟢',
        };
      case 'doubtful':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500 bg-yellow-50',
          label: 'Incerto',
          badge: '🟡',
        };
      case 'injured':
        return {
          icon: AlertCircle,
          color: 'text-red-500 bg-red-50',
          label: 'Lesionado',
          badge: '🔴',
        };
      case 'suspended':
        return {
          icon: AlertCircle,
          color: 'text-purple-500 bg-purple-50',
          label: 'Suspenso',
          badge: '⛔',
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-500 bg-gray-50',
          label: 'Desconhecido',
          badge: '⚪',
        };
    }
  };

  const config = getConditionConfig(status);
  const Icon = config.icon;

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    );
  }

  return (
    <div className="text-sm" title={config.label}>
      {config.badge}
    </div>
  );
};
