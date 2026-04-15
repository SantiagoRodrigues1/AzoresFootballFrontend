import { motion } from 'framer-motion';
import { LineupPlayer, CallUpPlayer } from '@/types';
import { POSITION_DISPLAY_NAMES } from '@/utils/formations';

interface LineupDisplayProps {
  starters: LineupPlayer[];
  substitutes: CallUpPlayer[];
  formation: string;
  captain?: string | null;
  viceCaptain?: string | null;
}

export function LineupDisplay({
  starters,
  substitutes,
  formation,
  captain,
  viceCaptain
}: LineupDisplayProps) {
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

  // Position order
  const positionOrder = ['goalkeeper', 'defender', 'midfielder', 'forward'];

  const getPositionInfo = (position: string) => {
    const info = {
      goalkeeper: { 
        pt: 'Guarda-Redes', 
        icon: '🥅',
        color: 'from-yellow-400 to-yellow-600',
        bgLight: 'bg-yellow-50',
        borderLight: 'border-yellow-200',
        badge: 'bg-yellow-500 text-white'
      },
      defender: { 
        pt: 'Defesa', 
        icon: '🛡️',
        color: 'from-blue-400 to-blue-600',
        bgLight: 'bg-blue-50',
        borderLight: 'border-blue-200',
        badge: 'bg-blue-500 text-white'
      },
      midfielder: { 
        pt: 'Médio', 
        icon: '🏃',
        color: 'from-green-400 to-green-600',
        bgLight: 'bg-green-50',
        borderLight: 'border-green-200',
        badge: 'bg-green-500 text-white'
      },
      forward: { 
        pt: 'Avançado', 
        icon: '⚡',
        color: 'from-red-400 to-red-600',
        bgLight: 'bg-red-50',
        borderLight: 'border-red-200',
        badge: 'bg-red-500 text-white'
      }
    };
    return info[position] || info.midfielder;
  };

  const getAvatarColor = (playerId: string) => {
    const colors = ['from-violet-400 to-purple-500', 'from-blue-400 to-cyan-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-indigo-400 to-blue-500'];
    const index = playerId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">⚽</span>
              <h2 className="text-4xl font-black">Onze Inicial</h2>
            </div>
            <p className="text-slate-300 text-sm font-semibold">Formação: <span className="text-white font-black text-lg">{formation}</span></p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Jogadores</p>
            <div className="text-5xl font-black text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {starters.length}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Starters grouped by position */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 mb-12"
        >
          {positionOrder.map((pos, posIdx) => {
            const players = groupedByPosition[pos] || [];
            if (players.length === 0) return null;

            const posInfo = getPositionInfo(pos);

            return (
              <motion.div
                key={pos}
                variants={itemVariants}
                className={`${posInfo.bgLight} border-2 ${posInfo.borderLight} rounded-2xl p-6 overflow-hidden`}
              >
                {/* Position Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{posInfo.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900">{posInfo.pt}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{players.length} {players.length === 1 ? 'jogador' : 'jogadores'} em campo</p>
                  </div>
                  <div className={`${posInfo.badge} px-4 py-2 rounded-full font-bold text-sm`}>
                    #{players.length}
                  </div>
                </div>

                {/* Players Grid */}
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
                        transition={{ delay: (posIdx * 5 + idx) * 0.08 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                          {/* Avatar Section */}
                          <div className={`relative w-full aspect-square bg-gradient-to-br ${avatarBg} flex items-center justify-center overflow-hidden`}>
                            {/* Initials */}
                            <div className="text-center">
                              <div className="text-5xl font-black text-white opacity-90">
                                {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                            </div>

                            {/* Jersey Number */}
                            <div className="absolute top-2 right-2 w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl border-3 border-white shadow-lg">
                              {player.playerNumber}
                            </div>

                            {/* Captain Badge */}
                            {isCaptain && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 rounded-full w-9 h-9 flex items-center justify-center font-black text-lg shadow-lg border-3 border-white" title="Capitão">
                                C
                              </div>
                            )}
                            
                            {/* Vice-Captain Badge */}
                            {isViceCaptain && (
                              <div className="absolute bottom-2 left-2 bg-orange-400 text-white rounded-full w-9 h-9 flex items-center justify-center font-black text-lg shadow-lg border-3 border-white" title="Vice-Capitão">
                                V
                              </div>
                            )}

                            {/* Formation Position Badge */}
                            <div className="absolute bottom-2 right-2 bg-slate-900 bg-opacity-90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                              {player.formationPosition}
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                            <div className="text-center">
                              <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                                {player.playerName}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold">
                                {getPositionInfo(player.position).pt}
                              </p>
                            </div>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end pointer-events-none">
                            <div className="w-full p-3 text-white text-xs space-y-1">
                              <div className="flex justify-between font-semibold">
                                <span>Nº:</span>
                                <span className="text-yellow-400">{player.playerNumber}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Posição:</span>
                                <span className="text-blue-400">{player.position}</span>
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
        </motion.div>

        {/* Substitutes Section */}
        {substitutes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t-4 border-slate-200 pt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔄</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Suplentes</h3>
                  <p className="text-xs text-slate-600 font-semibold">{substitutes.length} {substitutes.length === 1 ? 'suplente' : 'suplentes'} disponíveis</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-black text-sm">
                +{substitutes.length}
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
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 opacity-85 hover:opacity-100 h-full">
                      {/* Avatar */}
                      <div className={`relative w-full aspect-square bg-gradient-to-br ${avatarBg} flex items-center justify-center overflow-hidden`}>
                        <div className="text-3xl font-black text-white opacity-85">
                          {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>

                        {/* Jersey Number */}
                        <div className="absolute top-1.5 right-1.5 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-lg">
                          {player.playerNumber}
                        </div>

                        {/* Substitute Badge */}
                        <div className="absolute bottom-1.5 left-1.5 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Sub {idx + 1}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2.5 bg-white">
                        <p className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {player.playerName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
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

        {/* Empty state for substitutes */}
        {substitutes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t-4 border-slate-200 pt-8 text-center"
          >
            <p className="text-sm text-slate-600 font-semibold">👥 Nenhum suplente adicionado</p>
          </motion.div>
        )}
      </div>

      {/* Footer Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-6 flex items-center justify-between"
      >
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Titulares</p>
            <p className="text-3xl font-black">{starters.length}</p>
          </div>
          <div className="w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Suplentes</p>
            <p className="text-3xl font-black">{substitutes.length}</p>
          </div>
          <div className="w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Formação</p>
            <p className="text-3xl font-black">{formation}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Total de Jogadores</p>
          <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {starters.length + substitutes.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
