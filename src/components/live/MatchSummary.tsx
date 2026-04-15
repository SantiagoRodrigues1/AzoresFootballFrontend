// components/live/MatchSummary.tsx
import React from 'react';
import { MatchEvent, Match } from '../../services/liveMatchService';
import './MatchSummary.css';

interface MatchSummaryProps {
  match: Match | null;
  events: MatchEvent[];
}

export const MatchSummary: React.FC<MatchSummaryProps> = ({ match, events }) => {
  if (!match || match.status !== 'finished') return null;

  // Helper para extrair nome do jogador
  const getPlayerName = (player: any): string => {
    if (!player) return 'Desconhecido';
    if (typeof player === 'string') return player;
    if (player.name) return player.name;
    return 'Desconhecido';
  };

  // Separar eventos por tipo
  const goals = events.filter(e => e.type === 'goal');
  const yellows = events.filter(e => e.type === 'yellow_card');
  const reds = events.filter(e => e.type === 'red_card');
  const subs = events.filter(e => e.type === 'substitution');

  // Agrupar eventos por equipa
  const homeTeamId = match.homeTeam.id;
  const homeGoals = goals.filter(g => g.team === homeTeamId);
  const awayGoals = goals.filter(g => g.team !== homeTeamId);

  return (
    <div className="match-summary">
      <div className="summary-container">
        <h2 className="summary-title">📊 Resumo do Jogo</h2>

        <div className="summary-grid">
          {/* Goals Section */}
          {(goals.length > 0) && (
            <div className="summary-section goals-section">
              <h3 className="section-title">⚽ Golos ({goals.length})</h3>
              <div className="events-list">
                {goals.map((goal, idx) => (
                  <div key={`goal-${idx}`} className="summary-event goal-event">
                    <div className="event-minute">{goal.minute}'</div>
                    <div className="event-details">
                      <div className="main-player">
                        <span className="goal-icon">⚽</span>
                        <span className="player-name">{getPlayerName(goal.player)}</span>
                      </div>
                      {goal.assistedBy && (
                        <div className="assist-info">
                          🎯 {getPlayerName(goal.assistedBy)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yellow Cards Section */}
          {(yellows.length > 0) && (
            <div className="summary-section yellows-section">
              <h3 className="section-title">🟨 Cartões Amarelos ({yellows.length})</h3>
              <div className="events-list">
                {yellows.map((card, idx) => (
                  <div key={`yellow-${idx}`} className="summary-event card-event">
                    <div className="event-minute">{card.minute}'</div>
                    <div className="event-details">
                      <span className="card-icon">🟨</span>
                      <span className="player-name">{getPlayerName(card.player)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Cards Section */}
          {(reds.length > 0) && (
            <div className="summary-section reds-section">
              <h3 className="section-title">🟥 Cartões Vermelhos ({reds.length})</h3>
              <div className="events-list">
                {reds.map((card, idx) => (
                  <div key={`red-${idx}`} className="summary-event card-event">
                    <div className="event-minute">{card.minute}'</div>
                    <div className="event-details">
                      <span className="card-icon">🟥</span>
                      <span className="player-name">{getPlayerName(card.player)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Substitutions Section */}
          {(subs.length > 0) && (
            <div className="summary-section subs-section">
              <h3 className="section-title">🔄 Substituições ({subs.length})</h3>
              <div className="events-list">
                {subs.map((sub, idx) => (
                  <div key={`sub-${idx}`} className="summary-event sub-event">
                    <div className="event-minute">{sub.minute}'</div>
                    <div className="event-details">
                      <div className="sub-out">
                        <span className="sub-icon">❌</span>
                        <span className="player-name">{getPlayerName(sub.playerOut)}</span>
                      </div>
                      <div className="sub-arrow">→</div>
                      <div className="sub-in">
                        <span className="sub-icon">✅</span>
                        <span className="player-name">{getPlayerName(sub.playerIn)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Events Message */}
          {events.length === 0 && (
            <div className="summary-section empty-section">
              <p className="empty-message">ℹ️ Nenhum evento registado no jogo</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total de Eventos</span>
            <span className="stat-value">{events.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Golos</span>
            <span className="stat-value">{goals.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cartões</span>
            <span className="stat-value">{yellows.length + reds.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Substituições</span>
            <span className="stat-value">{subs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
