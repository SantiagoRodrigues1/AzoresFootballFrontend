/**
 * ActionButtons.tsx
 * Quick action buttons for live match events
 * Optimized for mobile with large touch targets
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import './ActionButtons.css';

export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';

interface ActionButtonsProps {
  onGoal?: () => void;
  onCard?: () => void;
  onSubstitution?: () => void;
  onAddedTime?: () => void;
  isLoading?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onGoal,
  onCard,
  onSubstitution,
  onAddedTime,
  isLoading = false
}) => {
  const actions = [
    {
      id: 'goal',
      label: 'Golo',
      icon: '⚽',
      onClick: onGoal,
      color: 'goal-btn',
      description: 'Registar golo'
    },
    {
      id: 'card',
      label: 'Cartão',
      icon: '🟨',
      onClick: onCard,
      color: 'card-btn',
      description: 'Registar cartão'
    },
    {
      id: 'substitution',
      label: 'Substituição',
      icon: '🔄',
      onClick: onSubstitution,
      color: 'sub-btn',
      description: 'Registar substituição'
    },
    {
      id: 'time',
      label: 'Tempo +',
      icon: '⏱️',
      onClick: onAddedTime,
      color: 'time-btn',
      description: 'Adicionar tempo'
    }
  ];

  return (
    <motion.div
      className="action-buttons"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="action-buttons-container">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            className={`action-btn ${action.color}`}
            onClick={action.onClick}
            disabled={isLoading}
            title={action.description}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="btn-icon">{action.icon}</span>
            <span className="btn-label">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {isLoading && (
        <div className="saving-indicator">
          <Zap className="w-4 h-4" />
          <span>Guardando...</span>
        </div>
      )}
    </motion.div>
  );
};

export default ActionButtons;
