/**
 * LineupBuilder.tsx
 * Modern lineup builder with drag-and-drop
 * Mobile-optimized with interactive field visualization
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Check, Plus, X, AlertCircle, Flag } from 'lucide-react';
import './LineupBuilder.css';

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

interface LineupPosition {
  id: string;
  player: Player | null;
  position: string;
  row: number;
}

interface LineupBuilderProps {
  squad: Player[];
  onSave: (starters: Player[], substitutes: Player[], formation: string) => void;
  onCancel: () => void;
  initialFormation?: string;
  isLoading?: boolean;
}

const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Clássico',
    positions: [
      { row: 1, count: 1 },
      { row: 2, count: 4 },
      { row: 3, count: 3 },
      { row: 4, count: 3 },
    ],
  },
  '4-4-2': {
    name: '4-4-2 Clássico',
    positions: [
      { row: 1, count: 1 },
      { row: 2, count: 4 },
      { row: 3, count: 4 },
      { row: 4, count: 2 },
    ],
  },
  '3-5-2': {
    name: '3-5-2 Ofensivo',
    positions: [
      { row: 1, count: 1 },
      { row: 2, count: 3 },
      { row: 3, count: 5 },
      { row: 4, count: 2 },
    ],
  },
  '5-3-2': {
    name: '5-3-2 Defensivo',
    positions: [
      { row: 1, count: 1 },
      { row: 2, count: 5 },
      { row: 3, count: 3 },
      { row: 4, count: 2 },
    ],
  },
};

function PlayerCard({ player }: { player: Player }) {
  return (
    <motion.div
      className="lb-player-card"
      whileTap={{ scale: 1.05 }}
    >
      <div className="lb-player-number">{player.number}</div>
      <div className="lb-player-name">{player.name}</div>
      <div className="lb-player-position">{player.position}</div>
    </motion.div>
  );
}

function FieldSlot({
  position,
  onRemovePlayer,
}: {
  position: LineupPosition;
  onRemovePlayer: (id: string) => void;
}) {
  return (
    <motion.div
      className="lb-field-slot"
      whileHover={{ scale: 1.05 }}
    >
      {position.player ? (
        <motion.div
          className="lb-slot-player"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="lb-slot-number">{position.player.number}</div>
          <div className="lb-slot-name">{position.player.name}</div>
          <button
            className="lb-remove-btn"
            onClick={() => onRemovePlayer(position.id)}
          >
            <X size={12} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="lb-slot-empty"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Plus size={24} />
          <span className="lb-slot-label">Selecionar</span>
        </motion.div>
      )}
    </motion.div>
  );
}

const LineupBuilder: React.FC<LineupBuilderProps> = ({
  squad,
  onSave,
  onCancel,
  initialFormation = '4-3-3',
  isLoading = false,
}) => {
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>(
    (initialFormation as keyof typeof FORMATIONS) || '4-3-3'
  );
  const [fieldPositions, setFieldPositions] = useState<LineupPosition[]>([]);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const formationData = FORMATIONS[formation];
    const positions: LineupPosition[] = [];
    let posId = 0;

    formationData.positions.forEach((row) => {
      for (let i = 0; i < row.count; i++) {
        positions.push({
          id: `pos-${posId++}`,
          player: null,
          position: ['GK', 'DEF', 'MID', 'FWD'][row.row - 1] || 'POS',
          row: row.row,
        });
      }
    });

    setFieldPositions(positions);
    setSubstitutes(squad);
  }, [formation, squad]);

  const availablePlayers = useMemo(() => {
    const usedIds = new Set(
      fieldPositions.filter((p) => p.player).map((p) => p.player!.id)
    );
    return squad.filter((p) => !usedIds.has(p.id));
  }, [fieldPositions, squad]);

  const handleRemovePlayer = (positionId: string) => {
    setFieldPositions((prev) => {
      const updated = prev.map((p) =>
        p.id === positionId ? { ...p, player: null } : p
      );
      const removed = prev.find((p) => p.id === positionId)?.player;
      if (removed) {
        setSubstitutes((subs) => [...subs, removed]);
      }
      return updated;
    });
  };

  const startersOnField = fieldPositions.filter((p) => p.player);
  const canSave = startersOnField.length === 11;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    const starters = fieldPositions.filter((p) => p.player).map((p) => p.player!);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(starters, substitutes, formation);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="lb-container">
      <motion.div className="lb-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="lb-title">
          <Zap size={28} />
          Construtor de Plantel
        </h1>
        <p className="lb-subtitle">
          {startersOnField.length}/11 titulares
        </p>
      </motion.div>

      <motion.div
        className="lb-formation-selector"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="lb-selector-title">Formação</h2>
        <div className="lb-formation-grid">
          {Object.entries(FORMATIONS).map(([key, data]) => (
            <motion.button
              key={key}
              className={`lb-formation-btn ${formation === key ? 'active' : ''}`}
              onClick={() => setFormation(key as keyof typeof FORMATIONS)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {key}
              <span className="lb-formation-label">{data.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="lb-main">
        <motion.div
          className="lb-field-section"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="lb-field">
            {[1, 2, 3, 4].map((row) => (
              <motion.div key={row} className={`lb-field-row row-${row}`}>
                {fieldPositions
                  .filter((p) => p.row === row)
                  .map((pos) => (
                    <FieldSlot
                      key={pos.id}
                      position={pos}
                      onRemovePlayer={handleRemovePlayer}
                    />
                  ))}
              </motion.div>
            ))}
          </div>

          <motion.div
            className={`lb-completion ${canSave ? 'complete' : 'incomplete'}`}
          >
            {canSave ? (
              <>
                <Check size={20} />
                <span>Plantel completo!</span>
              </>
            ) : (
              <>
                <AlertCircle size={20} />
                <span>Faltam {11 - startersOnField.length} jogadores</span>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="lb-subs-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="lb-subs-header">
            <div className="lb-subs-title">
              <Users size={20} />
              <span>Suplentes ({availablePlayers.length})</span>
            </div>
          </div>

          <div className="lb-subs-grid">
            <AnimatePresence mode="popLayout">
              {availablePlayers.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <PlayerCard player={player} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="lb-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          className="lb-btn-cancel"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X size={18} />
          Cancelar
        </motion.button>

        <motion.button
          className={`lb-btn-save ${canSave ? 'active' : 'disabled'}`}
          onClick={handleSave}
          disabled={!canSave || isSaving}
          whileHover={canSave ? { scale: 1.02 } : {}}
          whileTap={canSave ? { scale: 0.98 } : {}}
        >
          {isSaving ? (
            <>
              <motion.div
                className="lb-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Guardando...
            </>
          ) : (
            <>
              <Check size={18} />
              Guardar Plantel
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LineupBuilder;
