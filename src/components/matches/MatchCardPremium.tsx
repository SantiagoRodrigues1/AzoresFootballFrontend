import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Eye, Users, Zap, Trophy } from 'lucide-react';
import { LineupViewerFlashscore } from '../lineup/LineupViewerFlashscore';

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

interface MatchCardPremiumProps {
  match: Match;
  token?: string;
}

const TEAM_COLORS: Record<string, { primary: string; secondary: string; emoji: string }> = {
  'santa cruz': { primary: 'from-red-600 to-red-700', secondary: 'bg-red-100 text-red-700', emoji: '🔴' },
  'vitória': { primary: 'from-blue-600 to-blue-700', secondary: 'bg-blue-100 text-blue-700', emoji: '💙' },
  'madalena': { primary: 'from-slate-800 to-slate-900', secondary: 'bg-slate-100 text-slate-800', emoji: '⚫' },
  'praia': { primary: 'from-yellow-500 to-yellow-600', secondary: 'bg-yellow-100 text-yellow-700', emoji: '🟡' },
  'graciosa': { primary: 'from-purple-600 to-purple-700', secondary: 'bg-purple-100 text-purple-700', emoji: '💜' },
  'pico': { primary: 'from-gray-300 to-gray-400', secondary: 'bg-gray-100 text-gray-700', emoji: '⚪' },
  'faial': { primary: 'from-green-600 to-green-700', secondary: 'bg-green-100 text-green-700', emoji: '🟢' },
  'terceira': { primary: 'from-orange-600 to-orange-700', secondary: 'bg-orange-100 text-orange-700', emoji: '🟠' },
  'são jorge': { primary: 'from-cyan-600 to-cyan-700', secondary: 'bg-cyan-100 text-cyan-700', emoji: '🔵' },
};

