import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Users, Trophy, Zap } from 'lucide-react';
import { LineupViewerModal } from '../lineup/LineupViewerModal';

interface Match {
  _id?: string;
  id?: string;
  homeTeam?: { name: string; id: string };
  awayTeam?: { name: string; id: string };
  casa?: string;
  fora?: string;
  data_hora?: string;
  date?: string;
  status?: 'scheduled' | 'live' | 'finished' | 'halftime' | 'postponed';
  resultado?: string;
  competicao?: string;
  competition?: string;
  estadio?: string;
}

interface MatchCardWithLineupProps {
  match: Match;
  token?: string;
}

// Map team names to emojis for visual diversity
const getTeamEmoji = (teamName: string): string => {
  const emojiMap: Record<string, string> = {
    'santa cruz': '🔴',
    'vitória': '💙',
    'madalena': '⚫',
    'praia': '🟡',
    'graciosa': '💜',
    'pico': '⚪',
    'faial': '🟢',
    'terceira': '🟠',
    'são jorge': '🔵',
  };

  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (teamName.toLowerCase().includes(key)) return emoji;
  }
  return '⚽';
};

export function MatchCardWithLineup({ match, token }: MatchCardWithLineupProps) {
  const [hasLineup, setHasLineup] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [lineupData, setLineupData] = useState<any>(null);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [lineupCount, setLineupCount] = useState(0);

  const matchId = match._id || match.id || '';
  const matchDate = new Date(match.date || match.data_hora || '');

  // FIX: Use casa/fora first as they are the actual team names from API
  const homeTeamName = match.casa || match.homeTeam?.name || 'Casa';
  const awayTeamName = match.fora || match.awayTeam?.name || 'Fora';
  const isCompleted = match.status === 'finished';
  const isLive = match.status === 'live';

  // Format date/time
  const dateStr = matchDate.toLocaleDateString('pt-PT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = matchDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Parse resultado
  let homeScore = '-';
  let awayScore = '-';
  if (isCompleted && match.resultado) {
    const scores = match.resultado.split('-').map(s => s.trim());
    homeScore = scores[0] || '-';
    awayScore = scores[1] || '-';
  }

  // Get status styling
  const getStatusStyle = () => {
    switch (match.status) {
      case 'live':
        return {
          bg: 'from-red-500 to-red-600',
          text: 'text-white',
          label: '🔴 AO VIVO',
          pulse: true,
        };
      case 'finished':
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-white',
          label: '✓ TERMINADO',
          pulse: false,
        };
      case 'postponed':
        return {
          bg: 'from-yellow-500 to-yellow-600',
          text: 'text-white',
          label: '⏸ ADIADO',
          pulse: false,
        };
      default:
        return {
          bg: 'from-blue-500 to-blue-600',
          text: 'text-white',
          label: '📅 AGENDADO',
          pulse: false,
        };
    }
  };

  const statusStyle = getStatusStyle();

  // Check lineups
  useEffect(() => {
    const checkLineupAvailability = async () => {
      if (!matchId) return;

      try {
        setLoadingLineup(true);
        const API_URL_LOCAL = API_URL;
        
        const response = await fetch(`${API_URL_LOCAL}/lineups/match/${matchId}/all`);

        if (response.ok) {
          const data = await response.json();
          const lineups = data.data?.lineups || data.lineups || [];
          setLineupCount(lineups.length);
          setHasLineup(lineups.length > 0);
          setLineupData(data.data || data);
        } else {
          setHasLineup(false);
        }
      } catch {
        setHasLineup(false);
      } finally {
        setLoadingLineup(false);
      }
    };

    checkLineupAvailability();
  }, [matchId]);

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all bg-card border border-border"
      >
        {/* Status Badge - Top Left */}
        <motion.div
          animate={statusStyle.pulse ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute top-3 left-3 z-20 bg-gradient-to-r ${statusStyle.bg} ${statusStyle.text} px-3 py-1.5 rounded-full font-bold text-xs shadow-lg`}
        >
          {statusStyle.label}
        </motion.div>

        {/* Date Badge - Top Right */}
        <div className="absolute top-3 right-3 z-20 bg-card/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full font-semibold text-xs shadow-md border border-border">
          📅 {dateStr} • {timeStr}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Teams & Score Section */}
          <div className="mb-6">
            {/* Home Team */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-4xl">{getTeamEmoji(homeTeamName)}</span>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Casa</p>
                  <p className="text-lg font-bold text-foreground line-clamp-2">{homeTeamName}</p>
                </div>
              </div>

              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-16 h-16 flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl font-bold">{homeScore}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Center Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="px-3 text-muted-foreground font-bold">VS</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Away Team */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-4xl">{getTeamEmoji(awayTeamName)}</span>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Fora</p>
                  <p className="text-lg font-bold text-foreground line-clamp-2">{awayTeamName}</p>
                </div>
              </div>

              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl w-16 h-16 flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl font-bold">{awayScore}</span>
                </motion.div>
              )}
            </motion.div>

            {!isCompleted && (
              <div className="mt-4 text-center">
                <p className="text-3xl font-bold text-foreground">- : -</p>
                <p className="text-xs text-muted-foreground mt-1">Jogo não iniciado</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-4" />

          {/* Lineup Section */}
          <div className="space-y-3">
            {loadingLineup ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg"
              >
                <Users className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Carregando escalação...</span>
              </motion.div>
            ) : hasLineup ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLineupModal(true)}
                className="w-full group relative overflow-hidden px-4 py-3.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Eye className="w-5 h-5" />
                </motion.div>
                <span>👥 Ver Escalação ({lineupCount})</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.button>
            ) : (
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-border">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Escalação em breve</span>
              </div>
            )}

            {/* Extra Info */}
            <div className="flex gap-2 text-xs font-semibold">
              {match.competicao && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  <Trophy className="w-4 h-4" />
                  {match.competicao}
                </div>
              )}
              {match.estadio && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
                  🏟️ {match.estadio}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lineup Modal */}
      {showLineupModal && lineupData && (
        <LineupViewerModal
          isOpen={showLineupModal}
          onOpenChange={setShowLineupModal}
          lineupData={lineupData}
          matchDate={matchDate}
          homeTeam={homeTeamName}
          awayTeam={awayTeamName}
        />
      )}
    </>
  );
}
