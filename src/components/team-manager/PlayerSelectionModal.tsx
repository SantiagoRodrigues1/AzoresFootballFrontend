import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { CallUpPlayer, PlayerPosition } from '@/types';
import { POSITION_DISPLAY_NAMES, POSITION_COLORS } from '@/utils/formations';

interface PlayerSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePlayers: CallUpPlayer[];
  requestedPosition: PlayerPosition;
  onSelectPlayer: (player: CallUpPlayer) => void;
}

export function PlayerSelectionModal({
  open,
  onOpenChange,
  availablePlayers,
  requestedPosition,
  onSelectPlayer,
}: PlayerSelectionModalProps) {
  const [filterPosition, setFilterPosition] = useState<PlayerPosition | 'all'>(requestedPosition);

  useEffect(() => {
    if (open) {
      setFilterPosition(requestedPosition);
    }
  }, [open, requestedPosition]);

  const filteredPlayers = useMemo(() => {
    if (filterPosition === 'all') return availablePlayers;
    return availablePlayers.filter((p) => p.position === filterPosition);
  }, [availablePlayers, filterPosition]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="surface-card flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary/5 p-6 dark:bg-primary/10">
            <div>
              <h2 className="text-xl font-bold text-foreground">Seleccione um Jogador</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Posição: {POSITION_DISPLAY_NAMES[requestedPosition]}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter */}
          <div className="border-b border-border bg-muted/40 px-6 py-4">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'goalkeeper', 'defender', 'midfielder', 'forward'] as const).map(
                (pos) => (
                  <motion.button
                    key={pos}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterPosition(pos)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterPosition === pos
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-card border border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {pos === 'all'
                      ? 'Todos'
                      : POSITION_DISPLAY_NAMES[pos].split(' ')[0]}
                  </motion.button>
                )
              )}
            </div>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredPlayers.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                <Settings className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Nenhum jogador disponível</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <motion.button
                    key={player.playerId}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      onSelectPlayer(player);
                      onOpenChange(false);
                    }}
                    className="group w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {player.playerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{player.playerNumber} • {POSITION_DISPLAY_NAMES[player.position]}
                        </div>
                      </div>
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                          ${
                            player.position === 'goalkeeper'
                              ? 'bg-yellow-500'
                              : player.position === 'defender'
                                ? 'bg-blue-500'
                                : player.position === 'midfielder'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                          }
                        `}
                      >
                        {player.playerNumber}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
