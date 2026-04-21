import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Eye, EyeOff, Crown, Star } from 'lucide-react';
import { useRef, useState } from 'react';

export interface LineupViewData {
  lineupId?: string;
  matchId?: string;
  teamName?: string;
  formation?: string;
  starters?: Array<{
    playerId: string | number | null;
    playerName: string;
    playerNumber: number | null;
    position: string;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
  }>;
  substitutes?: Array<{
    playerId: string | number | null;
    playerName: string;
    playerNumber: number | null;
    position: string;
    benchNumber?: number;
  }>;
  submittedAt?: Date | string;
  submittedBy?: string;
}

interface LineupViewerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lineup?: LineupViewData | null;
  lineupData?: any;
  opponentTeamName?: string;
  matchDate?: Date;
  homeTeam?: string;
  awayTeam?: string;
}

const positionNames: Record<string, { pt: string; short: string; emoji: string }> = {
  goalkeeper: { pt: 'Guarda-Redes', short: 'GR', emoji: '🥅' },
  gk: { pt: 'Guarda-Redes', short: 'GR', emoji: '🥅' },
  gr: { pt: 'Guarda-Redes', short: 'GR', emoji: '🥅' },
  defender: { pt: 'Defesa', short: 'D', emoji: '🛡️' },
  df: { pt: 'Defesa', short: 'D', emoji: '🛡️' },
  d: { pt: 'Defesa', short: 'D', emoji: '🛡️' },
  midfielder: { pt: 'Médio', short: 'M', emoji: '⚽' },
  mf: { pt: 'Médio', short: 'M', emoji: '⚽' },
  m: { pt: 'Médio', short: 'M', emoji: '⚽' },
  forward: { pt: 'Avançado', short: 'A', emoji: '⚔️' },
  fw: { pt: 'Avançado', short: 'A', emoji: '⚔️' },
  f: { pt: 'Avançado', short: 'A', emoji: '⚔️' }
};

/**
 * Gera key única e estável para cada jogador
 * ✅ Elimina warnings de keys duplicadas mesmo quando id é null
 */
const generatePlayerKey = (
  playerId: string | number | null | undefined,
  index: number,
  playerName: string,
  sector: 'starters' | 'subs',
  uniqueId: string
): string => {
  if (playerId !== null && playerId !== undefined && String(playerId).trim() !== '') {
    return `player-${uniqueId}-${sector}-${playerId}`;
  }
  
  const sanitizedName = playerName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 15);
  
  return `player-${uniqueId}-${sector}-${index}-${sanitizedName}`;
};

  const groupStartersByPosition = (
    starters: NonNullable<LineupViewData['starters']>,
    uniqueInstanceId: string
  ) => {
    const grouped: Record<string, Array<{ player: NonNullable<LineupViewData['starters']>[number]; playerKey: string }>> = {};

    starters.forEach((player, index) => {
      const position = (player.position?.toLowerCase() || 'midfielder').replace(/[^a-z]/g, '');
      const normalizedPos = position || 'midfielder';

      if (!grouped[normalizedPos]) {
        grouped[normalizedPos] = [];
      }

      grouped[normalizedPos].push({
        player,
        playerKey: generatePlayerKey(
          player.playerId,
          index,
          player.playerName,
          'starters',
          uniqueInstanceId
        )
      });
    });

    return grouped;
  };

