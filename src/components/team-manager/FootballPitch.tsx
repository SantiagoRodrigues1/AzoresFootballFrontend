import { motion } from 'framer-motion';
import { Formation, LineupPlayer, FormationName } from '@/types';
import { PositionSlot } from './PositionSlot';
import { getFormationByName } from '@/utils/formations';

interface FootballPitchProps {
  formation: FormationName;
  selectedPlayers: LineupPlayer[];
  onPositionClick: (positionIndex: number) => void;
  onRemovePlayer?: (positionIndex: number) => void;
  disabled?: boolean;
}

export function FootballPitch({
  formation,
  selectedPlayers,
  onPositionClick,
  onRemovePlayer,
  disabled = false,
}: FootballPitchProps) {
  const formationData = getFormationByName(formation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-lg md:rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-emerald-900"
    >
      {/* Pitch Container - Fixed aspect ratio, responsive */}
      <div className="relative w-full" style={{ paddingBottom: '125%', maxWidth: '100%' }}>
        {/* Green field background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-green-600 to-emerald-700">
          {/* Field Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 125">
              <defs>
                <pattern id="grass" x="10" y="10" width="10" height="10" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="10" y2="10" stroke="white" strokeWidth="0.1" />
                  <line x1="10" y1="0" x2="0" y2="10" stroke="white" strokeWidth="0.1" />
                </pattern>
              </defs>
              <rect width="100" height="125" fill="url(#grass)" />
            </svg>
          </div>

          {/* Field Lines SVG - Properly scaled */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 125"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Shadow/Gradient Effect */}
            <defs>
              <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.1)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Outline - Thicker and Brighter */}
            <rect x="5" y="5" width="90" height="115" stroke="white" strokeWidth="0.8" fill="none" />

            {/* Center Line */}
            <line x1="50" y1="5" x2="50" y2="120" stroke="white" strokeWidth="0.6" />

            {/* Center Circle */}
            <circle cx="50" cy="62.5" r="8" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="62.5" r="1.5" fill="white" />

            {/* Goal Areas - Thicker */}
            <rect x="18" y="5" width="64" height="16" stroke="white" strokeWidth="0.6" fill="none" />
            <rect x="18" y="104" width="64" height="16" stroke="white" strokeWidth="0.6" fill="none" />

            {/* Penalty Areas */}
            <rect x="30" y="5" width="40" height="22" stroke="white" strokeWidth="0.6" fill="none" />
            <rect x="30" y="98" width="40" height="22" stroke="white" strokeWidth="0.6" fill="none" />

            {/* Penalty Marks */}
            <circle cx="50" cy="14" r="1" fill="white" />
            <circle cx="50" cy="111" r="1" fill="white" />

            {/* Goal Markers */}
            <circle cx="50" cy="7" r="2.5" stroke="white" strokeWidth="0.4" fill="none" />
            <circle cx="50" cy="118" r="2.5" stroke="white" strokeWidth="0.4" fill="none" />

            {/* Quarter Circles */}
            <path d="M 35 5 Q 35 13 30 13" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M 65 5 Q 65 13 70 13" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M 35 120 Q 35 112 30 112" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M 65 120 Q 65 112 70 112" stroke="white" strokeWidth="0.5" fill="none" />

            {/* Background gradient overlay */}
            <rect x="5" y="5" width="90" height="115" fill="url(#pitchGradient)" />
          </svg>

          {/* Position Slots - Positioned on the pitch */}
          {formationData.positions.map((position, index) => (
            <PositionSlot
              key={`${position.x}-${position.y}`}
              x={position.x}
              y={position.y}
              label={position.label}
              player={selectedPlayers[index] || null}
              selected={!!selectedPlayers[index]}
              onClick={() => !disabled && onPositionClick(index)}
              onRemove={
                onRemovePlayer
                  ? (e) => {
                      e.stopPropagation();
                      onRemovePlayer(index);
                    }
                  : undefined
              }
              disabled={disabled}
              positionType={position.positionType}
            />
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 px-4 md:px-6 py-3 md:py-4 border-t-2 md:border-t-4 border-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-3 md:gap-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-xl md:text-2xl">⚽</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Formação</p>
                <p className="text-lg md:text-xl font-black text-white">{formation}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="text-center px-2 md:px-4 border-l-2 border-r-2 border-emerald-400">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Posições</p>
              <p className="text-xl md:text-2xl font-black">
                <span className="text-emerald-300">{selectedPlayers.length}</span>
                <span className="text-gray-400">/{formationData.positions.length}</span>
              </p>
            </div>
            
            {selectedPlayers.length === formationData.positions.length && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-300 text-lg font-black whitespace-nowrap"
              >
                ✅ Completo!
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
