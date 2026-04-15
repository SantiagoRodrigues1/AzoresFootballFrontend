// components/live/EventTimeline.tsx
import React from 'react';
import { MatchEvent } from '../../services/liveMatchService';
import './EventTimeline.css';

interface EventTimelineProps {
  events: MatchEvent[];
  homeTeamName?: string;
  awayTeamName?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, homeTeamName = '', awayTeamName = '' }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return '⚽';
      case 'yellow_card':
        return '🟨';
      case 'red_card':
        return '🟥';
      case 'substitution':
        return '🔄';
      default:
        return '📌';
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'goal':
        return 'Golo';
      case 'yellow_card':
        return 'Cartão Amarelo';
      case 'red_card':
        return 'Cartão Vermelho';
      case 'substitution':
        return 'Substituição';
      default:
        return 'Evento';
    }
  };

  // Helper para extrair nome do jogador (pode vir como object ou string)
  const getPlayerName = (player: any): string => {
    if (!player) return 'Desconhecido';
    if (typeof player === 'string') return player;
    if (player.name) return player.name;
    return 'Desconhecido';
  };

  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  return (
    <div className="event-timeline">
      <h3 className="timeline-title">📊 Linha de Tempo - Eventos</h3>

      {sortedEvents.length === 0 ? (
        <div className="no-events">ℹ️ Nenhum evento registado ainda</div>
      ) : (
        <div className="events-list">
          {sortedEvents.map((event, index) => (
            <div key={`${event.id}-${index}`} className="event-item">
              <div className="event-time">
                <span className="minute">{event.minute}'</span>
              </div>

              <div className="event-connector"></div>

              <div className="event-content">
                <div className="event-header">
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <span className="event-type">{getEventLabel(event.type)}</span>
                </div>

                {event.type === 'goal' && event.player && (
                  <div className="event-details goal-event">
                    <p className="player-name">{getPlayerName(event.player)}</p>
                    {event.assistedBy && (
                      <p className="assist-name">🎯 {getPlayerName(event.assistedBy)}</p>
                    )}
                  </div>
                )}

                {(event.type === 'yellow_card' || event.type === 'red_card') &&
                  event.player && (
                    <div className="event-details card-event">
                      <p className="player-name">{getPlayerName(event.player)}</p>
                    </div>
                  )}

                {event.type === 'substitution' && (
                  <div className="event-details substitution-event">
                    <div className="substitution-group">
                      {event.playerOut && (
                        <p className="player-out">
                          ❌ {getPlayerName(event.playerOut)}
                        </p>
                      )}
                      {event.playerIn && (
                        <p className="player-in">
                          ✅ {getPlayerName(event.playerIn)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <span className="event-time-small">
                  {new Date(event.timestamp).toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTimeline;
