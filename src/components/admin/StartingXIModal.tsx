import { useState, useEffect } from 'react';
import { IonButton, IonSpinner, IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';
import { X, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Player {
  id: string;
  nome: string;
  numero: string;
  position?: string;
  url?: string;
}

interface StartingXIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onSave?: (startingXI: string[], substitutes: string[]) => void;
}

interface Formation {
  name: string;
  positions: Array<{ x: number; y: number; label: string }>;
}

const FORMATIONS: Record<string, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { x: 50, y: 10, label: 'GR' },
      { x: 20, y: 35, label: 'LD' },
      { x: 35, y: 35, label: 'DC1' },
      { x: 65, y: 35, label: 'DC2' },
      { x: 80, y: 35, label: 'LE' },
      { x: 25, y: 60, label: 'MD1' },
      { x: 50, y: 60, label: 'MD' },
      { x: 75, y: 60, label: 'MD2' },
      { x: 20, y: 85, label: 'EE' },
      { x: 50, y: 85, label: 'AV' },
      { x: 80, y: 85, label: 'ED' },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { x: 50, y: 10, label: 'GR' },
      { x: 20, y: 35, label: 'LD' },
      { x: 35, y: 35, label: 'DC1' },
      { x: 65, y: 35, label: 'DC2' },
      { x: 80, y: 35, label: 'LE' },
      { x: 20, y: 60, label: 'ME1' },
      { x: 40, y: 60, label: 'ME2' },
      { x: 60, y: 60, label: 'ME3' },
      { x: 80, y: 60, label: 'ME4' },
      { x: 35, y: 85, label: 'AV1' },
      { x: 65, y: 85, label: 'AV2' },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { x: 50, y: 10, label: 'GR' },
      { x: 30, y: 35, label: 'DC1' },
      { x: 50, y: 35, label: 'DC2' },
      { x: 70, y: 35, label: 'DC3' },
      { x: 20, y: 60, label: 'ME1' },
      { x: 40, y: 60, label: 'ME2' },
      { x: 60, y: 60, label: 'ME3' },
      { x: 80, y: 60, label: 'ME4' },
      { x: 35, y: 85, label: 'AV1' },
      { x: 65, y: 85, label: 'AV2' },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { x: 50, y: 10, label: 'GR' },
      { x: 20, y: 35, label: 'LD' },
      { x: 35, y: 35, label: 'DC1' },
      { x: 50, y: 35, label: 'DC2' },
      { x: 65, y: 35, label: 'DC3' },
      { x: 80, y: 35, label: 'LE' },
      { x: 30, y: 62, label: 'MD1' },
      { x: 50, y: 62, label: 'MD2' },
      { x: 70, y: 62, label: 'MD3' },
      { x: 35, y: 85, label: 'AV1' },
      { x: 65, y: 85, label: 'AV2' },
    ],
  },
};

export function StartingXIModal({ open, onOpenChange, players, onSave }: StartingXIModalProps) {
  const [selectedFormation, setSelectedFormation] = useState<string>('4-3-3');
  const [startingXI, setStartingXI] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formation = FORMATIONS[selectedFormation];
  const availablePlayers = players.filter(
    (p) => !startingXI.includes(p.id) && !substitutes.includes(p.id)
  );
  const selectedPlayers = players.filter(
    (p) => startingXI.includes(p.id) || substitutes.includes(p.id)
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      onSave?.(startingXI, substitutes);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToStarting = (playerId: string) => {
    if (startingXI.length < 11) {
      setStartingXI([...startingXI, playerId]);
      if (substitutes.includes(playerId)) {
        setSubstitutes(substitutes.filter((id) => id !== playerId));
      }
    }
  };

  const handleAddToSubstitutes = (playerId: string) => {
    setSubstitutes([...substitutes, playerId]);
    if (startingXI.includes(playerId)) {
      setStartingXI(startingXI.filter((id) => id !== playerId));
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setStartingXI(startingXI.filter((id) => id !== playerId));
    setSubstitutes(substitutes.filter((id) => id !== playerId));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={() => !loading && onOpenChange(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white">Escalação (Starting XI)</h2>
            </div>
            <button
              onClick={() => !loading && onOpenChange(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Formation Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-muted-foreground">
                Formação Tática
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(FORMATIONS).map((formationKey) => (
                  <button
                    key={formationKey}
                    onClick={() => setSelectedFormation(formationKey)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      selectedFormation === formationKey
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {formationKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Visualization */}
            <div className="relative w-full bg-gradient-to-b from-green-700 to-green-600 rounded-2xl p-6 aspect-video flex flex-col justify-between border-4 border-white shadow-lg">
              {/* Field markup */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none rounded-2xl">
                <div className="absolute w-1/2 h-full border-l-2 border-white/30" />
                <div className="absolute w-full border-t-2 border-white/20" style={{ top: '50%' }} />
              </div>

              {/* Players on field */}
              <div className="relative w-full h-full">
                {formation.positions.map((position, idx) => {
                  const playerId = startingXI[idx];
                  const player = players.find((p) => p.id === playerId);

                  return (
                    <motion.div
                      key={idx}
                      className="absolute"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {player ? (
                        <div
                          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg border-4 border-white cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleRemovePlayer(playerId)}
                          title={`${player.nome} (${player.numero})`}
                        >
                          <span className="text-xs text-center">{player.numero}</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-dashed border-white flex items-center justify-center text-white text-xs font-semibold">
                          +
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Players Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Players */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Jogadores Disponíveis ({availablePlayers.length})
                </h3>
                <div className="bg-muted rounded-xl p-3 max-h-64 overflow-y-auto space-y-2">
                  {availablePlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-card rounded-lg p-3 flex items-center justify-between border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">
                          {player.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">{player.position || 'Posição'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                          {player.numero}
                        </span>
                        <button
                          onClick={() => handleAddToStarting(player.id)}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          disabled={startingXI.length >= 11}
                        >
                          XI
                        </button>
                        <button
                          onClick={() => handleAddToSubstitutes(player.id)}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                        >
                          Sub
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {availablePlayers.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      Todos os jogadores foram selecionados
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Players */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Selecionados ({selectedPlayers.length})
                </h3>
                <div className="bg-muted rounded-xl p-3 max-h-64 overflow-y-auto space-y-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded">
                      Starting XI ({startingXI.length}/11)
                    </p>
                    {startingXI.map((playerId) => {
                      const player = players.find((p) => p.id === playerId);
                      return player ? (
                        <div
                          key={playerId}
                          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex items-center justify-between border border-green-200 dark:border-green-800"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {player.nome}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemovePlayer(playerId)}
                            className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 transition-colors flex-shrink-0"
                          >
                            X
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded">
                      Suplentes ({substitutes.length})
                    </p>
                    {substitutes.map((playerId) => {
                      const player = players.find((p) => p.id === playerId);
                      return player ? (
                        <div
                          key={playerId}
                          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 flex items-center justify-between border border-yellow-200 dark:border-yellow-800"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {player.nome}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemovePlayer(playerId)}
                            className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 transition-colors flex-shrink-0"
                          >
                            X
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <IonButton
                expand="block"
                color="danger"
                onClick={() => !loading && onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </IonButton>
              <IonButton
                expand="block"
                onClick={handleSave}
                disabled={loading || startingXI.length < 11}
              >
                {loading ? <IonSpinner name="crescent" /> : 'Guardar'}
              </IonButton>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
