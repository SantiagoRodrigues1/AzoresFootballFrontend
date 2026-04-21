import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  type ChampionshipStanding,
  getMatchesByCompetition,
  getNews,
  getStandings,
  getTrending
} from '@/services/featureService';
import type { NewsItem } from '@/types/features';

export interface HomeMatch {
  /** MongoDB ObjectId of the match – required for lineup checks and navigation */
  _id?: string;
  id?: string;
  casa: string;
  fora: string;
  /** Populated team objects when available from the matches-by-competition route */
  homeTeam?: { id: string; name: string; logo?: string | null };
  awayTeam?: { id: string; name: string; logo?: string | null };
  data_hora: string;
  status: 'scheduled' | 'live' | 'finished' | 'halftime' | 'postponed';
  /** Scoreline string (e.g. "2-1"). Only present for in-progress or finished matches. */
  resultado?: string | null;
  /** Competition/championship display name */
  competicao?: string;
  /** Stadium name */
  estadio?: string | null;
}

export interface HomeScorer {
  equipa: string;
  golos: number;
  jogador: string;
}

export interface MatchByCompetition {
  competition: string;
  matches: HomeMatch[];
}

export interface HomeDashboardData {
  championships: ChampionshipStanding[];
  liveMatches: HomeMatch[];
  upcomingMatches: HomeMatch[];
  topScorers: HomeScorer[];
  scorersByChampionship: Record<string, HomeScorer[]>;
  trending: Awaited<ReturnType<typeof getTrending>> | null;
  newsFeed: NewsItem[];
  mainChamp: ChampionshipStanding | null;
}

function toSafeInteger(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const match = value.match(/-?\d+/);
    if (match) {
      const parsed = Number.parseInt(match[0], 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

const VALID_STATUSES = new Set(['scheduled', 'live', 'finished', 'halftime', 'postponed']);

function toHomeMatch(match: Record<string, unknown>): HomeMatch {
  const rawStatus = typeof match.status === 'string' ? match.status : 'scheduled';
  const status = VALID_STATUSES.has(rawStatus)
    ? (rawStatus as HomeMatch['status'])
    : 'scheduled';

  // Resolve home/away team objects when provided by the enriched backend route
  const homeTeamRaw = match.homeTeam as Record<string, unknown> | null | undefined;
  const awayTeamRaw = match.awayTeam as Record<string, unknown> | null | undefined;

  return {
    _id: typeof match._id === 'string' ? match._id : undefined,
    id: typeof match.id === 'string' ? match.id : undefined,
    casa: String(match.casa || (homeTeamRaw?.name) || 'Equipa Casa'),
    fora: String(match.fora || (awayTeamRaw?.name) || 'Equipa Fora'),
    homeTeam: homeTeamRaw
      ? { id: String(homeTeamRaw.id || ''), name: String(homeTeamRaw.name || ''), logo: homeTeamRaw.logo as string | null }
      : undefined,
    awayTeam: awayTeamRaw
      ? { id: String(awayTeamRaw.id || ''), name: String(awayTeamRaw.name || ''), logo: awayTeamRaw.logo as string | null }
      : undefined,
    data_hora: String(match.data_hora || ''),
    status,
    // Preserve scoreline only when the backend sends it (i.e. match has started)
    resultado: typeof match.resultado === 'string' ? match.resultado : null,
    competicao: typeof match.competicao === 'string' ? match.competicao : undefined,
    estadio: typeof match.estadio === 'string' ? match.estadio : null
  };
}

function toHomeScorer(player: Record<string, unknown>): HomeScorer {
  return {
    equipa: String(player.equipa || 'Equipa'),
    golos: toSafeInteger(player.golos, 0),
    jogador: String(player.jogador || player.equipa || 'Jogador')
  };
}

export function buildHomeDashboard(
  championships: ChampionshipStanding[],
  trending: Awaited<ReturnType<typeof getTrending>> | null,
  newsFeed: NewsItem[]
): HomeDashboardData {
  const allMatches: HomeMatch[] = [];
  const allTopScorers: HomeScorer[] = [];
  const scorersByChampionship: Record<string, HomeScorer[]> = {};

  championships.forEach((championship) => {
    championship.proximos_jogos?.forEach((entry) => {
      entry.jogos.forEach((match) => {
        allMatches.push(toHomeMatch(match));
      });
    });

    if (championship.melhores_marcadores?.length) {
      const scorers = championship.melhores_marcadores
        .map((player) => toHomeScorer(player))
        .sort((left, right) => right.golos - left.golos);

      scorersByChampionship[championship.campeonato] = scorers;
      allTopScorers.push(...scorers.slice(0, 3));
    }
  });

  const liveMatches = allMatches.filter((match) => match.status === 'live');
  const upcomingMatches = allMatches.filter((match) => match.status !== 'finished').slice(0, 5);
  const topScorers = allTopScorers.sort((left, right) => right.golos - left.golos).slice(0, 5);
  const mainChamp = championships.find((championship) => championship.campeonato === 'azores_score') || championships[0] || null;

  return {
    championships,
    liveMatches,
    upcomingMatches,
    topScorers,
    scorersByChampionship,
    trending,
    newsFeed: newsFeed.slice(0, 3),
    mainChamp
  };
}

export function useHomeDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.home.dashboard,
    queryFn: async () => {
      const [championships, trendingResult, newsResult] = await Promise.all([
        getStandings(),
        getTrending().catch(() => null),
        getNews(1).catch(() => null)
      ]);

      return buildHomeDashboard(championships, trendingResult, newsResult?.data || []);
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData
  });
}

export function useMatchesByCompetitionQuery() {
  return useQuery({
    queryKey: queryKeys.matches.byCompetition,
    queryFn: async (): Promise<MatchByCompetition[]> => {
      const championships = await getMatchesByCompetition();

      return championships
        .filter((championship) => championship.proximos_jogos && championship.proximos_jogos.length > 0)
        .map((championship) => {
          const matches = championship.proximos_jogos
            ?.flatMap((entry) => entry.jogos)
            .map((match) => toHomeMatch(match))
            .sort((left, right) => new Date(left.data_hora).getTime() - new Date(right.data_hora).getTime()) || [];

          return {
            competition: championship.campeonato,
            matches
          };
        });
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData
  });
}