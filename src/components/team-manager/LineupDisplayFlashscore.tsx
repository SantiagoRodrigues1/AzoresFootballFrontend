import { motion } from 'framer-motion';
import { LineupPlayer, CallUpPlayer } from '@/types';
import { POSITION_DISPLAY_NAMES } from '@/utils/formations';

interface LineupDisplayFlashscoreProps {
  starters: LineupPlayer[];
  substitutes: CallUpPlayer[];
  formation: string;
  captain?: string | null;
  viceCaptain?: string | null;
}

export function LineupDisplayFlashscore({
  starters,
  substitutes,
  formation,
  captain,
  viceCaptain
}: LineupDisplayFlashscoreProps) {
  
  // Group starters by position
  const groupedByPosition = starters.reduce(
    (acc, player) => {
      const pos = player.position;
      if (!acc[pos]) {
        acc[pos] = [];
      }
      acc[pos].push(player);
      return acc;
    },
    {} as Record<string, LineupPlayer[]>
  );

  // Position order and display info
  const positionOrder = ['goalkeeper', 'defender', 'midfielder', 'forward'];
  
  const getPositionInfo = (position: string) => {
    const info = {
      goalkeeper: { pt: 'Guarda-Redes', icon: '🥅', color: 'from-yellow-400 to-yellow-600', bgLight: 'bg-yellow-50', borderLight: 'border-yellow-200' },
      defender: { pt: 'Defesa', icon: '🛡️', color: 'from-blue-400 to-blue-600', bgLight: 'bg-blue-50', borderLight: 'border-blue-200' },
      midfielder: { pt: 'Médio', icon: '🏃', color: 'from-green-400 to-green-600', bgLight: 'bg-green-50', borderLight: 'border-green-200' },
      forward: { pt: 'Avançado', icon: '⚡', color: 'from-red-400 to-red-600', bgLight: 'bg-red-50', borderLight: 'border-red-200' }
    };
    return info[position] || info.midfielder;
  };

  // Generate avatar color based on player ID
  const getAvatarColor = (playerId: string) => {
    const colors = ['from-red-400 to-pink-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-emerald-500', 'from-purple-400 to-pink-500', 'from-orange-400 to-red-500'];
    const index = playerId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-black text-white">Escalação Completa</h2>
          <span className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full">
            Formação {formation}
          </span>
        </div>
        <p className="text-slate-400 text-sm">11 titulares + {substitutes.length} suplentes</p>
      </div>

      {/* 11 Inicial - Flashscore Style */}
      <div className="mb-10">
        <div className="space-y-8">
          {positionOrder.map((pos) => {
            const players = groupedByPosition[pos] || [];
            if (players.length === 0) return null;

            const posInfo = getPositionInfo(pos);

            return (
              <motion.div
                key={pos}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${posInfo.bgLight} border-2 ${posInfo.borderLight} rounded-xl p-6`}
              >
                {/* Position Header */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl">{posInfo.icon}</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{posInfo.pt}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{players.length} {players.length === 1 ? 'jogador' : 'jogadores'}</p>
                  </div>
                  <div className="ml-auto bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    {players.map((_, i) => '●').join('')}
                  </div>
                </div>

                {/* Players Grid - Flashscore Style */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {players.map((player, idx) => {
                    const isCaptain = captain === player.playerId;
                    const isViceCaptain = viceCaptain === player.playerId;
                    const avatarBg = getAvatarColor(player.playerId);

                    return (
                      <motion.div
                        key={`${player.playerId}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative"
                      >
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                          {/* Avatar/Photo Container */}
                          <div className={`relative w-full aspect-square bg-gradient-to-br ${avatarBg} flex items-center justify-center overflow-hidden`}>
                            {/* Initials as placeholder */}
                            <div className="text-center">
                              <div className="text-4xl font-black text-white opacity-80">
                                {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                            </div>

                            {/* Jersey Number - Large */}
                            <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-lg">
                              {player.playerNumber}
                            </div>

                            {/* Captain Badge */}
                            {isCaptain && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-black text-lg shadow-lg border-2 border-white" title="Capitão">
                                C
                              </div>
                            )}
                            {isViceCaptain && (
                              <div className="absolute bottom-2 left-2 bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-lg shadow-lg border-2 border-white" title="Vice-Capitão">
                                V
                              </div>
                            )}

                            {/* Position Badge */}
                            <div className="absolute bottom-2 right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {player.formationPosition}
                            </div>
                          </div>

                          {/* Player Info */}
                          <div className="p-3 bg-white">
                            <div className="text-center">
                              <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-tight mb-1">
                                {player.playerName}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold">
                                #{player.playerNumber}
                              </p>
                            </div>
                          </div>

                          {/* Hover Effect - Stats */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 rounded-lg">
                            <div className="text-white text-xs space-y-1 w-full">
                              <div className="flex justify-between">
                                <span>Posição:</span>
                                <span className="font-bold">{player.position}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Escalado em:</span>
                                <span className="font-bold">{player.formationPosition}</span>
                              </div>
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
      </div>

      {/* Suplentes Section */}
      {substitutes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t-4 border-slate-700 pt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔄</span>
            <div>
              <h3 className="text-2xl font-black text-white">Suplentes</h3>
              <p className="text-xs text-slate-400 font-semibold">{substitutes.length} {substitutes.length === 1 ? 'suplente' : 'suplentes'} disponíveis</p>
            </div>
          </div>

          {/* Substitutes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {substitutes.map((player, idx) => {
              const posInfo = getPositionInfo(player.position);
              const avatarBg = getAvatarColor(player.playerId);

              return (
                <motion.div
                  key={`sub-${player.playerId}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative"
                >
                  <div className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-80 hover:opacity-100">
                    {/* Avatar */}
                    <div className={`relative w-full aspect-square bg-gradient-to-br ${avatarBg} flex items-center justify-center overflow-hidden`}>
                      <div className="text-center">
                        <div className="text-2xl font-black text-white opacity-80">
                          {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      </div>

                      {/* Jersey Number */}
                      <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-lg">
                        {player.playerNumber}
                      </div>

                      {/* Sub Badge */}
                      <div className="absolute bottom-1 left-1 bg-slate-900 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        Sub {idx + 1}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2 bg-white">
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">
                        {player.playerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {posInfo.pt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4"
      >
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-slate-400 text-xs font-semibold">TITULARES</p>
            <p className="text-3xl font-black text-white">{starters.length}</p>
          </div>
          <div className="text-slate-600">|</div>
          <div className="text-center">
            <p className="text-slate-400 text-xs font-semibold">SUPLENTES</p>
            <p className="text-3xl font-black text-white">{substitutes.length}</p>
          </div>
          <div className="text-slate-600">|</div>
          <div className="text-center">
            <p className="text-slate-400 text-xs font-semibold">FORMAÇÃO</p>
            <p className="text-3xl font-black text-white">{formation}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-semibold">TOTAL</p>
          <p className="text-4xl font-black bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {starters.length + substitutes.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