const getTeamStyle = (teamName: string) => {
  for (const [key, style] of Object.entries(TEAM_COLORS)) {
    if (teamName.toLowerCase().includes(key)) return style;
  }
  return { primary: 'from-indigo-600 to-indigo-700', secondary: 'bg-indigo-100 text-indigo-700', emoji: '⚽' };
};

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return { date: 'Data inválida', time: '--:--' };

  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    if (isNaN(date.getTime())) {
      return { date: 'Data inválida', time: '--:--' };
    }

    return {
      date: date.toLocaleDateString('pt-PT', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch {
    return { date: 'Data inválida', time: '--:--' };
  }
};

export function MatchCardPremium({ match, token }: MatchCardPremiumProps) {
  const navigate = useNavigate();
  const [hasLineup, setHasLineup] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [lineupData, setLineupData] = useState<any>(null);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [lineupCount, setLineupCount] = useState(0);

  const matchId = match._id || match.id || '';
  
  // Extract team names from multiple sources - in priority order:
  // 1. homeTeam/awayTeam objects (modern populated structure)
  // 2. house/away fields (new backend fields)
  // 3. casa/fora fields (legacy string fields)
  // 4. Falls back to generic names
  
  let homeTeamName = 'Equipa Casa';
  let awayTeamName = 'Equipa Fora';
  
  // Priority 1: homeTeam/awayTeam objects
  if (match.homeTeam?.name) {
    homeTeamName = String(match.homeTeam.name).trim();
  }
  
  if (match.awayTeam?.name) {
    awayTeamName = String(match.awayTeam.name).trim();
  }
  
  // Priority 2: house/away fields (new from improved backend)
  if (homeTeamName === 'Equipa Casa' && (match as any).house) {
    const houseName = String((match as any).house).trim();
    if (houseName && houseName !== 'Equipa Casa') {
      homeTeamName = houseName;
    }
  }
  
  if (awayTeamName === 'Equipa Fora' && (match as any).away) {
    const awayNameValue = String((match as any).away).trim();
    if (awayNameValue && awayNameValue !== 'Equipa Fora') {
      awayTeamName = awayNameValue;
    }
  }
  
  // Priority 3: casa/fora fields (legacy)
  if (homeTeamName === 'Equipa Casa' && match.casa) {
    const casaStr = String(match.casa).trim();
    if (casaStr && casaStr !== '' && casaStr !== 'null' && casaStr !== 'undefined') {
      homeTeamName = casaStr;
    }
  }
  
  if (awayTeamName === 'Equipa Fora' && match.fora) {
    const foraStr = String(match.fora).trim();
    if (foraStr && foraStr !== '' && foraStr !== 'null' && foraStr !== 'undefined') {
      awayTeamName = foraStr;
    }
  }

  const homeStyle = useMemo(() => getTeamStyle(homeTeamName), [homeTeamName]);
  const awayStyle = useMemo(() => getTeamStyle(awayTeamName), [awayTeamName]);

  const matchDate = useMemo(() => {
    const formattedDate = formatDate(match.date || match.data_hora);
    return formattedDate;
  }, [match]);

  const isCompleted = match.status === 'finished';
  const isLive = match.status === 'live';
  const isHalftime = match.status === 'halftime';
  const isPostponed = match.status === 'postponed';

  // Parse score
  const scores = useMemo(() => {
    if (isCompleted && match.resultado) {
      const parts = match.resultado.split('-').map(s => s.trim());
      return { home: parts[0] || '0', away: parts[1] || '0' };
    }
    return { home: '-', away: '-' };
  }, [isCompleted, match.resultado]);

  // Check lineups
  useEffect(() => {
    const checkLineupAvailability = async () => {
      if (!matchId) return;

      try {
        setLoadingLineup(true);
        const response = await fetch(`${API_URL}/lineups/match/${matchId}/all`);

        if (response.ok) {
          const data = await response.json();
          const lineups = data.data?.lineups || data.lineups || [];
          setLineupCount(lineups.length);
          setHasLineup(lineups.length > 0);
          setLineupData(data.data || data);
        }
      } catch (err) {
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
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
        className="relative overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 transition-all"
      >
        {/* Status Bar - Top */}
        <AnimatePresence>
          {(isLive || isHalftime) && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-2 text-xs font-bold overflow-hidden"
            >
              <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
                🔴 {isHalftime ? 'INTERVALO' : 'AO VIVO'} - {match.status}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Competition */}
        <div className="px-4 pt-3 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {match.competicao && (
                <>
                  <Trophy size={14} className="text-amber-600" />
                  <span className="text-xs font-bold text-gray-700">{match.competicao}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
              <Calendar size={14} />
              <span>{matchDate.date}</span>
            </div>
          </div>
        </div>

        {/* Main Match Content */}
        <div className="px-4 py-5">
          {/* Teams and Score */}
          <div className="mb-5">
            {/* Home Team */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="text-4xl">{homeStyle.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase">Casa</p>
                <p className="text-base font-bold text-gray-900 break-words whitespace-normal">{homeTeamName || 'Equipa Casa'}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`bg-gradient-to-br ${homeStyle.primary} text-white w-14 h-14 rounded-lg flex items-center justify-center shadow-lg`}
              >
                <span className="text-2xl font-black">{scores.home}</span>
              </motion.div>
            </motion.div>

            {/* Center Divider with Time */}
            <div className="flex items-center justify-center gap-3 my-3">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="text-center px-3">
                <p className="text-xs text-gray-500 font-semibold">vs</p>
                <p className="text-sm font-bold text-gray-700">{matchDate.time}</p>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Away Team */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-4xl">{awayStyle.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase">Fora</p>
                <p className="text-base font-bold text-gray-900 break-words whitespace-normal">{awayTeamName || 'Equipa Fora'}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className={`bg-gradient-to-br ${awayStyle.primary} text-white w-14 h-14 rounded-lg flex items-center justify-center shadow-lg`}
              >
                <span className="text-2xl font-black">{scores.away}</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Stadium Info */}
          {match.estadio && (
            <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">{match.estadio}</span>
            </div>
          )}

          {/* Lineup Section */}
          <div className="space-y-2">
            {loadingLineup ? (
              <motion.div
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="px-3 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 flex items-center justify-center gap-2"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                  <Users className="w-4 h-4 text-green-600" />
                </motion.div>
                <span className="text-xs font-bold text-green-700">Carregando escalação...</span>
              </motion.div>
            ) : hasLineup ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLineupModal(true)}
                className="w-full px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Eye size={16} />
                </motion.div>
                <span>👥 Ver Escalação ({lineupCount})</span>
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.button>
            ) : (
              <div className="px-3 py-2.5 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-600">Escalação em breve</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Status */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {isCompleted ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/match/${matchId}`);
              }}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Eye size={14} />
              <span>📊 Ver Detalhes do Jogo</span>
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                →
              </motion.span>
            </motion.button>
          ) : isPostponed ? (
            <p className="text-xs font-bold text-yellow-700 text-center">⏸ Jogo Adiado</p>
          ) : (
            <p className="text-xs font-bold text-blue-700 text-center">📅 Agendado para {matchDate.time}</p>
          )}
        </div>
      </motion.div>

      {/* Lineup Modal */}
      {showLineupModal && lineupData && (
        <LineupViewerFlashscore
          isOpen={showLineupModal}
          onOpenChange={setShowLineupModal}
          lineupData={lineupData}
          matchDate={new Date(match.date || match.data_hora || '')}
          homeTeam={homeTeamName}
          awayTeam={awayTeamName}
        />
      )}
    </>
  );
}
