import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { liveMatchService, Match } from '@/services/liveMatchService';
import { squadService, Player } from '@/services/squadService';
import { EventModal, EventType } from '../components/live/EventModal';
import { CardTypeModal } from '../components/live/CardTypeModal';
import './LiveMatchManager.css';

type TimerHandle = ReturnType<typeof setInterval>;

type ModalEventType = EventType | 'card';

export const LiveMatchManager: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const pollingIntervalRef = useRef<TimerHandle | null>(null);
  const lastEventCountRef = useRef(0);

  // === STATE ===
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loadedTeamId, setLoadedTeamId] = useState<string | null>(null);
  const [newEventNotification, setNewEventNotification] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [matchStartTime, setMatchStartTime] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEventType, setModalEventType] = useState<ModalEventType | null>(null);
  const [cardTypeModal, setCardTypeModal] = useState(false);

  // === FETCH MATCH ===
  const fetchMatch = useCallback(async () => {
    if (!matchId || !token) return;

    try {
      setError('');
      const data = await liveMatchService.getMatchDetails(matchId);
      
      // Detect new events
      const currentEventCount = data.events?.length || 0;
      if (currentEventCount > lastEventCountRef.current) {
        setNewEventNotification(true);
        setTimeout(() => setNewEventNotification(false), 3000);
      }
      lastEventCountRef.current = currentEventCount;
      
      setMatch(data);

      // Start timer if match is live
      if ((data.status === 'live' || data.status === 'halftime' || data.status === 'second_half') && !matchStartTime) {
        setMatchStartTime(Date.now());
      }
    } catch (_err: any) {
    }
  }, [matchId, token, matchStartTime]);

  // === FETCH SQUAD ===
  const fetchSquadForTeam = useCallback(async (teamId: string) => {
    if (loadedTeamId === teamId) {
      return;
    }

    try {
      // Try new endpoint
      if (matchId) {
        try {
          const lineup = await liveMatchService.getLineup(matchId, teamId);
          
          if (lineup) {
            const startersPlayers: Player[] = (lineup.starters || []).map((s: any) => {
              let id = '';
              let playerData = s.playerId;
              
              if (playerData && typeof playerData === 'object' && playerData._id) {
                id = String(playerData._id);
              } else if (typeof playerData === 'string' && playerData) {
                id = playerData;
              } else {
                id = `player-${s.playerName?.replace(/\s+/g, '-')}-${s.playerNumber}`;
              }

              return {
                id,
                name: (playerData && playerData.name) || s.playerName || `Player ${s.playerNumber}`,
                number: (playerData && playerData.number) || s.playerNumber || 0,
                position: s.position,
                teamId
              };
            });

            const substitutesPlayers: Player[] = (lineup.substitutes || []).map((sub: any) => {
              let id = '';
              let playerData = sub.playerId;
              
              if (playerData && typeof playerData === 'object' && playerData._id) {
                id = String(playerData._id);
              } else if (typeof playerData === 'string' && playerData) {
                id = playerData;
              } else {
                id = `player-${sub.playerName?.replace(/\s+/g, '-')}-${sub.playerNumber}`;
              }

              return {
                id,
                name: (playerData && playerData.name) || sub.playerName || `Player ${sub.playerNumber}`,
                number: (playerData && playerData.number) || sub.playerNumber || 0,
                position: sub.position,
                teamId
              };
            });

            const allPlayers = [...startersPlayers, ...substitutesPlayers];
            setPlayers(allPlayers);
            setSubstitutes(substitutesPlayers);
            setLoadedTeamId(teamId);
            return;
          }
        } catch (err: any) {
          if (err.response?.status !== 404) {
            setError('Erro ao carregar escalação guardada');
          }
        }
      }

      // FALLBACK
      try {
        const squad = await squadService.getTeamSquad(teamId);
        if (squad && squad.length > 0) {
          setPlayers(squad);
          setLoadedTeamId(teamId);
          return;
        }
      } catch (_err) {
      }

      // FALLBACK 2: Mock players
      const mockPlayers: Player[] = Array.from({ length: 11 }, (_, i) => ({
        id: `player-${i + 1}`,
        name: `Jogador ${i + 1}`,
        number: i + 1,
        teamId
      }));
      setPlayers(mockPlayers);
      setLoadedTeamId(teamId);
    } catch (_err) {
      setError('Erro ao carregar plantel da equipa');
    }
  }, [matchId, loadedTeamId]);

  // === INITIAL LOAD ===
  useEffect(() => {
    if (!matchId || !token || !user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchMatch();
      } catch (_err) {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [matchId, token, user]);

  // === LOAD SQUAD WHEN MATCH IS LOADED ===
  useEffect(() => {
    if (!match || !user?.assignedTeam) return;

    fetchSquadForTeam(user.assignedTeam);
  }, [match, user?.assignedTeam, fetchSquadForTeam]);

  // === TIMER ===
  useEffect(() => {
    if (!match || match.status !== 'live' || !matchStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - matchStartTime) / 1000 / 60);
      setElapsedMinutes(Math.min(elapsed, 90));
    }, 1000);

    return () => clearInterval(interval);
  }, [match?.status, matchStartTime]);

  // === POLLING (LIVE UPDATES EVERY 2 SECONDS) ===
  useEffect(() => {
    if (!matchId || !token || !match) return;

    pollingIntervalRef.current = setInterval(() => {
      fetchMatch();
    }, 2000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [matchId, token, match, fetchMatch]);

  // === MODAL HANDLERS ===
  const handleOpenModal = (eventType: ModalEventType) => {
    if (eventType === 'card') {
      setCardTypeModal(true);
      return;
    }

    setModalEventType(eventType as EventType);
    setModalOpen(true);
  };

  const handleCardTypeSelect = (cardType: 'yellow_card' | 'red_card') => {
    setCardTypeModal(false);
    setModalEventType(cardType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalEventType(null);
  };

  const handleCloseCardTypeModal = () => {
    setCardTypeModal(false);
  };

  const handleSubmitEvent = async (data: {
    type: EventType;
    minute: number;
    playerId?: string;
    playerInId?: string;
    playerOutId?: string;
  }) => {
    if (!matchId) return;

    try {
      setIsSaving(true);
      setError('');
      const updated = await liveMatchService.addEvent(matchId, data);
      setMatch(updated);
      setSuccess('Evento registado com sucesso!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao registar evento');
    } finally {
      setIsSaving(false);
      handleCloseModal();
    }
  };

  // === MATCH STATE HANDLERS ===
  const handleStartMatch = async () => {
    if (!matchId) return;

    try {
      setIsSaving(true);
      setError('');
      const updated = await liveMatchService.startMatch(matchId);
      setMatch(updated);
      setMatchStartTime(Date.now());
      setSuccess('Jogo iniciado!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar jogo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (status: 'halftime' | 'second_half') => {
    if (!matchId) return;

    try {
      setIsSaving(true);
      setError('');
      const updated = await liveMatchService.updateStatus(matchId, status);
      setMatch(updated);
      const statusLabel = status === 'halftime' ? 'Intervalo' : '2ª Parte';
      setSuccess(`Status alterado para: ${statusLabel}`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishMatch = async () => {
    if (!matchId) {
      setError('ID do jogo não disponível');
      return;
    }

    if (!window.confirm('Tem a certeza que quer terminar o jogo?')) {
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const updated = await liveMatchService.finishMatch(
        matchId,
        'Campeonato dos Açores',
        '2025/2026'
      );
      setMatch(updated);
      setSuccess('Jogo terminado!');
      setTimeout(() => {
        navigate('/matches');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao terminar jogo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTime = async () => {
    if (!matchId) return;

    const minutes = prompt('Quantos minutos adicionar?', '5');
    if (!minutes || isNaN(Number(minutes))) return;

    try {
      setIsSaving(true);
      setError('');
      const updated = await liveMatchService.addAddedTime(matchId, Number(minutes));
      setMatch(updated);
      setSuccess(`${minutes} minuto(s) adicional(is) adicionado(s)`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar tempo');
    } finally {
      setIsSaving(false);
    }
  };

  // === LOADING STATE ===
  if (isLoading) {
    return (
      <div className="live-match-manager loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  // === ERROR STATE ===
  if (!match) {
    return (
      <div className="live-match-manager error">
        <div className="error-container">
          <h2>❌ Jogo não encontrado</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {error || 'O jogo solicitado não existe ou não tem permissão para aceder'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => navigate('/matches')}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Voltar aos Jogos
            </button>
            {error && (
              <button 
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  fetchMatch();
                }}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Tentar Novamente
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === MAIN RENDER ===
  const isTeamManager = user?.assignedTeam === match.homeTeam.id || user?.assignedTeam === match.awayTeam.id;

  return (
    <div className="live-match-manager">
      {/* Header */}
      <div className="page-header">
        <h1>🎮 Gestor de Jogo em Direto</h1>
        <button className="btn-back" onClick={() => navigate(-1)} title="Voltar">
          ← Voltar
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-error"
        >
          <span>❌</span>
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-success"
        >
          <span>✅</span>
          <span>{success}</span>
        </motion.div>
      )}

      {newEventNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-info"
        >
          <span>🔔</span>
          <span>Novo evento registado!</span>
        </motion.div>
      )}

      {/* Score Display */}
      <div className="score-display">
        <div className="team home">
          <h3>{match.homeTeam.name}</h3>
          <div className="score">{match.homeScore}</div>
        </div>

        <div className="match-info">
          {match.status === 'live' && (
            <div className="minute-display">
              <span className="live-badge">🔴 AO VIVO</span>
              <span className="minute">{elapsedMinutes}' {match.addedTime && `+${match.addedTime}`}</span>
            </div>
          )}
          {match.status === 'halftime' && <div className="status-badge">INTERVALO</div>}
          {match.status === 'second_half' && <div className="status-badge">2ª PARTE</div>}
          {match.status === 'finished' && <div className="status-badge">TERMINADO</div>}
          {match.status === 'scheduled' && <div className="status-badge">AGENDADO</div>}
          
          <div className="date-time">
            {new Date(match.date).toLocaleDateString('pt-PT')} • {new Date(match.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="team away">
          <h3>{match.awayTeam.name}</h3>
          <div className="score">{match.awayScore}</div>
        </div>
      </div>

      {/* Status Controls - Only for Team Manager */}
      {isTeamManager && (
        <div className="status-controls">
          {match.status === 'scheduled' && (
            <button
              className="btn btn-primary"
              onClick={handleStartMatch}
              disabled={isSaving}
            >
              ▶️ Iniciar Jogo
            </button>
          )}
          
          {(match.status === 'live' || match.status === 'second_half') && (
            <button
              className="btn btn-warning"
              onClick={() => handleStatusChange('halftime')}
              disabled={isSaving}
            >
              ⏸️ Intervalo
            </button>
          )}

          {match.status === 'halftime' && (
            <button
              className="btn btn-warning"
              onClick={() => handleStatusChange('second_half')}
              disabled={isSaving}
            >
              ▶️ 2ª Parte
            </button>
          )}

          {(match.status === 'live' || match.status === 'halftime' || match.status === 'second_half') && (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleAddTime}
                disabled={isSaving}
              >
                ⏱️ Adicionar Tempo
              </button>

              <button
                className="btn btn-danger"
                onClick={handleFinishMatch}
                disabled={isSaving}
              >
                🏁 Terminar Jogo
              </button>
            </>
          )}
        </div>
      )}

      {/* Events Timeline */}
      <div className="events-timeline">
        <h2>⏱️ Cronologia do Jogo</h2>
        {match.events && match.events.length > 0 ? (
          <div className="timeline-container">
            {match.events.map((event, idx) => {
              const isHomeTeam = event.team === match.homeTeam.id;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`timeline-event ${isHomeTeam ? 'home-event' : 'away-event'}`}
                >
                  <div className="timeline-time">{event.minute}'</div>
                  
                  <div className="timeline-dot">
                    {event.type === 'goal' && '⚽'}
                    {event.type === 'yellow_card' && '🟨'}
                    {event.type === 'red_card' && '🟥'}
                    {event.type === 'substitution' && '🔄'}
                  </div>

                  <div className={`timeline-content ${event.type}`}>
                    <div className="event-team">
                      {isHomeTeam ? match.homeTeam.name : match.awayTeam.name}
                    </div>
                    
                    <div className="event-text">
                      {event.type === 'goal' && (
                        <>
                          <span className="player-badge">{event.player?.number || ''}</span>
                          <span className="player-name">{event.player?.name || 'Jogador'}</span>
                          <span className="action">GOL</span>
                        </>
                      )}
                      {event.type === 'yellow_card' && (
                        <>
                          <span className="player-badge">{event.player?.number || ''}</span>
                          <span className="player-name">{event.player?.name || 'Jogador'}</span>
                          <span className="action yellow">CARTÃO AMARELO</span>
                        </>
                      )}
                      {event.type === 'red_card' && (
                        <>
                          <span className="player-badge">{event.player?.number || ''}</span>
                          <span className="player-name">{event.player?.name || 'Jogador'}</span>
                          <span className="action red">CARTÃO VERMELHO</span>
                        </>
                      )}
                      {event.type === 'substitution' && (
                        <>
                          <span className="sub-direction">↓ sai: </span>
                          <span className="player-badge">{event.playerOut?.number || ''}</span>
                          <span className="player-name">{event.playerOut?.name || 'Jogador'}</span>
                          <br />
                          <span className="sub-direction">↑ entra: </span>
                          <span className="player-badge">{event.playerIn?.number || ''}</span>
                          <span className="player-name">{event.playerIn?.name || 'Jogador'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="no-events">
            <p>Sem eventos registados ainda</p>
          </div>
        )}
      </div>

      {/* Action Buttons - Only for Team Manager */}
      {isTeamManager && (match.status === 'live' || match.status === 'halftime' || match.status === 'second_half') && (
        <div className="action-buttons">
          <button
            className="btn btn-goal"
            onClick={() => handleOpenModal('goal')}
            disabled={isSaving || players.length === 0}
          >
            ⚽ Registar Golo
          </button>
          <button
            className="btn btn-card"
            onClick={() => handleOpenModal('card')}
            disabled={isSaving || players.length === 0}
          >
            🟨 Registar Cartão
          </button>
          <button
            className="btn btn-substitute"
            onClick={() => handleOpenModal('substitution')}
            disabled={isSaving || players.length === 0}
          >
            🔄 Registar Substituição
          </button>
        </div>
      )}

      {/* Card Type Modal */}
      <CardTypeModal
        isOpen={cardTypeModal}
        onSelectCardType={handleCardTypeSelect}
        onClose={handleCloseCardTypeModal}
      />

      {/* Event Modal */}
      {modalEventType && (
        <EventModal
          isOpen={modalOpen}
          eventType={modalEventType as EventType}
          players={players}
          starters={players}
          substitutes={substitutes}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEvent}
          currentMinute={elapsedMinutes}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default LiveMatchManager;
