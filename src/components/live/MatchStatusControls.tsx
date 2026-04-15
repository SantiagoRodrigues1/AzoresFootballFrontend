// components/live/MatchStatusControls.tsx
import React from 'react';
import { Match } from '../../services/liveMatchService';
import './MatchStatusControls.css';

interface MatchStatusControlsProps {
  match: Match | null;
  onStart: () => Promise<void>;
  onStatus: (status: 'halftime' | 'second_half') => Promise<void>;
  onFinish: () => Promise<void>;
  isLoading: boolean;
}

export const MatchStatusControls: React.FC<MatchStatusControlsProps> = ({
  match,
  onStart,
  onStatus,
  onFinish,
  isLoading
}) => {
  if (!match) return null;

  return (
    <div className="status-controls">
      <h3 className="controls-title">⚙️ Controlo do Jogo</h3>

      <div className="controls-grid">
        {/* Start Match */}
        {match.status === 'scheduled' && (
          <button
            className="control-btn btn-start"
            onClick={onStart}
            disabled={isLoading}
          >
            <span>🎮</span>
            <span>Iniciar Jogo</span>
          </button>
        )}

        {/* Halftime */}
        {(match.status === 'live') && (
          <button
            className="control-btn btn-halftime"
            onClick={() => onStatus('halftime')}
            disabled={isLoading}
          >
            <span>⏸️</span>
            <span>Intervalo</span>
          </button>
        )}

        {/* Second Half */}
        {match.status === 'halftime' && (
          <button
            className="control-btn btn-start"
            onClick={() => onStatus('second_half')}
            disabled={isLoading}
          >
            <span>▶️</span>
            <span>2ª Parte</span>
          </button>
        )}

        {/* Finish Match */}
        {(match.status === 'live' || match.status === 'second_half') && (
          <button
            className="control-btn btn-finish"
            onClick={onFinish}
            disabled={isLoading}
          >
            <span>🏁</span>
            <span>Terminar</span>
          </button>
        )}
      </div>

      {/* Status Info */}
      <div className="status-info">
        <p>Status Atual: <strong>{getStatusLabel(match.status)}</strong></p>
      </div>
    </div>
  );
};

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'scheduled': 'Agendado',
    'live': 'Em Direto',
    'halftime': 'Intervalo',
    'second_half': '2ª Parte',
    'finished': 'Terminado'
  };
  return labels[status] || status;
}

export default MatchStatusControls;
