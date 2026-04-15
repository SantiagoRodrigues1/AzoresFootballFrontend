// components/live/EventModal.tsx
import React, { useState } from 'react';
import './EventModal.css';

export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';

interface Player {
  id: string;
  name: string;
  number: number;
}

interface EventModalProps {
  isOpen: boolean;
  eventType: EventType | null;
  players: Player[];
  starters?: Player[];  // Para substituição: seleção de quem sai
  substitutes?: Player[];  // Para substituição: seleção de quem entra
  onClose: () => void;
  onSubmit: (data: {
    type: EventType;
    minute: number;
    playerId?: string;
    playerInId?: string;
    playerOutId?: string;
    assistId?: string;
  }) => Promise<void>;
  currentMinute: number;
  isLoading: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  eventType,
  players,
  starters = [],
  substitutes = [],
  onClose,
  onSubmit,
  currentMinute,
  isLoading
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [assistPlayer, setAssistPlayer] = useState<string>('');
  const [playerIn, setPlayerIn] = useState<string>('');
  const [playerOut, setPlayerOut] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedPlayer('');
      setAssistPlayer('');
      setPlayerIn('');
      setPlayerOut('');
      setError('');
    }
  }, [isOpen, currentMinute, eventType, players, starters, substitutes]);

  // Filter out players with invalid IDs
  const validPlayers = players.filter(p => p.id && p.id !== null && p.id !== 'null');
  
  // Para substituição: usar arrays separados de starters e substitutes
  const validStarters = (eventType === 'substitution' ? starters : players).filter(p => p.id && p.id !== null && p.id !== 'null');
  const validSubstitutes = (eventType === 'substitution' ? substitutes : players).filter(p => p.id && p.id !== null && p.id !== 'null');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!eventType) {
      setError('Tipo de evento não definido');
      return;
    }

    if (eventType === 'substitution') {
      if (!playerOut || !playerIn) {
        setError('Selecione jogador a sair e a entrar');
        return;
      }
      if (playerOut === playerIn) {
        setError('Não pode ser o mesmo jogador');
        return;
      }
    } else {
      if (!selectedPlayer) {
        setError('Selecione um jogador');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const data: any = {
        type: eventType,
        minute: currentMinute  // Automático, sem input manual
      };

      if (eventType === 'substitution') {
        data.playerInId = playerIn;
        data.playerOutId = playerOut;
      } else {
        data.playerId = selectedPlayer;
        
        // Se for golo e tiver assistidor, adicionar
        if (eventType === 'goal' && assistPlayer) {
          data.assistId = assistPlayer;
        }
      }

      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !eventType) return null;

  const getTitle = () => {
    switch (eventType) {
      case 'goal':
        return '⚽ Registar Golo';
      case 'yellow_card':
        return '🟨 Cartão Amarelo';
      case 'red_card':
        return '🟥 Cartão Vermelho';
      case 'substitution':
        return '🔄 Substituição';
      default:
        return 'Novo Evento';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          {validPlayers.length === 0 && eventType !== 'substitution' && (
            <div className="form-error" style={{backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5'}}>
              <strong>❌ ERRO: Nenhum jogador disponível</strong>
              <p style={{marginTop: '8px', marginBottom: '0', fontSize: '13px'}}>
                A escalação não foi carregada. Possíveis causas:
                • Escalação não foi guardada antes de iniciar o jogo
                • Problema ao sincronizar dados com o servidor
                • Verifique a sua conexão
              </p>
            </div>
          )}

          {validStarters.length === 0 && eventType === 'substitution' && (
            <div className="form-error" style={{backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5'}}>
              <strong>❌ ERRO: Nenhum titular disponível</strong>
              <p style={{marginTop: '8px', marginBottom: '0', fontSize: '13px'}}>
                A escalação dos titulares não foi carregada.
              </p>
            </div>
          )}

          {validSubstitutes.length === 0 && eventType === 'substitution' && (
            <div className="form-error" style={{backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5'}}>
              <strong>❌ ERRO: Nenhum suplente disponível</strong>
              <p style={{marginTop: '8px', marginBottom: '0', fontSize: '13px'}}>
                Não há suplentes na escalação.
              </p>
            </div>
          )}

          {/* Minuto Automático - Apenas Display */}
          <div className="form-group">
            <label>Minuto do Jogo</label>
            <div className="minute-display">
              <span className="minute-value">{currentMinute}'</span>
              <span className="minute-label">(Automático)</span>
            </div>
          </div>

          {/* Substitution Form */}
          {eventType === 'substitution' ? (
            <>
              <div className="form-group">
                <label htmlFor="player-out">👥 Jogador a Sair (Titulares)</label>
                <select
                  id="player-out"
                  value={playerOut}
                  onChange={(e) => {
                    setPlayerOut(e.target.value);
                    // Limpar seleção do jogador a entrar se mudou quem sai
                    setPlayerIn('');
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">-- Selecione um Titular --</option>
                  {validStarters.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.number} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="player-in">🔄 Jogador a Entrar (Suplentes)</label>
                <select
                  id="player-in"
                  value={playerIn}
                  onChange={(e) => setPlayerIn(e.target.value)}
                  disabled={isSubmitting || !playerOut}
                >
                  <option value="">
                    {playerOut ? '-- Selecione um Suplente --' : '(Selecione primeiro quem sai)'}
                  </option>
                  {validSubstitutes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.number} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="player">👤 Jogador</label>
                <select
                  id="player"
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                >
                  <option value="">-- Selecione --</option>
                  {validPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.number} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo de Assistidor - Apenas para Golos */}
              {eventType === 'goal' && (
                <div className="form-group">
                  <label htmlFor="assist">🎯 Quem Assistiu? (Opcional)</label>
                  <select
                    id="assist"
                    value={assistPlayer}
                    onChange={(e) => setAssistPlayer(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Sem Assistência --</option>
                    {validPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.number} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
