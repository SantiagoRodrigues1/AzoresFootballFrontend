/**
 * MatchDetailsPage.tsx
 * Página pública de detalhes do jogo terminado
 * 
 * Mostra:
 * - Informações do jogo (equipas, local, data)
 * - Resultado final
 * - Timeline de eventos (golos, cartões, substituições)
 * - Resumo do jogo com estatísticas
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { liveMatchService, Match, MatchEvent } from '@/services/liveMatchService';
import { ScoreHeader } from '@/components/live/ScoreHeader';
import { EventTimeline } from '@/components/live/EventTimeline';
import { MatchSummary } from '@/components/live/MatchSummary';
import './MatchDetailsPage.css';

export const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch match details
  useEffect(() => {
    const fetchMatch = async () => {
      if (!matchId || !token) {
        setError('ID do jogo ou autenticação inválida');
        setIsLoading(false);
        return;
      }

      try {
        setError('');
        const data = await liveMatchService.getMatchDetails(matchId);
        setMatch(data);
      } catch (err: any) {
        const errorMsg = err.message || 'Erro ao carregar jogo';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, [matchId, token]);

  // Loading state
  if (isLoading) {
    return (
      <div className="match-details-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando detalhes do jogo...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!match || error) {
    return (
      <div className="match-details-page error">
        <div className="error-container">
          <h2>❌ Jogo não encontrado</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {error || 'O jogo solicitado não existe ou não tem permissão para aceder'}
          </p>
          <button onClick={() => navigate('/matches')}>Voltar aos Jogos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-details-page">
      {/* Header */}
      <div className="page-header">
        <h1>📊 Detalhes do Jogo</h1>
        <button
          className="btn-back"
          onClick={() => navigate(-1)}
          title="Voltar"
        >
          ← Voltar
        </button>
      </div>

      {/* Main Content */}
      <div className="details-content">
        {/* Score Header */}
        <ScoreHeader
          match={match}
          elapsedMinutes={0}
          addedTime={match?.addedTime || 0}
        />

        {/* Match Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="match-info-card"
        >
          <div className="info-grid">
            <div className="info-item">
              <label>📅 Data</label>
              <span>{new Date(match.date).toLocaleDateString('pt-PT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="info-item">
              <label>🏟️ Estádio</label>
              <span>{match.homeTeam?.name} Stadium</span>
            </div>
            <div className="info-item">
              <label>⏰ Horário</label>
              <span>{new Date(match.date).toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="info-item">
              <label>🎯 Status</label>
              <span className={`badge badge-${match.status}`}>
                {match.status === 'finished' && '✅ Terminado'}
                {match.status === 'live' && '🔴 Ao Vivo'}
                {match.status === 'scheduled' && '⏳ Agendado'}
                {match.status === 'halftime' && '⏸️ Intervalo'}
                {match.status === 'second_half' && '▶️ 2ª Parte'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Events Timeline */}
        {match.events && match.events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="section-title">⚽ Timeline de Eventos</h2>
            <EventTimeline events={match.events || []} />
          </motion.div>
        )}

        {/* Match Summary - Only for finished matches */}
        {match.status === 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MatchSummary match={match} events={match?.events || []} />
          </motion.div>
        )}

        {/* No Events Message */}
        {(!match.events || match.events.length === 0) && match.status === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <p>⏳ Jogo ainda não iniciado. Os eventos aparecerão aqui quando o jogo começar.</p>
          </motion.div>
        )}

        {(!match.events || match.events.length === 0) && match.status !== 'scheduled' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <p>📭 Sem eventos registados para este jogo.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPage;
