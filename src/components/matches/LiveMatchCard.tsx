import { Match } from '@/types';
import { motion } from 'framer-motion';

interface LiveMatchCardProps {
  match: Match;
  onClick?: () => void;
}

export function LiveMatchCard({ match, onClick }: LiveMatchCardProps) {
  const isLive = match.status === 'live' || match.status === 'halftime';
  
  const getStatusText = () => {
    switch (match.status) {
      case 'live': return `${match.minute}'`;
      case 'halftime': return 'INT';
      case 'finished': return 'FT';
      case 'scheduled': return formatTime(match.date);
      case 'postponed': return 'ADIA';
      default: return '';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  const getRecentGoals = () => {
    return match.events
      .filter(e => e.type === 'goal' || e.type === 'own_goal' || e.type === 'penalty')
      .slice(-2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="match-card bg-card rounded-xl p-4 shadow-card cursor-pointer border border-border"
    >
      {/* Competição e Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">
          {match.competition}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
          <span className={`text-xs font-bold ${
            isLive ? 'text-destructive' : 
            match.status === 'finished' ? 'text-muted-foreground' : 
            'text-primary'
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Equipas e Resultado */}
      <div className="space-y-3">
        {/* Equipa Casa */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
              {match.homeTeam.logo}
            </div>
            <span className="font-semibold text-foreground">{match.homeTeam.name}</span>
          </div>
          <motion.span 
            key={match.homeScore}
            animate={isLive ? { scale: [1, 1.2, 1] } : {}}
            className={`text-xl font-bold ${isLive ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {match.status === 'scheduled' ? '-' : match.homeScore}
          </motion.span>
        </div>

        {/* Equipa Fora */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
              {match.awayTeam.logo}
            </div>
            <span className="font-semibold text-foreground">{match.awayTeam.name}</span>
          </div>
          <motion.span 
            key={match.awayScore}
            animate={isLive ? { scale: [1, 1.2, 1] } : {}}
            className={`text-xl font-bold ${isLive ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {match.status === 'scheduled' ? '-' : match.awayScore}
          </motion.span>
        </div>
      </div>

      {/* Eventos Recentes (apenas para jogos ao vivo) */}
      {isLive && getRecentGoals().length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          {getRecentGoals().map((event, index) => (
            <div key={event.id} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-warning">⚽</span>
              <span>{event.minute}'</span>
              <span className="font-medium text-foreground">{event.playerName}</span>
              {event.assistPlayerName && (
                <span className="text-muted-foreground">(ass. {event.assistPlayerName})</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Local (para jogos agendados) */}
      {match.status === 'scheduled' && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <span>📍</span>
          <span>{match.venue}, {match.island}</span>
        </div>
      )}
    </motion.div>
  );
}
