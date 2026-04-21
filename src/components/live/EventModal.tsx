// components/live/EventModal.tsx
import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Clock,
  Goal,
  RefreshCcw,
  Save,
  ShieldAlert,
  User,
  Users,
  X,
} from 'lucide-react';

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
  starters?: Player[];
  substitutes?: Player[];
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

type EventMeta = {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  badgeClass: string;
  dotClass: string;
  previewClass: string;
  saveButtonClass: string;
  saveLabel: string;
  availabilityLabel: string;
};

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  eventType,
  players,
  starters = [],
  substitutes = [],
  onClose,
  onSubmit,
  currentMinute,
  isLoading,
}) => {
  const formId = 'live-event-modal-form';
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [assistPlayer, setAssistPlayer] = useState('');
  const [playerIn, setPlayerIn] = useState('');
  const [playerOut, setPlayerOut] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedPlayer('');
      setAssistPlayer('');
      setPlayerIn('');
      setPlayerOut('');
      setError('');
    }
  }, [isOpen, eventType]);

  const validPlayers = players.filter((player) => player.id && player.id !== 'null');
  const validStarters = (eventType === 'substitution' ? starters : players).filter(
    (player) => player.id && player.id !== 'null'
  );
  const validSubstitutes = (eventType === 'substitution' ? substitutes : players).filter(
    (player) => player.id && player.id !== 'null'
  );
  const assistCandidates = validPlayers.filter((player) => player.id !== selectedPlayer);

  const getEventMeta = (): EventMeta => {
    switch (eventType) {
      case 'goal':
        return {
          icon: Goal,
          eyebrow: 'Acao ofensensiva',
          title: 'Registar golo',
          description: 'Associa o marcador ao lance e, se existir, a jogador de apoio na mesma sequencia.',
          badgeClass: 'border-secondary/20 bg-secondary/10 text-secondary',
          dotClass: 'bg-secondary',
          previewClass: 'border-secondary/20 bg-secondary/10 text-secondary',
          saveButtonClass: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_18px_36px_-18px_hsl(var(--secondary)/0.85)]',
          saveLabel: 'Guardar golo',
          availabilityLabel: 'Jogadores elegiveis',
        };
      case 'yellow_card':
        return {
          icon: ShieldAlert,
          eyebrow: 'Disciplina',
          title: 'Registar cartao amarelo',
          description: 'Marca a advertencia disciplinar ao jogador correspondente e guarda a acao no minuto atual.',
          badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
          dotClass: 'bg-amber-500',
          previewClass: 'border-amber-200 bg-amber-50 text-amber-800',
          saveButtonClass: 'bg-amber-500 text-white hover:bg-amber-500/90 shadow-[0_18px_36px_-18px_rgba(245,158,11,0.7)]',
          saveLabel: 'Guardar cartao',
          availabilityLabel: 'Jogadores selecionaveis',
        };
      case 'red_card':
        return {
          icon: ShieldAlert,
          eyebrow: 'Disciplina',
          title: 'Registar cartao vermelho',
          description: 'Regista a expulsao direta do jogador com uma confirmacao visual mais forte.',
          badgeClass: 'border-destructive/20 bg-destructive/10 text-destructive',
          dotClass: 'bg-destructive',
          previewClass: 'border-destructive/20 bg-destructive/10 text-destructive',
          saveButtonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_18px_36px_-18px_hsl(var(--destructive)/0.85)]',
          saveLabel: 'Guardar cartao',
          availabilityLabel: 'Jogadores selecionaveis',
        };
      case 'substitution':
        return {
          icon: RefreshCcw,
          eyebrow: 'Gestao tecnica',
          title: 'Registar substituicao',
          description: 'Controla a troca em campo de forma clara, com saida, entrada e leitura rapida do estado.',
          badgeClass: 'border-primary/20 bg-primary/10 text-primary',
          dotClass: 'bg-primary',
          previewClass: 'border-primary/20 bg-primary/10 text-primary',
          saveButtonClass: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_18px_36px_-18px_hsl(var(--primary)/0.85)]',
          saveLabel: 'Guardar substituicao',
          availabilityLabel: 'Titulares e suplentes disponiveis',
        };
      default:
        return {
          icon: Goal,
          eyebrow: 'Evento',
          title: 'Adicionar evento',
          description: 'Preenche a acicao com os dados oficiais do jogo.',
          badgeClass: 'border-primary/20 bg-primary/10 text-primary',
          dotClass: 'bg-primary',
          previewClass: 'border-primary/20 bg-primary/10 text-primary',
          saveButtonClass: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_18px_36px_-18px_hsl(var(--primary)/0.85)]',
          saveLabel: 'Guardar',
          availabilityLabel: 'Jogadores disponiveis',
        };
    }
  };

  const meta = getEventMeta();
  const EventIcon = meta.icon;
  const availableCount =
    eventType === 'substitution'
      ? validStarters.length + validSubstitutes.length
      : validPlayers.length;
  const isBlocked =
    eventType === 'substitution'
      ? validStarters.length === 0 || validSubstitutes.length === 0
      : validPlayers.length === 0;
  const selectedPlayerData = validPlayers.find((player) => player.id === selectedPlayer);
  const assistPlayerData = validPlayers.find((player) => player.id === assistPlayer);
  const playerOutData = validStarters.find((player) => player.id === playerOut);
  const playerInData = validSubstitutes.find((player) => player.id === playerIn);

  const fieldCardClass =
    'rounded-[28px] border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)]';
  const selectClass =
    'w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground';

  const renderPreview = (player: Player | undefined, label: string) => {
    if (!player) {
      return null;
    }

    return (
      <div className={`mt-3 inline-flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-2 ${meta.previewClass}`}>
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-background/80 px-2 text-xs font-black text-foreground shadow-sm">
          {player.number}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75">{label}</p>
          <p className="truncate text-sm font-semibold">{player.name}</p>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!eventType) {
      setError('Tipo de evento nao definido');
      return;
    }

    if (eventType === 'substitution') {
      if (!playerOut || !playerIn) {
        setError('Seleciona o jogador que sai e o jogador que entra');
        return;
      }

      if (playerOut === playerIn) {
        setError('O jogador que entra nao pode ser o mesmo que sai');
        return;
      }
    } else {
      if (!selectedPlayer) {
        setError('Seleciona um jogador');
        return;
      }

      if (eventType === 'goal' && assistPlayer && assistPlayer === selectedPlayer) {
        setError('O assistente tem de ser diferente do marcador do golo');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const data: {
        type: EventType;
        minute: number;
        playerId?: string;
        playerInId?: string;
        playerOutId?: string;
        assistId?: string;
      } = {
        type: eventType,
        minute: currentMinute,
      };

      if (eventType === 'substitution') {
        data.playerOutId = playerOut;
        data.playerInId = playerIn;
      } else {
        data.playerId = selectedPlayer;

        if (eventType === 'goal' && assistPlayer) {
          data.assistId = assistPlayer;
        }
      }

      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao registar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !eventType) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/72 backdrop-blur-md" onClick={onClose}>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
        <div
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] border border-border/80 bg-card shadow-[0_32px_100px_-40px_rgba(2,6,23,0.88)] sm:max-h-[46rem] sm:rounded-[32px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          <div className="relative shrink-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-primary via-primary to-accent px-6 py-6 text-primary-foreground sm:px-7 sm:py-7">
            <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute -bottom-16 left-0 h-36 w-36 rounded-full bg-secondary/25 blur-3xl" />

            <div className="relative flex items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur">
                  <EventIcon className="h-7 w-7" />
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
                    <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                    <span>{meta.eyebrow}</span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-[2rem]">{meta.title}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/80">{meta.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-primary-foreground transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">Minuto</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="text-4xl font-black tabular-nums">{currentMinute}'</span>
                  <span className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">Automatico</span>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">Disponiveis</p>
                <div className="mt-2 text-4xl font-black tabular-nums">{availableCount}</div>
                <p className="mt-1 text-xs text-primary-foreground/75">{meta.availabilityLabel}</p>
              </div>
            </div>
          </div>

          <form
            id={formId}
            onSubmit={handleSubmit}
            className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/25 px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="space-y-5 pb-2">
              {error && (
                <div className="rounded-[26px] border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Nao foi possivel guardar a acao</p>
                      <p className="mt-1 text-sm text-destructive/85">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {validPlayers.length === 0 && eventType !== 'substitution' && (
                <div className="rounded-[26px] border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Sem jogadores carregados</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        A escalaacao ainda nao foi sincronizada. Guarda primeiro a equipa inicial do jogo antes de registar eventos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validStarters.length === 0 && eventType === 'substitution' && (
                <div className="rounded-[26px] border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Sem titulares disponiveis</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        A equipa principal nao foi encontrada para este jogo, por isso a substitituicao nao pode ser registada.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validStarters.length > 0 && validSubstitutes.length === 0 && eventType === 'substitution' && (
                <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Sem suplentes disponiveis</p>
                      <p className="mt-1 text-sm text-amber-800/90">
                        Nao ha banco com jogadores elegiveis para entrada em campo nesta momento.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {eventType === 'substitution' ? (
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                  <div className={fieldCardClass}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Jogador a sair</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Seleciona o atleta que vai abandonar o terreno de jogo.</p>
                      </div>
                    </div>

                    <select
                      value={playerOut}
                      onChange={(e) => {
                        setPlayerOut(e.target.value);
                        setPlayerIn('');
                      }}
                      disabled={isSubmitting}
                      className={`mt-4 ${selectClass}`}
                    >
                      <option value="">Selecionar titular</option>
                      {validStarters.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.number} - {player.name}
                        </option>
                      ))}
                    </select>

                    {renderPreview(playerOutData, 'Jogador a sair')}
                  </div>

                  <div className="hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-card text-muted-foreground shadow-sm">
                    <ArrowRight className="h-5 w-5" />
                  </div>

                  <div className={fieldCardClass}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <RefreshCcw className="h-4 w-4 text-primary" />
                          <span>Jogador aentrar</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Escolhe o suplente que vai assumir a pososicao em campo.</p>
                      </div>
                    </div>

                    <select
                      value={playerIn}
                      onChange={(e) => setPlayerIn(e.target.value)}
                      disabled={isSubmitting || !playerOut}
                      className={`mt-4 ${selectClass}`}
                    >
                      <option value="">
                        {playerOut ? 'Selecionar suplente' : 'Seleciona primeiro quem sai'}
                      </option>
                      {validSubstitutes.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.number} - {player.name}
                        </option>
                      ))}
                    </select>

                    {renderPreview(playerInData, 'Jogador aentrar')}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className={fieldCardClass}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <User className="h-4 w-4 text-primary" />
                          <span>Jogador principal</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Seleciona o atleta diretamente envololvido na acao a reggistar.</p>
                      </div>
                    </div>

                    <select
                      value={selectedPlayer}
                      onChange={(e) => {
                        const nextPlayer = e.target.value;
                        setSelectedPlayer(nextPlayer);
                        if (assistPlayer === nextPlayer) {
                          setAssistPlayer('');
                        }
                      }}
                      disabled={isSubmitting}
                      className={`mt-4 ${selectClass}`}
                      autoFocus
                    >
                      <option value="">Selecionar jogador</option>
                      {validPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.number} - {player.name}
                        </option>
                      ))}
                    </select>

                    {renderPreview(selectedPlayerData, 'Jogador')}
                  </div>

                  {eventType === 'goal' && (
                    <div className={fieldCardClass}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>Assistencia</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">Opcional. Se existir, associa o apoio da jogada ofensiva.</p>
                        </div>
                      </div>

                      <select
                        value={assistPlayer}
                        onChange={(e) => setAssistPlayer(e.target.value)}
                        disabled={isSubmitting}
                        className={`mt-4 ${selectClass}`}
                      >
                        <option value="">Sem assistencia</option>
                        {assistCandidates.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.number} - {player.name}
                          </option>
                        ))}
                      </select>

                      {renderPreview(assistPlayerData, 'Assistencia')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="safe-bottom shrink-0 border-t border-border/80 bg-gradient-to-t from-background via-background/95 to-background/80 px-5 py-4 backdrop-blur sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form={formId}
                disabled={isSubmitting || isLoading || isBlocked}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${meta.saveButtonClass}`}
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'A guardar...' : meta.saveLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
