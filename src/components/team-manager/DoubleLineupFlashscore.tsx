import { motion } from 'framer-motion';
import { LineupPlayer, CallUpPlayer } from '@/types';
import { FORMATIONS } from '@/utils/formations';

interface DoubleLineupFlashscoreProps {
  homeTeam: {
    id: string;
    name: string;
    starters: LineupPlayer[];
    substitutes: CallUpPlayer[];
    formation: string;
    captain?: string | null;
    viceCaptain?: string | null;
  };
  awayTeam: {
    id: string;
    name: string;
    starters: LineupPlayer[];
    substitutes: CallUpPlayer[];
    formation: string;
    captain?: string | null;
    viceCaptain?: string | null;
  };
}

export function DoubleLineupFlashscore({
  homeTeam,
  awayTeam
}: DoubleLineupFlashscoreProps) {

  const getAvatarColor = (playerId: string) => {
    const colors = ['from-red-400 to-pink-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-emerald-500', 'from-purple-400 to-pink-500', 'from-orange-400 to-red-500'];
    const index = playerId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const PlayerCard = ({ player, isCaptain, isViceCaptain }: { player: LineupPlayer | CallUpPlayer; isCaptain: boolean; isViceCaptain: boolean }) => {
    const avatarBg = getAvatarColor(player.playerId);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative"
      >
        <div className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          {/* Avatar/Photo Container */}
          <div className={`relative w-full aspect-square bg-gradient-to-br ${avatarBg} flex items-center justify-center overflow-hidden`}>
            <div className="text-center">
              <div className="text-3xl font-black text-white opacity-80">
                {player.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
            </div>

            {/* Jersey Number */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-lg">
              {player.playerNumber}
            </div>

            {/* Captain Badge */}
            {isCaptain && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 rounded-full w-7 h-7 flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
                C
              </div>
            )}
            {isViceCaptain && (
              <div className="absolute bottom-2 left-2 bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
                V
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="p-2 bg-white text-center">
            <h4 className="font-black text-slate-900 text-xs line-clamp-1 leading-tight">
              {player.playerName}
            </h4>
            <p className="text-xs text-slate-500 font-semibold">
              #{player.playerNumber}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const TeamPanel = ({ team, isHome }: { team: typeof homeTeam; isHome: boolean }) => {
    const formationData = FORMATIONS[team.formation as keyof typeof FORMATIONS];
    const sortByYPosition = (players: LineupPlayer[]) => {
      return [...players].sort((a, b) => {
        const posOrder = { goalkeeper: 0, defender: 1, midfielder: 2, forward: 3 };
        return (posOrder[a.position as keyof typeof posOrder] || 0) - (posOrder[b.position as keyof typeof posOrder] || 0);
      });
    };

    const sortedStarters = sortByYPosition(team.starters);

    return (
      <motion.div
        initial={{ opacity: 0, x: isHome ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex-1 ${isHome ? 'pr-2' : 'pl-2'}`}
      >
        {/* Team Header */}
        <div className={`text-center mb-4 pb-3 border-b-2 ${isHome ? 'border-blue-200' : 'border-red-200'}`}>
          <h2 className={`text-xl font-black ${isHome ? 'text-blue-900' : 'text-red-900'}`}>
            {team.name}
          </h2>
          <p className="text-xs text-gray-600">Formação {team.formation}</p>
        </div>

        {/* Formation Label */}
        <div className={`text-center mb-3 px-2 py-1 rounded-lg ${isHome ? 'bg-blue-100' : 'bg-red-100'}`}>
          <p className={`text-xs font-bold ${isHome ? 'text-blue-700' : 'text-red-700'}`}>
            {formationData?.name || team.formation}
          </p>
        </div>

        {/* Players Grid - Compact for side-by-side */}
        <div className="space-y-3">
          {sortedStarters.map((player, idx) => {
            const isCaptain = team.captain === player.playerId;
            const isViceCaptain = team.viceCaptain === player.playerId;
            return (
              <motion.div
                key={`${player.playerId}-${idx}`}
                initial={{ opacity: 0, x: isHome ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <PlayerCard player={player} isCaptain={isCaptain} isViceCaptain={isViceCaptain} />
              </motion.div>
            );
          })}
        </div>

        {/* Substitutes - Compact view */}
        {team.substitutes.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-gray-200">
            <p className="text-xs font-bold text-gray-600 text-center mb-2">Suplentes ({team.substitutes.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {team.substitutes.map((sub, idx) => (
                <motion.div
                  key={`sub-${sub.playerId}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-lg overflow-hidden shadow-md opacity-75 hover:opacity-100 transition-opacity">
                    <div className={`relative w-full aspect-square bg-gradient-to-br ${getAvatarColor(sub.playerId)} flex items-center justify-center overflow-hidden`}>
                      <div className="text-center">
                        <div className="text-lg font-black text-white opacity-80">
                          {sub.playerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs border border-white">
                        {sub.playerNumber}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-xs font-bold px-1 rounded-tl">
                        S
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700 overflow-hidden"
    >
      {/* Main Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-white mb-2">⚽ Confronto de Escalações</h1>
        <p className="text-sm text-slate-300">Comparação de formações e jogadores</p>
      </div>

      {/* Double Team Layout */}
      <div className="flex gap-2">
        {/* Home Team */}
        <TeamPanel team={homeTeam} isHome={true} />

        {/* Center Divider with Field */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="w-1 bg-gradient-to-b from-slate-700 via-slate-500 to-slate-700 rounded-full flex flex-col items-center justify-center relative"
        >
          {/* Field Icon */}
          <div className="absolute flex flex-col items-center gap-2 text-slate-300">
            <div className="text-2xl">⚽</div>
            <div className="text-xs font-bold text-center">VS</div>
          </div>
        </motion.div>

        {/* Away Team */}
        <TeamPanel team={awayTeam} isHome={false} />
      </div>

      {/* Footer with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-4 gap-4"
      >
        <div className="text-center">
          <p className="text-slate-400 text-xs font-semibold">CASA</p>
          <p className="text-2xl font-black text-blue-400">{homeTeam.starters.length}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs font-semibold">FORMAÇÃO</p>
          <p className="text-lg font-black text-white">{homeTeam.formation}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs font-semibold">FORMAÇÃO</p>
          <p className="text-lg font-black text-white">{awayTeam.formation}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs font-semibold">FORA</p>
          <p className="text-2xl font-black text-red-400">{awayTeam.starters.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
