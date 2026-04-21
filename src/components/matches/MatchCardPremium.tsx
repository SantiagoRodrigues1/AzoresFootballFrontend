import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronRight, BarChart2 } from 'lucide-react';
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

const PALETTE = [
  'bg-sky-600','bg-emerald-600','bg-violet-600','bg-rose-600','bg-amber-500',
  'bg-cyan-600','bg-indigo-600','bg-teal-600','bg-orange-500','bg-pink-600',
];

function teamColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return PALETTE[hash % PALETTE.length];
}

function initials(name: string): string {
  const words = name.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  if (words.length === 2) return (words[0][0] + words[1].slice(0, 2)).toUpperCase();
  return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
}

const STATUS_CONFIG = {
  live:      { label: 'Ao Vivo',   dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700 border-green-200' },
  halftime:  { label: 'Intervalo', dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  finished:  { label: 'Terminado', dot: 'bg-slate-400',  badge: 'bg-slate-50 text-slate-600 border-slate-200' },
  postponed: { label: 'Adiado',    dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  scheduled: { label: 'Agendado',  dot: 'bg-sky-400',    badge: 'bg-sky-50 text-sky-700 border-sky-200' },
} as const;

function formatMatchDate(dateStr: string | Date | undefined) {
  if (!dateStr) return { date: '', time: '' };
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return { date: '', time: '' };
    return {
      date: d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch {
    return { date: '', time: '' };
  }
}

export function MatchCardPremium({ match, token: _token }: MatchCardPremiumProps) {
  const navigate = useNavigate();
  const [hasLineup, setHasLineup] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [lineupData, setLineupData] = useState<Record<string, unknown> | null>(null);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [lineupCount, setLineupCount] = useState(0);

  const matchId = match._id || match.id || '';

  let homeTeamName = match.homeTeam?.name?.trim() || '';
  let awayTeamName = match.awayTeam?.name?.trim() || '';
  if (!homeTeamName && match.casa) homeTeamName = String(match.casa).trim();
  if (!awayTeamName && match.fora) awayTeamName = String(match.fora).trim();
  if (!homeTeamName) homeTeamName = 'Equipa Casa';
  if (!awayTeamName) awayTeamName = 'Equipa Fora';

  const matchDate = useMemo(() => formatMatchDate(match.date || match.data_hora), [match.date, match.data_hora]);

  const isCompleted = match.status === 'finished';
  const isLive      = match.status === 'live';
  const isHalftime  = match.status === 'halftime';
  const isPostponed = match.status === 'postponed';
  const showScore   = isCompleted || isLive || isHalftime;

  const scoreDisplay = useMemo(() => {
    if (showScore && match.resultado) return match.resultado.replace('-', '  ');
    return null;
  }, [showScore, match.resultado]);

  const statusCfg = STATUS_CONFIG[match.status ?? 'scheduled'] ?? STATUS_CONFIG.scheduled;

  useEffect(() => {
    if (!matchId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingLineup(true);
        const response = await fetch(`${API_URL}/lineups/match/${matchId}/all`);
        if (response.ok && !cancelled) {
          const data = await response.json();
          const lineups = data.data?.lineups || data.lineups || [];
          setLineupCount(lineups.length);
          setHasLineup(lineups.length > 0);
          setLineupData(data.data || data);
        }
      } catch {
        if (!cancelled) setHasLineup(false);
      } finally {
        if (!cancelled) setLoadingLineup(false);
      }
    })();
    return () => { cancelled = true; };
  }, [matchId]);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={[
          'relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md',
          (isLive || isHalftime) ? 'border-green-500/40' : 'border-border',
        ].join(' ')}
      >
        {(isLive || isHalftime) && (
          <div className="h-[3px] w-full bg-green-500 animate-pulse" />
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar size={12} />
              <span className="text-xs">{matchDate.date}</span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${statusCfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${isLive ? 'animate-pulse' : ''}`} />
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 min-w-0">
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-black tracking-tight ${teamColor(homeTeamName)}`}>
                {initials(homeTeamName)}
              </div>
              <span className="text-sm font-semibold text-foreground leading-tight truncate">{homeTeamName}</span>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-0.5 px-1 min-w-[68px]">
              {scoreDisplay ? (
                <span className="text-xl font-black text-foreground tabular-nums tracking-tight">{scoreDisplay}</span>
              ) : (
                <>
                  <span className="text-base font-bold text-foreground tabular-nums">{matchDate.time}</span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">vs</span>
                </>
              )}
            </div>

            <div className="flex flex-1 items-center justify-end gap-2.5 min-w-0">
              <span className="text-sm font-semibold text-foreground leading-tight truncate text-right">{awayTeamName}</span>
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-black tracking-tight ${teamColor(awayTeamName)}`}>
                {initials(awayTeamName)}
              </div>
            </div>
          </div>

          {match.estadio && (
            <div className="mt-3 flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={11} />
              <span className="text-[11px] truncate">{match.estadio}</span>
            </div>
          )}
        </div>

        {(hasLineup || isCompleted || isPostponed) && (
          <div className="border-t border-border px-4 py-2.5 flex items-center gap-2">
            {isPostponed && (
              <span className="text-xs text-orange-600 font-medium">Jogo adiado</span>
            )}
            {!isPostponed && loadingLineup && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Users size={13} />
                </motion.div>
                <span className="text-xs">A verificar escalação</span>
              </div>
            )}
            {!isPostponed && !loadingLineup && hasLineup && (
              <button
                onClick={() => setShowLineupModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                <Users size={13} />
                Escalação ({lineupCount})
              </button>
            )}
            {isCompleted && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/match/${matchId}`); }}
                className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <BarChart2 size={13} />
                Detalhes
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        )}
      </motion.div>

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
