/**
 * LiveMatchController.tsx
 * Modern live match controller with real-time updates
 * Interactive scoreboard, event tracking, match controls
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Flag,
  Goal,
  AlertCircle,
  ArrowRightLeft,
  Zap,
  Clock,
  Check,
  Volume2,
  TrendingUp,
} from 'lucide-react';
import './LiveMatchController.css';

interface Match {
  id: string;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished';
  elapsedMinutes: number;
  events: any[];
}

interface EventData {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  team: 'home' | 'away';
  playerName: string;
  playerNumber: number;
  timestamp: Date;
  description: string;
}

interface LiveMatchControllerProps {
  match: Match;
  onStartMatch: () => Promise<void>;
  onFinishMatch: () => Promise<void>;
  onAddEvent: (eventData: any) => Promise<void>;
  onStatusChange: (status: string) => Promise<void>;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const LiveMatchController: React.FC<LiveMatchControllerProps> = ({
  match,
  onStartMatch,
  onFinishMatch,
  onAddEvent,
  onStatusChange,
  isLoading = false,
}) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventType, setEventType] = useState<'goal' | 'yellow_card' | 'red_card' | 'substitution' | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [eventMinute, setEventMinute] = useState(match.elapsedMinutes);
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [matchStarted, setMatchStarted] = useState(match.status === 'live');

  // Sound effects (optional)
  const playSound = (type: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      void type;
    }
  };

  const handleStartMatch = async () => {
    try {
      setMatchStarted(true);
      await onStartMatch();
      playSound('Jogo iniciado');
    } catch (error) {
      setMatchStarted(false);
    }
  };

  const handleFinishMatch = async () => {
    if (confirm('Tem certeza que deseja terminar o jogo?')) {
      try {
        await onFinishMatch();
        playSound('Jogo terminado');
      } catch (error) {
      }
    }
  };

  const handleAddEvent = async (type: 'goal' | 'yellow_card' | 'red_card' | 'substitution') => {
    setEventType(type);
    const newEvent: EventData = {
      id: `event-${Date.now()}`,
      type,
      minute: eventMinute,
      team: selectedTeam,
      playerName: 'Jogador',
      playerNumber: 0,
      timestamp: new Date(),
      description: `${type === 'goal' ? 'Golo' : type === 'yellow_card' ? 'Cartão amarelo' : type === 'red_card' ? 'Cartão vermelho' : 'Substituição'}`,
    };

    try {
      await onAddEvent(newEvent);
      const updatedEvents = [newEvent, ...recentEvents].slice(0, 10);
      setRecentEvents(updatedEvents as EventData[]);
      playSound(newEvent.description);
      setShowEventModal(false);
      setEventType(null);
    } catch {
    }
  };

  return (
    <div className="lmc-container">
      {/* ===== HEADER ===== */}
      <motion.div
        className="lmc-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="lmc-match-info">
          <h1 className="lmc-title">
            <Play size={28} />
            Gestor de Jogo ao Vivo
          </h1>
          <p className="lmc-subtitle">Controle total do encontro em tempo real</p>
        </div>

        <motion.div
          className={`lmc-status-badge ${matchStarted ? 'live' : 'scheduled'}`}
          animate={{
            boxShadow: matchStarted
              ? ['0 0 10px rgba(255, 100, 100, 0.3)', '0 0 20px rgba(255, 100, 100, 0.8)', '0 0 10px rgba(255, 100, 100, 0.3)']
              : 'none',
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="lmc-status-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span>{matchStarted ? 'EM DIRETO' : 'AGENDADO'}</span>
        </motion.div>
      </motion.div>

      {/* ===== SCOREBOARD ===== */}
      <motion.div
        className="lmc-scoreboard"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="lmc-scoreboard-content">
          {/* Home Team */}
          <div className="lmc-team">
            <h2 className="lmc-team-name">{match.homeTeam.name}</h2>
            <motion.div
              className="lmc-score"
              key={`home-${match.homeScore}`}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.3 }}
            >
              {match.homeScore}
            </motion.div>
          </div>

          {/* Clock & Status */}
          <div className="lmc-match-clock">
            <motion.div
              className="lmc-time"
              animate={{
                opacity: matchStarted ? [1, 0.7, 1] : 1,
              }}
              transition={{ duration: 1, repeat: matchStarted ? Infinity : 0 }}
            >
              <Clock size={20} />
              <span>{eventMinute}</span>
              <span className="lmc-time-label">min</span>
            </motion.div>

            <div className="lmc-period">
              {match.status === 'halftime' && <span className="badge badge-halftime">INTERVALO</span>}
              {match.status === 'second_half' && <span className="badge badge-live">2ª PARTE</span>}
            </div>
          </div>

          {/* Away Team */}
          <div className="lmc-team">
            <h2 className="lmc-team-name">{match.awayTeam.name}</h2>
            <motion.div
              className="lmc-score"
              key={`away-${match.awayScore}`}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.3 }}
            >
              {match.awayScore}
            </motion.div>
          </div>
        </div>

        {/* Score indicators */}
        <div className="lmc-score-indicators">
          <motion.div className="lmc-indicator" animate={{ scale: [1, 1.1, 1] }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Goal size={16} />
            <span>{match.homeScore}</span>
          </motion.div>
          <div className="lmc-vs">VS</div>
          <motion.div className="lmc-indicator" animate={{ scale: [1, 1.1, 1] }} transition={{ delay: 0.3, duration: 0.5 }}>
            <span>{match.awayScore}</span>
            <Goal size={16} />
          </motion.div>
        </div>
      </motion.div>

      {/* ===== QUICK ACTIONS ===== */}
      <motion.div
        className="lmc-quick-actions"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="lmc-section-title">Ações Rápidas</h2>

        <div className="lmc-actions-grid">
          {/* Goal Button */}
          <motion.button
            className="lmc-action-btn goal"
            onClick={() => handleAddEvent('goal')}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!matchStarted || isLoading}
          >
            <Goal size={24} />
            <span>Golo</span>
            <span className="lmc-shortcut">G</span>
          </motion.button>

          {/* Yellow Card Button */}
          <motion.button
            className="lmc-action-btn yellow-card"
            onClick={() => handleAddEvent('yellow_card')}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!matchStarted || isLoading}
          >
            <AlertCircle size={24} />
            <span>Amarelo</span>
            <span className="lmc-shortcut">Y</span>
          </motion.button>

          {/* Red Card Button */}
          <motion.button
            className="lmc-action-btn red-card"
            onClick={() => handleAddEvent('red_card')}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!matchStarted || isLoading}
          >
            <AlertCircle size={24} />
            <span>Vermelho</span>
            <span className="lmc-shortcut">R</span>
          </motion.button>

          {/* Substitution Button */}
          <motion.button
            className="lmc-action-btn substitution"
            onClick={() => handleAddEvent('substitution')}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!matchStarted || isLoading}
          >
            <ArrowRightLeft size={24} />
            <span>Substituição</span>
            <span className="lmc-shortcut">S</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ===== MATCH CONTROLS ===== */}
      <motion.div
        className="lmc-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="lmc-section-title">Controles do Jogo</h2>

        <div className="lmc-controls-grid">
          {/* Start/Pause Button */}
          <motion.button
            className={`lmc-control-btn ${matchStarted ? 'pause' : 'start'}`}
            onClick={matchStarted ? () => onStatusChange('halftime') : handleStartMatch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {matchStarted ? <Pause size={20} /> : <Play size={20} />}
            <span>{matchStarted ? 'Pausar Jogo' : 'Iniciar Jogo'}</span>
          </motion.button>

          {/* Halftime Button */}
          <motion.button
            className="lmc-control-btn halftime"
            onClick={() => onStatusChange('halftime')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!matchStarted || isLoading}
          >
            <Zap size={20} />
            <span>Intervalo</span>
          </motion.button>

          {/* Resume Button */}
          <motion.button
            className="lmc-control-btn resume"
            onClick={() => onStatusChange('second_half')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!matchStarted || isLoading}
          >
            <Play size={20} />
            <span>Retomar</span>
          </motion.button>

          {/* Finish Button */}
          <motion.button
            className="lmc-control-btn finish"
            onClick={handleFinishMatch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!matchStarted || isLoading}
          >
            <Flag size={20} />
            <span>Terminar Jogo</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ===== EVENTS TIMELINE ===== */}
      <motion.div
        className="lmc-events"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="lmc-section-title">Últimos Eventos</h2>

        <div className="lmc-timeline">
          <AnimatePresence>
            {recentEvents.length > 0 ? (
              recentEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  className={`lmc-event-item ${event.team}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="lmc-event-icon">
                    {event.type === 'goal' && <Goal size={18} />}
                    {event.type === 'yellow_card' && <AlertCircle size={18} />}
                    {event.type === 'red_card' && <AlertCircle size={18} />}
                    {event.type === 'substitution' && <ArrowRightLeft size={18} />}
                  </div>

                  <div className="lmc-event-content">
                    <p className="lmc-event-description">{event.description}</p>
                    <p className="lmc-event-player">
                      {event.playerNumber} - {event.playerName}
                    </p>
                  </div>

                  <div className="lmc-event-minute">{event.minute}'</div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="lmc-no-events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle size={32} />
                <p>Nenhum evento registado</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== STATISTICS ===== */}
      <motion.div
        className="lmc-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="lmc-section-title">Estatísticas</h2>

        <div className="lmc-stats-grid">
          <div className="lmc-stat-card">
            <TrendingUp size={20} />
            <div className="lmc-stat-content">
              <span className="lmc-stat-label">Duração</span>
              <span className="lmc-stat-value">{match.elapsedMinutes}min</span>
            </div>
          </div>

          <div className="lmc-stat-card">
            <Goal size={20} />
            <div className="lmc-stat-content">
              <span className="lmc-stat-label">Total Golos</span>
              <span className="lmc-stat-value">{match.homeScore + match.awayScore}</span>
            </div>
          </div>

          <div className="lmc-stat-card">
            <Check size={20} />
            <div className="lmc-stat-content">
              <span className="lmc-stat-label">Eventos</span>
              <span className="lmc-stat-value">{match.events.length}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveMatchController;
