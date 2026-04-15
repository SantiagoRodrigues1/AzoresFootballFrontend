import { Match } from '@/types';
import { motion } from 'framer-motion';

interface MatchCardCompactProps {
  match: Match;
  onClick?: () => void;
}

export function MatchCardCompact({ match, onClick }: MatchCardCompactProps) {
  const isLive = match.status === 'live' || match.status === 'halftime';
  const isFinished = match.status === 'finished';
  
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

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-lg p-3 shadow-card cursor-pointer border border-border flex items-center gap-3"
    >
      {/* Status */}
      <div className="w-12 text-center flex-shrink-0">
        {isLive && (
          <span className="relative flex h-2 w-2 mx-auto mb-1">
            <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
        )}
        <span className={`text-xs font-bold ${
          isLive ? 'text-destructive' : 
          isFinished ? 'text-muted-foreground' : 
          'text-primary'
        }`}>
          {getStatusText()}
        </span>
      </div>

      {/* Teams */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{match.homeTeam.logo}</span>
            <span className="text-sm font-medium text-foreground">{match.homeTeam.shortName}</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {match.status === 'scheduled' ? '-' : match.homeScore}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{match.awayTeam.logo}</span>
            <span className="text-sm font-medium text-foreground">{match.awayTeam.shortName}</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {match.status === 'scheduled' ? '-' : match.awayScore}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
