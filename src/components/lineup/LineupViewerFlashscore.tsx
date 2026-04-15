import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, ChevronDown } from 'lucide-react';
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

interface LineupViewerFlashscoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lineup?: LineupViewData | null;
  lineupData?: any;
  opponentTeamName?: string;
  matchDate?: Date;
  homeTeam?: string;
  awayTeam?: string;
}

const POSITION_CONFIG: Record<string, { name: string; emoji: string; order: number; color: string }> = {
  gk: { name: 'Guarda-Redes', emoji: '🥅', order: 0, color: 'from-yellow-400 to-yellow-500' },
  goalkeeper: { name: 'Guarda-Redes', emoji: '🥅', order: 0, color: 'from-yellow-400 to-yellow-500' },
  gr: { name: 'Guarda-Redes', emoji: '🥅', order: 0, color: 'from-yellow-400 to-yellow-500' },
  d: { name: 'Defesa', emoji: '🛡️', order: 1, color: 'from-blue-400 to-blue-500' },
  defender: { name: 'Defesa', emoji: '🛡️', order: 1, color: 'from-blue-400 to-blue-500' },
  df: { name: 'Defesa', emoji: '🛡️', order: 1, color: 'from-blue-400 to-blue-500' },
  m: { name: 'Médio', emoji: '⚽', order: 2, color: 'from-green-400 to-green-500' },
  midfielder: { name: 'Médio', emoji: '⚽', order: 2, color: 'from-green-400 to-green-500' },
  mf: { name: 'Médio', emoji: '⚽', order: 2, color: 'from-green-400 to-green-500' },
  f: { name: 'Avançado', emoji: '⚔️', order: 3, color: 'from-red-400 to-red-500' },
  forward: { name: 'Avançado', emoji: '⚔️', order: 3, color: 'from-red-400 to-red-500' },
  fw: { name: 'Avançado', emoji: '⚔️', order: 3, color: 'from-red-400 to-red-500' },
};

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

const groupPlayersByPosition = (
  starters: NonNullable<LineupViewData['starters']>,
  uniqueInstanceId: string,
  teamIdx: number
) => {
  const grouped: Record<string, Array<{ player: NonNullable<LineupViewData['starters']>[number]; key: string }>> = {};

  starters.forEach((player, idx) => {
    const posKey = (player.position?.toLowerCase() || 'midfielder').replace(/[^a-z]/g, '');
    if (!grouped[posKey]) {
      grouped[posKey] = [];
    }

    grouped[posKey].push({
      player,
      key: generatePlayerKey(player.playerId, idx, player.playerName, 'starters', `${uniqueInstanceId}-${teamIdx}`),
    });
  });

  return grouped;
};

