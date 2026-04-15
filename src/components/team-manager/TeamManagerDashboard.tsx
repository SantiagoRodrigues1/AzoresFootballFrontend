/**
 * TeamManagerDashboard.tsx
 * Modern, interactive Team Manager dashboard with dark mode
 * Mobile-first responsive design with desportivo/dinâmico theme
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Clock,
  Zap,
  Users,
  Trophy,
  Target,
  Settings,
  Plus,
  ArrowRight,
  Flame,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import './TeamManagerDashboard.css';

interface MatchData {
  id: string;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  date: string;
  status: 'scheduled' | 'live' | 'finished';
}

interface LineupStatus {
  hasLineup: boolean;
  formation: string;
  starters: number;
  subs: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 10px 30px rgba(0, 95, 158, 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 50px rgba(0, 95, 158, 0.3)',
    transition: { duration: 0.3 },
  },
};

export const TeamManagerDashboard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [lineupStatus, setLineupStatus] = useState<LineupStatus>({
    hasLineup: false,
    formation: '4-3-3',
    starters: 0,
    subs: 0,
  });

  // Calculate time to match
  const timeToMatch = useMemo(() => {
    if (!match) return null;
    const kickoff = new Date(match.date).getTime();
    const now = new Date().getTime();
    const diffMs = Math.max(0, kickoff - now);
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return { hours, minutes };
  }, [match]);

  // Navigation handlers
  const handleEditLineup = () => navigate(`/match/${matchId}/lineup`);
  const handleLiveMatch = () => navigate(`/match/${matchId}/live`);
  const handleViewStats = () => navigate(`/match/${matchId}/stats`);

  // Quick action items
  const quickActions = [
    {
      id: 'edit-lineup',
      icon: Users,
      title: 'Editar Plantel',
      subtitle: 'Escolha os 11 titulares',
      color: 'from-blue-600 to-blue-400',
      onClick: handleEditLineup,
      badge: lineupStatus.hasLineup ? '✓' : '+',
    },
    {
      id: 'live-match',
      icon: Zap,
      title: 'Gerir Jogo',
      subtitle: 'Golos, cartões, substituições',
      color: 'from-red-600 to-red-400',
      onClick: handleLiveMatch,
      disabled: !lineupStatus.hasLineup,
    },
    {
      id: 'formations',
      icon: Target,
      title: 'Formações',
      subtitle: 'Ver esquemas disponíveis',
      color: 'from-purple-600 to-purple-400',
      onClick: () => {},
    },
    {
      id: 'stats',
      icon: BarChart3,
      title: 'Estatísticas',
      subtitle: 'Desempenho dos jogadores',
      color: 'from-green-600 to-green-400',
      onClick: handleViewStats,
    },
  ];

  // Status badges
  const statusBadges = [
    {
      icon: CheckCircle2,
      label: 'Plantel',
      value: lineupStatus.hasLineup ? 'Definido' : 'Pendente',
      color: lineupStatus.hasLineup ? 'text-green-400' : 'text-yellow-400',
    },
    {
      icon: Users,
      label: 'Titulares',
      value: `${lineupStatus.starters}/11`,
      color: lineupStatus.starters === 11 ? 'text-blue-400' : 'text-gray-400',
    },
    {
      icon: Trophy,
      label: 'Suplentes',
      value: `${lineupStatus.subs}`,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="tm-dashboard">
      {/* ===== HEADER ===== */}
      <motion.div
        className="tm-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="tm-header-content">
          <div className="tm-greeting">
            <Flame className="tm-flame-icon" />
            <div>
              <h1 className="tm-title">Gestor de Jogo</h1>
              <p className="tm-subtitle">Equipe está pronta para o confronto</p>
            </div>
          </div>

          {timeToMatch && (
            <motion.div
              className="tm-countdown"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255, 100, 100, 0.3)',
                  '0 0 40px rgba(255, 100, 100, 0.6)',
                  '0 0 20px rgba(255, 100, 100, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="tm-countdown-icon" />
              <div className="tm-countdown-info">
                <span className="tm-countdown-time">
                  {timeToMatch.hours}h {timeToMatch.minutes}m
                </span>
                <span className="tm-countdown-label">Até ao jogo</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ===== STATUS BADGES ===== */}
      <motion.div
        className="tm-status-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statusBadges.map((badge, idx) => (
          <motion.div
            key={idx}
            className="tm-status-badge"
            variants={itemVariants}
          >
            <badge.icon className={`tm-badge-icon ${badge.color}`} size={24} />
            <div className="tm-badge-content">
              <span className="tm-badge-label">{badge.label}</span>
              <span className={`tm-badge-value ${badge.color}`}>
                {badge.value}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== QUICK ACTIONS ===== */}
      <motion.div
        className="tm-actions-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="tm-section-title">Ações Rápidas</h2>

        <div className="tm-actions-grid">
          {quickActions.map((action, idx) => (
            <motion.button
              key={action.id}
              className={`tm-action-card ${action.disabled ? 'disabled' : ''}`}
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              initial="rest"
              onClick={action.onClick}
              disabled={action.disabled}
              custom={idx}
            >
              <motion.div
                className={`tm-action-gradient ${action.color}`}
                variants={cardHoverVariants}
              >
                <div className="tm-action-icon-wrapper">
                  <action.icon size={32} />
                  {action.badge && (
                    <motion.div
                      className={`tm-action-badge ${
                        action.badge === '✓' ? 'active' : 'add'
                      }`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {action.badge}
                    </motion.div>
                  )}
                </div>

                <div className="tm-action-content">
                  <h3 className="tm-action-title">{action.title}</h3>
                  <p className="tm-action-subtitle">{action.subtitle}</p>
                </div>

                <motion.div
                  className="tm-action-arrow"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ===== LINEUP PREVIEW ===== */}
      {lineupStatus.hasLineup && (
        <motion.div
          className="tm-preview-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="tm-preview-header">
            <h2 className="tm-section-title">Plantel Atual</h2>
            <button
              className="tm-preview-edit-btn"
              onClick={handleEditLineup}
            >
              Editar
            </button>
          </div>

          <motion.div
            className="tm-formation-display"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="tm-formation-badge">
              <span className="tm-formation-name">
                {lineupStatus.formation}
              </span>
              <span className="tm-formation-count">
                {lineupStatus.starters + lineupStatus.subs} jogadores
              </span>
            </div>

            <div className="tm-players-summary">
              <div className="tm-player-group">
                <span className="tm-group-label">Titulares</span>
                <motion.div
                  className="tm-player-count"
                  animate={{ color: ['#3b82f6', '#60a5fa', '#3b82f6'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {lineupStatus.starters}
                </motion.div>
              </div>

              <div className="tm-player-divider" />

              <div className="tm-player-group">
                <span className="tm-group-label">Suplentes</span>
                <motion.div
                  className="tm-player-count"
                  animate={{ color: ['#a855f7', '#d946ef', '#a855f7'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {lineupStatus.subs}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ===== MATCH INFO ===== */}
      <motion.div
        className="tm-info-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="tm-section-title">Informações do Jogo</h2>

        <div className="tm-info-card">
          <div className="tm-info-teams">
            <div className="tm-team">
              <h3 className="tm-team-name">
                {match?.homeTeam?.name || 'Equipa A'}
              </h3>
              <span className="tm-team-label">Casa</span>
            </div>

            <div className="tm-vs">VS</div>

            <div className="tm-team">
              <h3 className="tm-team-name">
                {match?.awayTeam?.name || 'Equipa B'}
              </h3>
              <span className="tm-team-label">Fora</span>
            </div>
          </div>

          <motion.div
            className="tm-info-divider"
            animate={{ scaleX: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="tm-match-date">
            <Clock size={16} />
            <span>{match?.date ? new Date(match.date).toLocaleString('pt-PT') : 'Data não definida'}</span>
          </div>
        </div>
      </motion.div>

      {/* ===== PERFORMANCE ANALYTICS ===== */}
      <motion.div
        className="tm-analytics-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="tm-section-title">Últimas Ações</h2>

        <div className="tm-timeline">
          {[
            { action: 'Plantel definido', time: 'Hoje 14:30', icon: CheckCircle2 },
            { action: 'Capitão confirmado', time: 'Hoje 14:15', icon: Trophy },
            { action: 'Formação selecionada', time: 'Hoje 14:00', icon: Target },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="tm-timeline-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
            >
              <div className="tm-timeline-dot">
                <item.icon size={14} />
              </div>
              <div className="tm-timeline-content">
                <p className="tm-timeline-action">{item.action}</p>
                <span className="tm-timeline-time">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeamManagerDashboard;
