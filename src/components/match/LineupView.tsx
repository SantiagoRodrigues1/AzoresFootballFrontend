/**
 * LineupView.tsx
 * Display saved lineup (starting 11 + substitutes)
 * Shows football pitch layout with player positions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Play } from 'lucide-react';
import { LineupPlayer } from '@/types';
import './LineupView.css';

interface LineupViewProps {
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
  captain?: string | null;
  viceCaptain?: string | null;
  onEdit?: () => void;
  onStartMatch?: () => void;
  isLoading?: boolean;
  isStarting?: boolean;
}

// Formation positions mapping
const FORMATION_POSITIONS: Record<string, { top: string; left: string }[]> = {
  '4-3-3': [
    // Goalkeeper
    { top: '5%', left: '45%' },
    // Defenders (4)
    { top: '25%', left: '20%' }, { top: '25%', left: '35%' },
    { top: '25%', left: '65%' }, { top: '25%', left: '80%' },
    // Midfielders (3)
    { top: '50%', left: '20%' }, { top: '50%', left: '45%' },
    { top: '50%', left: '80%' },
    // Forwards (3)
    { top: '75%', left: '25%' }, { top: '75%', left: '45%' },
    { top: '75%', left: '75%' }
  ],
  '4-4-2': [
    // Goalkeeper
    { top: '5%', left: '45%' },
    // Defenders (4)
    { top: '25%', left: '20%' }, { top: '25%', left: '35%' },
    { top: '25%', left: '65%' }, { top: '25%', left: '80%' },
    // Midfielders (4)
    { top: '50%', left: '15%' }, { top: '50%', left: '35%' },
    { top: '50%', left: '65%' }, { top: '50%', left: '85%' },
    // Forwards (2)
    { top: '75%', left: '35%' }, { top: '75%', left: '65%' }
  ],
  '5-3-2': [
    // Goalkeeper
    { top: '5%', left: '45%' },
    // Defenders (5)
    { top: '25%', left: '15%' }, { top: '25%', left: '30%' },
    { top: '25%', left: '45%' }, { top: '25%', left: '70%' },
    { top: '25%', left: '85%' },
    // Midfielders (3)
    { top: '50%', left: '20%' }, { top: '50%', left: '45%' },
    { top: '50%', left: '80%' },
    // Forwards (2)
    { top: '75%', left: '35%' }, { top: '75%', left: '65%' }
  ]
};

export const LineupView: React.FC<LineupViewProps> = ({
  formation,
  starters,
  substitutes,
  captain,
  viceCaptain,
  onEdit,
  onStartMatch,
  isLoading = false,
  isStarting = false
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-3-3'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lineup-view"
    >
      {/* Header - Escalação Guardada */}
      <div className="lineup-header">
        <div>
          <h2>✓ Escalação Guardada</h2>
          <p className="formation-badge">{formation}</p>
        </div>
        <div className="header-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            disabled={isLoading}
            className="btn-edit"
            title="Editar escalação"
          >
            <Edit className="w-5 h-5" />
            <span>Editar 11</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartMatch}
            disabled={isStarting || isLoading}
            className="btn-start-match"
            title="Gerir jogo ao vivo"
          >
            <Play className="w-5 h-5" />
            <span>{isStarting ? 'A iniciar...' : '🎮 GERIR JOGO AO VIVO DA MINHA EQUIPA'}</span>
          </motion.button>
        </div>
      </div>

      {/* Pitch */}
      <div className="pitch-container">
        <div className="pitch">
          {/* Players on Pitch */}
          {starters.map((player, index) => {
            const position = positions[index];
            const isCaptain = player.playerId === captain;
            const isViceCaptain = player.playerId === viceCaptain;

            return (
              <motion.div
                key={player.playerId || `player-${index}`}
                className={`player-position ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                style={{
                  top: position.top,
                  left: position.left
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPlayer(player.playerId || null)}
              >
                <div className={`player-card ${player.position}`}>
                  <div className="player-number">
                    {player.playerNumber}
                    {isCaptain && <span className="captain-badge">C</span>}
                    {isViceCaptain && <span className="vice-captain-badge">V</span>}
                  </div>
                  <div className="player-name">{player.playerName}</div>
                  <div className="player-pos-mini">{getPositionAbbr(player.position)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Substitutes */}
      <div className="substitutes-section">
        <h3>Banco de Suplentes</h3>
        <div className="substitutes-list">
          {substitutes.length > 0 ? (
            substitutes.map((player, index) => (
              <motion.div
                key={player.playerId || `sub-${index}`}
                className="substitute-card"
                whileHover={{ x: 4 }}
              >
                <div className="substitute-number">{player.playerNumber}</div>
                <div className="substitute-info">
                  <div className="substitute-name">{player.playerName}</div>
                  <div className="substitute-pos">{player.position}</div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="no-substitutes">Sem suplentes selecionados</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="lineup-summary">
        <div className="summary-item">
          <span>Jogadores Iniciais:</span>
          <strong>{starters.length}/11</strong>
        </div>
        <div className="summary-item">
          <span>Suplentes:</span>
          <strong>{substitutes.length}</strong>
        </div>
        <div className="summary-item">
          <span>Capitão:</span>
          <strong>
            {starters.find(p => p.playerId === captain)?.playerName || '-'}
          </strong>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Helper function to get position abbreviation
 */
function getPositionAbbr(position: string): string {
  const abbr: Record<string, string> = {
    goalkeeper: 'GK',
    defender: 'DEF',
    midfielder: 'MID',
    forward: 'FWD'
  };
  return abbr[position] || position.slice(0, 3).toUpperCase();
}
