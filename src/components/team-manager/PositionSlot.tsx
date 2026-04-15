import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { LineupPlayer } from '@/types';
import { POSITION_COLORS } from '@/utils/formations';

interface PositionSlotProps {
  x: number;
  y: number;
  label: string;
  player?: LineupPlayer | null;
  selected: boolean;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  positionType: string;
}

export function PositionSlot({
  x,
  y,
  label,
  player,
  selected,
  onClick,
  onRemove,
  disabled = false,
  positionType,
}: PositionSlotProps) {
  const handleActivate = () => {
    if (!disabled) {
      onClick();
    }
  };

  const getPositionColor = (posType: string) => {
    const colors = {
      goalkeeper: { 
        bg: 'from-yellow-300 to-yellow-500', 
        border: 'border-yellow-600', 
        text: 'text-yellow-900',
        label: 'GR'
      },
      defender: { 
        bg: 'from-blue-300 to-blue-500', 
        border: 'border-blue-600', 
        text: 'text-blue-900',
        label: 'D'
      },
      midfielder: { 
        bg: 'from-green-300 to-emerald-500', 
        border: 'border-green-600', 
        text: 'text-green-900',
        label: 'M'
      },
      forward: { 
        bg: 'from-red-300 to-rose-500', 
        border: 'border-red-600', 
        text: 'text-red-900',
        label: 'A'
      }
    };
    return colors[posType] || colors.midfielder;
  };

  const getPlayerInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const posColor = getPositionColor(positionType);

  // Calculate responsive size based on viewport width
  const getResponsiveSize = () => {
    // Mobile: smaller, Desktop: larger
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      return isMobile ? 60 : 80;
    }
    return 80;
  };

  const slotSize = getResponsiveSize();

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.4,
        delay: (x + y) * 0.008,
        type: 'spring',
        stiffness: 120
      }}
      onClick={handleActivate}
      onPointerUp={(event) => {
        if (event.pointerType === 'touch' || event.pointerType === 'pen') {
          handleActivate();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleActivate();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      className="absolute z-20 select-none touch-manipulation focus:outline-none cursor-pointer group"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        transform: 'translate(-50%, -50%)',
        width: `${slotSize}px`,
        height: `${slotSize}px`,
      }}
    >
      {/* Player Container - Enlarged Circle */}
      <motion.div
        whileHover={!disabled && !player ? { scale: 1.25 } : !disabled && player ? { scale: 1.15 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        className={`
          w-full h-full rounded-full flex flex-col items-center justify-center
          transition-all duration-300 cursor-pointer font-bold
          border-4 shadow-2xl relative
          ${
            player
              ? `bg-gradient-to-br ${posColor.bg} ${posColor.border} text-white shadow-2xl drop-shadow-xl`
              : selected
                ? `bg-white border-dashed ${posColor.border} bg-opacity-90 shadow-lg`
                : `bg-white border-dashed ${posColor.border} bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70 hover:shadow-2xl`
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        {/* Player Info or Position Label */}
        {player ? (
          <div className="text-center leading-none w-full h-full flex flex-col items-center justify-center space-y-0.5">
            {/* Jersey Number - Top */}
            <motion.div 
              className="text-3xl font-black drop-shadow-xl leading-none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
            >
              {player.playerNumber}
            </motion.div>
            
            {/* Player Initials - Middle */}
            <motion.div 
              className="text-lg font-black drop-shadow-md leading-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
            >
              {getPlayerInitials(player.playerName)}
            </motion.div>

            {/* Position Label - Bottom */}
            <motion.div 
              className="text-xs font-black drop-shadow-md leading-none bg-black bg-opacity-30 px-1.5 py-0.5 rounded"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {posColor.label}
            </motion.div>
          </div>
        ) : (
          <div className={`text-center leading-tight ${posColor.text}`}>
            {/* Position Label - Empty Slot */}
            <div className="text-lg font-black opacity-70">{label}</div>
          </div>
        )}

        {/* Remove Button - Enhanced */}
        {player && onRemove && (
          <motion.button
            whileHover={{ scale: 1.3, rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            onClick={onRemove}
            className="absolute -top-4 -right-4 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border-2 border-white z-10"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}

        {/* Starter Badge - Improved */}
        {player?.isStarter && (
          <motion.div 
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-300 to-amber-500 text-white text-sm font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-amber-700"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: 'spring' }}
          >
            ⭐
          </motion.div>
        )}

        {/* Circle Pulse Effect when player is present */}
        {player && (
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ opacity: 0.2 }}
          />
        )}
      </motion.div>

      {/* Tooltip on Hover - Full Player Name and Position */}
      {player && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.8 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-3 rounded-lg text-sm font-bold whitespace-nowrap z-50 pointer-events-none shadow-2xl border-2 border-slate-600 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="font-black text-base">{player.playerName}</div>
            <div className="text-xs text-slate-300 mt-1">Posição: {posColor.label}</div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-slate-900 to-slate-800 border-b-2 border-r-2 border-slate-600 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}