export function LineupViewerModal({
  isOpen,
  onOpenChange,
  lineup,
  lineupData,
  opponentTeamName = 'Adversário',
  matchDate,
  homeTeam = 'Casa',
  awayTeam = 'Fora'
}: LineupViewerModalProps) {
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [selectedTeamLineup, setSelectedTeamLineup] = useState(0);
  const uniqueInstanceId = useRef(Math.random().toString(36).substring(7)).current;

  if (!isOpen) return null;

  // Processar dados - suportar múltiplos formatos
  let displayLineup: LineupViewData | null = lineup || null;
  let allLineups: LineupViewData[] = [];

  if (lineupData) {
    if (Array.isArray(lineupData.lineups)) {
      allLineups = lineupData.lineups;
      displayLineup = allLineups[selectedTeamLineup] || allLineups[0] || null;
    } else if (lineupData.data && Array.isArray(lineupData.data)) {
      allLineups = lineupData.data;
      displayLineup = allLineups[selectedTeamLineup] || allLineups[0] || null;
    } else if (lineupData.data && typeof lineupData.data === 'object') {
      displayLineup = lineupData.data;
    }
  }

  if (!displayLineup) return null;

  const starters = displayLineup.starters || [];
  const substitutes = displayLineup.substitutes || [];

  const groupedStarters = groupStartersByPosition(starters, uniqueInstanceId);

  const positionOrder = [
    'gk', 'gr', 'goalkeeper',
    'd', 'df', 'defender',
    'm', 'mf', 'midfielder',
    'f', 'fw', 'forward'
  ];

  // Renderizar titulares agrupados
  const renderStarters = () => {
    const result = [];
    const positionEmojis = {
      'gk': '🥅',
      'gr': '🥅', 
      'goalkeeper': '🥅',
      'd': '🛡️',
      'df': '🛡️',
      'defender': '🛡️',
      'm': '⚽',
      'mf': '⚽',
      'midfielder': '⚽',
      'f': '⚔️',
      'fw': '⚔️',
      'forward': '⚔️'
    };

    const positionColors = {
      'gk': { bg: 'from-yellow-300 to-yellow-500', border: 'border-yellow-400', text: 'text-yellow-900' },
      'gr': { bg: 'from-yellow-300 to-yellow-500', border: 'border-yellow-400', text: 'text-yellow-900' },
      'goalkeeper': { bg: 'from-yellow-300 to-yellow-500', border: 'border-yellow-400', text: 'text-yellow-900' },
      'd': { bg: 'from-blue-300 to-blue-500', border: 'border-blue-400', text: 'text-blue-900' },
      'df': { bg: 'from-blue-300 to-blue-500', border: 'border-blue-400', text: 'text-blue-900' },
      'defender': { bg: 'from-blue-300 to-blue-500', border: 'border-blue-400', text: 'text-blue-900' },
      'm': { bg: 'from-green-300 to-emerald-500', border: 'border-green-400', text: 'text-green-900' },
      'mf': { bg: 'from-green-300 to-emerald-500', border: 'border-green-400', text: 'text-green-900' },
      'midfielder': { bg: 'from-green-300 to-emerald-500', border: 'border-green-400', text: 'text-green-900' },
      'f': { bg: 'from-red-300 to-rose-500', border: 'border-red-400', text: 'text-red-900' },
      'fw': { bg: 'from-red-300 to-rose-500', border: 'border-red-400', text: 'text-red-900' },
      'forward': { bg: 'from-red-300 to-rose-500', border: 'border-red-400', text: 'text-red-900' }
    };

    for (const posKey of positionOrder) {
      const playersList = groupedStarters[posKey];
      if (!playersList || playersList.length === 0) continue;

      const posInfo = positionNames[posKey] || {
        pt: posKey.toUpperCase(),
        short: posKey.substring(0, 1).toUpperCase(),
        emoji: '⚽'
      };

      const colors = positionColors[posKey] || { bg: 'from-slate-300 to-slate-500', border: 'border-slate-400', text: 'text-slate-900' };

      result.push(
        <motion.div 
          key={`pos-section-${posKey}`} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Position Header */}
          <div className={`bg-gradient-to-r ${colors.bg} ${colors.border} ${colors.text} rounded-lg p-4 mb-4 border-2`}>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{posInfo.emoji}</span>
              <div>
                <h4 className="font-black text-lg">{posInfo.pt}</h4>
                <p className="text-xs opacity-75 font-semibold">{playersList.length} {playersList.length === 1 ? 'jogador' : 'jogadores'}</p>
              </div>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playersList.map(({ player, playerKey }, idx) => (
              <motion.div
                key={playerKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${colors.bg} ${colors.border} border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col`}>
                  {/* Card top with number */}
                  <div className="relative bg-white p-3 text-center flex-1 flex flex-col items-center justify-center">
                    {/* Jersey Number */}
                    {player.playerNumber !== null && player.playerNumber !== undefined && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-black text-slate-900 mb-1"
                      >
                        {player.playerNumber}
                      </motion.div>
                    )}

                    {/* Player Name */}
                    <h4 className="font-black text-sm text-slate-900 line-clamp-2 text-center leading-tight mb-1">
                      {player.playerName}
                    </h4>

                    {/* Position Short */}
                    <p className={`text-xs font-bold ${colors.text}`}>
                      {posInfo.short}
                    </p>
                  </div>

                  {/* Badges */}
                  {(player.isCaptain || player.isViceCaptain) && (
                    <div className={`${colors.bg} p-2 text-center text-white font-black text-xs`}>
                      {player.isCaptain && '🫡 Capitão'}
                      {player.isViceCaptain && '⭐ Vice'}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    return result;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
          >
            {/* Header Profissional */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 relative overflow-hidden z-10">
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">⚽</span>
                    <h2 className="text-3xl md:text-4xl font-black">
                      {displayLineup.teamName || 'Escalação'}
                    </h2>
                  </div>
                  {displayLineup.formation && (
                    <p className="text-slate-300 text-lg font-semibold">
                      Formação: <span className="text-white font-black text-xl">{displayLineup.formation}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2.5 hover:bg-slate-700 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Team Selector - Si hay múltiples equipos */}
              {allLineups.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mb-8 pb-6 border-b-2 border-border overflow-x-auto"
                >
                  {allLineups.map((l, idx) => (
                    <motion.button
                      key={`team-tab-${idx}-${l.teamName}`}
                      onClick={() => setSelectedTeamLineup(idx)}
                      className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                        selectedTeamLineup === idx
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-muted text-foreground hover:bg-muted/80 border-2 border-border'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      👥 {l.teamName}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-slate-200"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Titulares</p>
                    <p className="text-3xl font-black text-blue-600">{starters.length}</p>
                  </div>
                  <div className="border-l-2 border-r-2 border-slate-300">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Formação</p>
                    <p className="text-3xl font-black text-purple-600">{displayLineup.formation || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Suplentes</p>
                    <p className="text-3xl font-black text-emerald-600">{substitutes.length}</p>
                  </div>
                </div>
              </motion.div>

              {/* Titulares Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Onze Inicial</h3>
                    <p className="text-sm text-slate-600">{starters.length} jogadores em campo</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {renderStarters()}
                </div>
              </motion.div>

              {/* Suplentes Section */}
              {substitutes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10 pt-10 border-t-4 border-border"
                >
                  <motion.button
                    onClick={() => setShowSubstitutes(!showSubstitutes)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-bold transition-all mb-6 ${
                      showSubstitutes
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-card text-foreground border-2 border-border hover:border-amber-500 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {showSubstitutes ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                      <span>🔄 Banco de Suplentes ({substitutes.length})</span>
                    </div>
                    <span className="text-lg">
                      {showSubstitutes ? '−' : '+'}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showSubstitutes && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-3"
                      >
                        {substitutes.map((sub, index) => {
                          const subKey = generatePlayerKey(
                            sub.playerId,
                            index,
                            sub.playerName,
                            'subs',
                            uniqueInstanceId
                          );

                          const posInfo = positionNames[sub.position?.toLowerCase() || 'midfielder'] || {
                            pt: sub.position,
                            short: '?',
                            emoji: '⚽'
                          };

                          return (
                            <motion.div
                              key={subKey}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="text-3xl">{posInfo.emoji}</div>
                                  <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900">{sub.playerName}</p>
                                    <p className="text-xs font-semibold text-amber-700">{posInfo.pt}</p>
                                  </div>
                                </div>
                                {sub.playerNumber !== null && sub.playerNumber !== undefined && (
                                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                                    {sub.playerNumber}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Footer Info */}
              {(displayLineup.submittedAt || displayLineup.submittedBy) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-10 pt-6 border-t border-slate-300 text-center text-xs text-slate-600 space-y-1"
                >
                  {displayLineup.submittedBy && (
                    <p>
                      <span className="font-bold">Submetido por:</span> {displayLineup.submittedBy}
                    </p>
                  )}
                  {displayLineup.submittedAt && (
                    <p>
                      <span className="font-bold">Data:</span> {new Date(displayLineup.submittedAt).toLocaleString('pt-PT')}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