export function LineupViewerFlashscore({
  isOpen,
  onOpenChange,
  lineup,
  lineupData,
  homeTeam = 'Casa',
  awayTeam = 'Fora',
}: LineupViewerFlashscoreProps) {
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
  const uniqueInstanceId = useRef(Math.random().toString(36).substring(7)).current;

  if (!isOpen) return null;

  let allLineups: LineupViewData[] = [];

  // Extract lineups from various data structures
  if (lineupData) {
    if (Array.isArray(lineupData.lineups)) {
      allLineups = lineupData.lineups;
    } else if (lineupData.data && Array.isArray(lineupData.data)) {
      allLineups = lineupData.data;
    } else if (lineupData.data && typeof lineupData.data === 'object' && !Array.isArray(lineupData.data)) {
      allLineups = [lineupData.data];
    } else if (Array.isArray(lineupData)) {
      allLineups = lineupData;
    }
    
    // Normalize lineup data structure
    allLineups = allLineups.map(lineup => {
      const normalized: LineupViewData = {
        lineupId: lineup.lineupId || lineup._id,
        matchId: lineup.matchId,
        teamName: lineup.teamName,
        formation: lineup.formation,
        submittedAt: lineup.submittedAt,
        submittedBy: lineup.submittedBy,
        // Support multiple field names for starters
        starters: lineup.starters || lineup.startingXI || lineup.starting_xi || [],
        // Support multiple field names for substitutes
        substitutes: lineup.substitutes || lineup.bench || lineup.suplentes || [],
      };

      return normalized;
    });
  }

  if (!allLineups || allLineups.length === 0) {
    return null;
  }

  const positionOrder = ['gk', 'd', 'm', 'f'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-3 md:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-300"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-8 flex items-center justify-between rounded-t-2xl relative overflow-hidden border-b-4 border-blue-500">
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400 rounded-full -ml-20 -mb-20 blur-3xl" />
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    <span className="text-4xl">⚽</span>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black">Escalações do Jogo</h2>
                    <p className="text-sm font-bold opacity-90">Vê as duas equipas lado a lado</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenChange(false)}
                className="relative z-10 p-2.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Two Teams Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allLineups.map((displayLineup, teamIdx) => {
                  const starters = displayLineup.starters || [];
                  const substitutes = displayLineup.substitutes || [];
                  const groupedByPosition = groupPlayersByPosition(starters, uniqueInstanceId, teamIdx);

                  const renderTeamPlayers = () => {
                    return (
                      <div className="space-y-6">
                        {positionOrder.map((posKey) => {
                          const players = groupedByPosition[posKey] || [];
                          if (players.length === 0) return null;

                          const posConfig = POSITION_CONFIG[posKey as keyof typeof POSITION_CONFIG];

                          return (
                            <motion.div
                              key={`pos-section-${teamIdx}-${posKey}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3"
                            >
                              {/* Position Header */}
                              <motion.div 
                                className={`bg-gradient-to-r ${posConfig.color} rounded-xl p-3 text-white`}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{posConfig.emoji}</span>
                                  <div className="flex-1">
                                    <h4 className="font-black text-sm">{posConfig.name}</h4>
                                    <p className="text-xs opacity-90 font-bold">{players.length}</p>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Players Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {players.map(({ player, key }, idx) => {
                                  const getAvatarGradient = () => {
                                    const gradients = [
                                      'from-purple-500 to-pink-500',
                                      'from-blue-500 to-cyan-500',
                                      'from-emerald-500 to-teal-500',
                                      'from-orange-500 to-red-500',
                                      'from-indigo-500 to-purple-500',
                                      'from-pink-500 to-rose-500',
                                    ];
                                    return gradients[idx % gradients.length];
                                  };

                                  return (
                                    <motion.div
                                      key={key}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: idx * 0.04 }}
                                      whileHover={{ scale: 1.08, y: -6 }}
                                      className="group cursor-pointer"
                                    >
                                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col border-2 border-transparent hover:border-blue-300">
                                        {/* Avatar Section */}
                                        <div className={`bg-gradient-to-br ${getAvatarGradient()} aspect-square flex items-center justify-center relative overflow-hidden`}>
                                          {/* Player initials */}
                                          <div className="text-3xl font-black text-white opacity-95 drop-shadow-md">
                                            {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                          </div>

                                          {/* Jersey Number */}
                                          <div className="absolute top-1 right-1 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-lg">
                                            {player.playerNumber}
                                          </div>

                                          {/* Captain Badge */}
                                          {player.isCaptain && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="absolute top-1 left-1 bg-yellow-300 text-slate-900 rounded-full w-7 h-7 flex items-center justify-center font-black text-sm shadow-lg border-2 border-yellow-500"
                                            >
                                              C
                                            </motion.div>
                                          )}

                                          {/* Vice-Captain Badge */}
                                          {player.isViceCaptain && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="absolute bottom-1 left-1 bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center font-black text-sm shadow-lg border-2 border-orange-600"
                                            >
                                              V
                                            </motion.div>
                                          )}
                                        </div>

                                        {/* Info Section */}
                                        <div className="p-2 bg-white flex-1 flex flex-col justify-between">
                                          <div>
                                            <p className="font-black text-xs text-slate-900 line-clamp-2 group-hover:text-blue-600">
                                              {player.playerName}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  };

                  return (
                    <motion.div
                      key={`team-section-${teamIdx}`}
                      initial={{ opacity: 0, x: teamIdx === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: teamIdx * 0.1 }}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-300 shadow-lg"
                    >
                      {/* Team Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black">{displayLineup.teamName}</h3>
                          {displayLineup.formation && (
                            <p className="text-sm font-bold opacity-90">Formação: {displayLineup.formation}</p>
                          )}
                        </div>
                        <div className="text-right bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                          <p className="text-xs font-bold opacity-90">TITULARES</p>
                          <p className="text-2xl font-black">{starters.length}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                          <p className="text-xs font-bold text-blue-600">👥</p>
                          <p className="text-xl font-black text-slate-900">{starters.length}</p>
                          <p className="text-xs text-slate-600">Titulares</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                          <p className="text-xs font-bold text-amber-600">🔄</p>
                          <p className="text-xl font-black text-slate-900">{substitutes.length}</p>
                          <p className="text-xs text-slate-600">Suplentes</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                          <p className="text-xs font-bold text-green-600">🏆</p>
                          <p className="text-xl font-black text-slate-900">{starters.length + substitutes.length}</p>
                          <p className="text-xs text-slate-600">Total</p>
                        </div>
                      </div>

                      {/* Players */}
                      {starters.length > 0 ? (
                        renderTeamPlayers()
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-blue-50 rounded-xl border-2 border-blue-300 text-center"
                        >
                          <p className="text-2xl mb-2">🚫</p>
                          <p className="text-sm font-bold text-blue-700">Titulares ainda não foram definidos</p>
                          <p className="text-xs text-blue-600 mt-1">Aguardando confirmação de escalação</p>
                        </motion.div>
                      )}

                      {/* Suplentes */}
                      {substitutes.length > 0 && (
                        <motion.div className="mt-6 pt-6 border-t-2 border-slate-300">
                          <motion.button
                            onClick={() => {
                              const key = `subs-${teamIdx}`;
                              setExpandedPositions(
                                expandedPositions.has(key)
                                  ? new Set(Array.from(expandedPositions).filter(p => p !== key))
                                  : new Set([...Array.from(expandedPositions), key])
                              );
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold transition-all ${
                              expandedPositions.has(`subs-${teamIdx}`)
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                                : 'bg-white text-slate-800 border-2 border-amber-300 hover:bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🔄</span>
                              <span className="text-sm">Banco ({substitutes.length})</span>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedPositions.has(`subs-${teamIdx}`) ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={20} />
                            </motion.div>
                          </motion.button>

                          {expandedPositions.has(`subs-${teamIdx}`) && (
                            <motion.div
                              initial={{ opacity: 0, y: -15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
                            >
                              {substitutes.map((sub, idx) => {
                                const subKey = generatePlayerKey(
                                  sub.playerId,
                                  idx,
                                  sub.playerName,
                                  'subs',
                                  `${uniqueInstanceId}-${teamIdx}`
                                );

                                const posConfig = POSITION_CONFIG[(sub.position?.toLowerCase() || 'midfielder') as keyof typeof POSITION_CONFIG] || 
                                                 { name: sub.position, emoji: '⚽', color: 'from-indigo-400 to-indigo-500' };

                                const getAvatarGradient = () => {
                                  const gradients = [
                                    'from-purple-500 to-pink-500',
                                    'from-blue-500 to-cyan-500',
                                    'from-emerald-500 to-teal-500',
                                    'from-orange-500 to-red-500',
                                    'from-indigo-500 to-purple-500',
                                    'from-pink-500 to-rose-500',
                                  ];
                                  return gradients[idx % gradients.length];
                                };

                                return (
                                  <motion.div
                                    key={subKey}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    whileHover={{ scale: 1.08, y: -3 }}
                                  >
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col border border-amber-200">
                                      <div className={`bg-gradient-to-br ${getAvatarGradient()} aspect-square flex items-center justify-center relative`}>
                                        <div className="text-2xl font-black text-white opacity-90">
                                          {sub.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className="absolute top-1 right-1 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs border border-white">
                                          {sub.playerNumber}
                                        </div>
                                      </div>
                                      <div className="p-1.5 bg-white text-center text-xs">
                                        <p className="font-bold text-slate-900 line-clamp-1">{sub.playerName}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
