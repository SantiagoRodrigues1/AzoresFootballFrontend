import React from 'react';
import { X, Check } from 'lucide-react';
import { PlayerConditionBadge } from './PlayerConditionBadge';

type PlayerCondition = 'available' | 'doubtful' | 'injured' | 'suspended';

interface PlayerCardWithConditionProps {
  playerNumber: number;
  playerName: string;
  position: string;
  condition: PlayerCondition;
  isSelected: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
}

export const PlayerCardWithCondition: React.FC<PlayerCardWithConditionProps> = ({
  playerNumber,
  playerName,
  position,
  condition,
  isSelected,
  isCaptain = false,
  isViceCaptain = false,
  onSelect,
  onDeselect,
}) => {
  const handleToggle = () => {
    if (isSelected && onDeselect) {
      onDeselect();
    } else if (!isSelected && onSelect) {
      onSelect();
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`rounded-lg p-3 cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
      } ${condition === 'injured' || condition === 'suspended' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {playerNumber}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate flex items-center gap-1">
              {playerName}
              {isCaptain && <span title="Capitão">👑</span>}
              {isViceCaptain && <span title="Vice-Capitão">🛡️</span>}
            </div>
            <div className="text-xs text-gray-600">{position}</div>
          </div>
        </div>

        {isSelected ? (
          <div className="bg-green-500 text-white rounded-full p-1 flex-shrink-0">
            <Check className="w-3 h-3" />
          </div>
        ) : (
          <div className="text-lg flex-shrink-0">
            <PlayerConditionBadge status={condition} />
          </div>
        )}
      </div>

      {/* Condition info if not available */}
      {condition !== 'available' && (
        <div className="text-xs text-gray-600 px-1">
          <PlayerConditionBadge status={condition} showLabel />
        </div>
      )}
    </div>
  );
};
