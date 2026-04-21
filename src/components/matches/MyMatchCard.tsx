import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

interface Match {
  _id?: string;  // From MongoDB
  id?: string;   // Sometimes used
  homeTeam?: { name: string; id: string };
  awayTeam?: { name: string; id: string };
  casa?: string;
  fora?: string;
  data_hora?: string;
  date?: string;
  status?: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished' | 'postponed';
  resultado?: string;
  competicao?: string;
  competition?: string | { id?: string; name?: string } | null;
  estadio?: string;
}

interface MyMatchCardProps {
  match: Match;
  teamName: string;
}

export function MyMatchCard({ match, teamName }: MyMatchCardProps) {
  const navigate = useNavigate();

  // Get match ID safely - support both _id and id formats
  const matchId = match.id || match._id || '';
  const matchDate = new Date(match.date || match.data_hora || '');
  const competitionName = typeof match.competition === 'string'
    ? match.competition
    : match.competition?.name || match.competicao || '';
  
  // Determine home/away - FIX: Use casa/fora first as they are the actual team names from API
  const homeTeamName = match.casa || match.homeTeam?.name || '';
  const awayTeamName = match.fora || match.awayTeam?.name || '';
  const isHome = homeTeamName.toLowerCase().includes(teamName.toLowerCase());
  const isCompleted = match.status === 'finished';
  const isLive = match.status === 'live' || match.status === 'halftime' || match.status === 'second_half';
  const isScheduled = match.status === 'scheduled';

  // Format date
  const dateStr = matchDate.toLocaleDateString('pt-PT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = matchDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Status badge
  const getStatusColor = (): string => {
    switch (match.status) {
      case 'live':
        return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200';
      case 'finished':
        return 'bg-muted text-muted-foreground';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (): string => {
    switch (match.status) {
      case 'live':
        return 'AO VIVO';
      case 'finished':
        return 'TERMINADO';
      case 'scheduled':
        return 'AGENDADO';
      case 'halftime':
        return 'INTERVALO';
      case 'postponed':
        return 'ADIADO';
      default:
        return 'AGENDADO';
    }
  };

  const handleViewLineup = () => {
    if (!matchId) return;
    navigate(`/match-lineup/${matchId}`);
  };

  const handleManageLiveMatch = () => {
    if (!matchId) return;
    navigate(`/live-match/${matchId}`);
  };

  const handleViewMatchDetails = () => {
    if (!matchId) return;
    navigate(`/match/${matchId}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="surface-card flex h-full cursor-pointer flex-col overflow-hidden rounded-xl transition-all hover:border-primary hover:shadow-lg"
    >
      {/* Header with Status */}
      <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3 dark:bg-primary/10">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">{dateStr}</span>
        </div>
        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor()}`}
        >
          {getStatusLabel()}
        </motion.span>
      </div>

      {/* Match Info */}
      <div className="flex-1 p-4">
        {/* Teams and Score */}
        <div className="space-y-3 mb-4">
          {/* Home Team */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg ${
              isHome ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-500/10' : 'hover:bg-muted/50'
            }`}
          >
            <span
              className={`font-semibold text-sm flex-1 ${
                isHome ? 'text-blue-900 dark:text-blue-200' : 'text-foreground'
              }`}
            >
              {homeTeamName}
            </span>
            {isCompleted && match.resultado && (
              <span className="ml-2 text-lg font-bold text-foreground">
                {match.resultado.split('-')[0]}
              </span>
            )}
          </div>

          {/* vs */}
          <div className="flex items-center justify-center text-xs font-semibold text-muted-foreground">
            VS
          </div>

          {/* Away Team */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg ${
              !isHome ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-500/10' : 'hover:bg-muted/50'
            }`}
          >
            <span
              className={`font-semibold text-sm flex-1 ${
                !isHome ? 'text-blue-900 dark:text-blue-200' : 'text-foreground'
              }`}
            >
              {awayTeamName}
            </span>
            {isCompleted && match.resultado && (
              <span className="ml-2 text-lg font-bold text-foreground">
                {match.resultado.split('-')[1]}
              </span>
            )}
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{timeStr}</span>
          </div>

          {/* Stadium */}
          {match.estadio && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{match.estadio}</span>
            </div>
          )}

          {/* Competition */}
          {competitionName && (
            <div className="flex items-center gap-2">
              <span className="surface-pill rounded px-2 py-1 text-xs font-medium text-muted-foreground">
                {competitionName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border">
        {isLive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 p-2"
          >
            {/* Live Badge */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 text-center font-bold text-sm rounded-lg flex items-center justify-center gap-2"
            >
              🔴 JOGO AO VIVO
            </motion.div>

            {/* View Live Button */}
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleManageLiveMatch}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow rounded-lg"
            >
              👁️ Ver Ao Vivo
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {isScheduled && (
          <div className="space-y-2 p-2">
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleManageLiveMatch}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow rounded-lg"
            >
              🎮 Gerir Jogo ao Vivo
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewLineup}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow rounded-lg"
            >
              📋 Gerir Escalação
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {isCompleted && (
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewMatchDetails}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            📊 Ver Detalhes do Jogo
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
