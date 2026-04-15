// components/live/ScoreHeader.tsx
import React from 'react';
import { Match } from '../../services/liveMatchService';
import './ScoreHeader.css';

interface ScoreHeaderProps {
  match: Match | null;
  elapsedMinutes: number;
  addedTime: number;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  match,
  elapsedMinutes,
  addedTime
}) => {
  if (!match) {
    return <div className="score-header loading">Carregando jogo...</div>;
  }

  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return <span className="status-badge status-live">🔴 DIRETO</span>;
      case 'halftime':
        return <span className="status-badge status-halftime">⏸️ INTERVALO</span>;
      case 'second_half':
        return <span className="status-badge status-live">🔴 2ª PARTE</span>;
      case 'finished':
        return <span className="status-badge status-finished">🏁 TERMINADO</span>;
      case 'scheduled':
        return <span className="status-badge status-scheduled">📅 AGENDADO</span>;
      default:
        return null;
    }
  };

  const displayMinutes =
    match.status === 'halftime' || match.status === 'finished'
      ? `45+${addedTime}`
      : elapsedMinutes > 45
        ? `45+${elapsedMinutes - 45 + addedTime}`
        : elapsedMinutes;

  return (
    <div className="score-header">
      {/* Status Badge */}
      <div className="status-container">
        {getStatusBadge()}
      </div>

      {/* Score Board */}
      <div className="scoreboard">
        {/* Home Team */}
        <div className="team home-team">
          <img
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            className="team-logo"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
            }}
          />
          <div className="team-name">{match.homeTeam.name}</div>
        </div>

        {/* Score */}
        <div className="score">
          <div className="score-numbers">
            <span className="score-value">{match.homeScore}</span>
            <span className="score-separator">-</span>
            <span className="score-value">{match.awayScore}</span>
          </div>
          <div className="match-timer">
            {match.status !== 'finished' && match.status !== 'scheduled' ? (
              <div className="timer">{displayMinutes}'</div>
            ) : (
              <div className="timer-static">
                {match.status === 'finished' ? '90+' : '00'}
              </div>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="team away-team">
          <img
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            className="team-logo"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
            }}
          />
          <div className="team-name">{match.awayTeam.name}</div>
        </div>
      </div>

      {/* Match Info */}
      <div className="match-info">
        <span className="info-item">
          📅 {new Date(match.date).toLocaleDateString('pt-PT')}
        </span>
      </div>

      {/* Final Result Banner - Mostrado quando jogo termina */}
      {match.status === 'finished' && (
        <div className="final-result-banner">
          <div className="result-content">
            <h2 className="result-title">🏁 Resultado Final</h2>
            <div className="final-score">
              <div className="final-team-score">
                <div className="final-team-name">{match.homeTeam.name}</div>
                <div className="final-score-value">{match.homeScore}</div>
              </div>
              <span className="final-separator">-</span>
              <div className="final-team-score">
                <div className="final-team-name">{match.awayTeam.name}</div>
                <div className="final-score-value">{match.awayScore}</div>
              </div>
            </div>
            <div className="match-status-final">
              ✅ Jogo Terminado
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreHeader;
