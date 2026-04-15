import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { NewsCard } from '@/components/news/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomeDashboardQuery } from '@/hooks/queries/useAppQueries';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Target,
  Star,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Home as HomeIcon,
  Filter,
  Clock,
  Flame,
  Newspaper
} from 'lucide-react';
import { isClubManagerRole } from '@/utils/access';

const StandingsTable = lazy(() => import('@/components/standings/StandingsTable'));
const TrendingPanel = lazy(async () => {
  const module = await import('@/components/discovery/TrendingPanel');
  return { default: module.TrendingPanel };
});

// Tipos para melhor organização
interface Player {
  equipa: string;
  golos: number;
  jogador: string;
}

interface Match {
  casa: string;
  fora: string;
  data_hora: string;
  status: 'scheduled' | 'live' | 'finished';
  resultado?: string;
}

interface Championship {
  campeonato: string;
  temporada: string;
  classificacao: any[];
  proximos_jogos: { jogos: Match[] }[];
  melhores_marcadores: Player[];
  status?: string;
}

interface StandingRow {
  posicao: string;
  equipa: string;
  pontos: string;
  jogos: string;
  vitorias: string;
  empates: string;
  derrotas: string;
  golos: string;
  diferenca: string;
}

function toStandingRow(entry: Record<string, unknown>): StandingRow {
  return {
    posicao: String(entry.posicao || ''),
    equipa: String(entry.equipa || ''),
    pontos: String(entry.pontos || ''),
    jogos: String(entry.jogos || ''),
    vitorias: String(entry.vitorias || ''),
    empates: String(entry.empates || ''),
    derrotas: String(entry.derrotas || ''),
    golos: String(entry.golos || ''),
    diferenca: String(entry.diferenca || '')
  };
}

export function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [showAllScorers, setShowAllScorers] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState<string | null>(null);
  const dashboardQuery = useHomeDashboardQuery();

  const getRoleConfig = () => {
    const roles = {
      admin: { icon: '⚙️', label: 'Admin', color: 'bg-purple-500/20 text-purple-600' },
      referee: { icon: '🟨', label: 'Árbitro', color: 'bg-yellow-500/20 text-yellow-600' },
      club_manager: { icon: '🏟️', label: 'Clube', color: 'bg-blue-500/20 text-blue-600' },
      team_manager: { icon: '🏟️', label: 'Clube', color: 'bg-blue-500/20 text-blue-600' },
      default: { icon: '⚽', label: 'Adepto', color: 'bg-green-500/20 text-green-600' }
    };
    return roles[user?.role as keyof typeof roles] || roles.default;
  };

  const roleConfig = getRoleConfig();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const loading = dashboardQuery.isLoading;
  const refreshing = dashboardQuery.isFetching && !dashboardQuery.isLoading;
  const error = dashboardQuery.error instanceof Error ? dashboardQuery.error.message : null;
  const data = dashboardQuery.data?.championships || [];
  const liveMatches = dashboardQuery.data?.liveMatches || [];
  const upcomingMatches = dashboardQuery.data?.upcomingMatches || [];
  const topScorers = dashboardQuery.data?.topScorers || [];
  const scorersByChampionship = dashboardQuery.data?.scorersByChampionship || {};
  const trending = dashboardQuery.data?.trending || null;
  const newsFeed = dashboardQuery.data?.newsFeed || [];
  const mainChamp = dashboardQuery.data?.mainChamp || null;
  const visibleMatches = activeFilter === 'live'
    ? liveMatches
    : activeFilter === 'upcoming'
      ? upcomingMatches
      : liveMatches.length
        ? liveMatches
        : upcomingMatches;

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.10),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] pb-32">
      {/* Header Fixo - Premium Design */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-lg shadow-sm">
        <div className="safe-top px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo e Título */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center border-2 border-background">
                  <span className="text-[10px] font-bold">⚽</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">AzoresScore</h1>
                <p className="text-xs text-muted-foreground font-medium">Futebol Açoriano Profissional</p>
              </div>
            </motion.div>

            {/* Ações do Utilizador */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>
              
              <div className="hidden sm:flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${
                  user?.role === 'admin' ? 'from-purple-500 to-purple-600' :
                  user?.role === 'referee' ? 'from-yellow-500 to-yellow-600' :
                  isClubManagerRole(user?.role) ? 'from-blue-500 to-blue-600' :
                  'from-green-500 to-green-600'
                } text-white`}>
                  <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">{user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{roleConfig.label}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="group rounded-lg p-2 transition-colors hover:bg-destructive/10"
                title="Terminar sessão"
              >
                <LogOut className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-destructive" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="px-4 py-8 max-w-7xl mx-auto">
        {/* Saudação e Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,hsl(var(--foreground)),hsl(var(--foreground))/0.88,hsl(var(--primary))/0.92)] p-8 shadow-lg">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Bem-vindo, <span className="text-blue-400">{user?.name?.split(' ')[0] || 'Adepto'}</span>! 👋
                  </h2>
                  <p className="text-slate-300 mt-2 text-lg">
                    Acompanha o melhor do futebol açoriano
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dashboardQuery.refetch()}
                    disabled={refreshing}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all disabled:opacity-50 group"
                  >
                    <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  </motion.button>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white font-bold text-lg">{liveMatches.length}</p>
                        <p className="text-slate-300 text-xs">Ao Vivo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-bold text-lg">{upcomingMatches.length}</p>
                        <p className="text-slate-300 text-xs">Próximos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-muted-foreground">A carregar dados...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-6"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-destructive">Erro ao carregar dados</h3>
                  <p className="mt-1 text-sm text-destructive/90">{error}</p>
                </div>
                <button
                  onClick={() => dashboardQuery.refetch()}
                  className="ml-auto rounded-lg bg-destructive/15 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  Tentar novamente
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Principal */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Coluna Esquerda - Classificação */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              {/* Classificação Principal */}
              {mainChamp && (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="surface-card overflow-hidden rounded-2xl group"
                >
                  <div className="border-b border-border bg-muted/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                          <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">Classificação</h3>
                          <p className="text-sm font-medium text-muted-foreground">{mainChamp.temporada}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/stats')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group/btn"
                      >
                        Ver completo
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Suspense fallback={<Skeleton className="h-80 rounded-[24px]" />}>
                      <StandingsTable 
                        standings={mainChamp.classificacao?.slice(0, 8).map((entry) => toStandingRow(entry)) || []} 
                        titulo={mainChamp.temporada}
                      />
                    </Suspense>
                  </div>
                </motion.div>
              )}

              {/* Próximos Jogos */}
              {visibleMatches.length > 0 && (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="surface-card overflow-hidden rounded-2xl"
                >
                  <div className="border-b border-border bg-muted/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg">
                          <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">Próximos Jogos</h3>
                          <p className="text-sm font-medium text-muted-foreground">Agenda dos campeonatos</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/matches')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group/btn"
                      >
                        Ver calendário
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                      {[
                        { id: 'all', label: 'Em destaque' },
                        { id: 'live', label: 'Ao vivo' },
                        { id: 'upcoming', label: 'Próximos' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveFilter(item.id as typeof activeFilter)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                            activeFilter === item.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {visibleMatches.slice(0, 4).map((match, idx) => (
                        <motion.div
                          key={idx}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="surface-card rounded-xl p-5 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                  <Clock className="w-3.5 h-3.5" />
                                  {match.data_hora || 'A definir'}
                                </span>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Jornada {idx + 1}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-center flex-1">
                                  <p className="text-sm font-bold text-foreground">{match.casa}</p>
                                </div>
                                <div className="px-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">VS</span>
                                  </div>
                                </div>
                                <div className="text-center flex-1">
                                  <p className="text-sm font-bold text-foreground">{match.fora}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Coluna Direita - Stats e Destaques */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Melhores Marcadores */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="surface-card overflow-hidden rounded-2xl"
              >
                <div className="border-b border-border bg-muted/30 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Artilheiros</h3>
                        <p className="text-sm font-medium text-muted-foreground">Top marcadores</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAllScorers(!showAllScorers)}
                      className="flex items-center gap-2 rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 transition-all hover:bg-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:hover:bg-orange-500/20"
                    >
                      <Filter className="w-4 h-4" />
                      {showAllScorers ? 'Resumo' : 'Todos'}
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  {!showAllScorers ? (
                    <div className="space-y-3">
                      {topScorers.slice(0, 5).map((player, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              idx === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              idx === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                              idx === 2 ? 'bg-gradient-to-r from-orange-700 to-orange-800' :
                              'bg-slate-300'
                            }`}>
                              {idx + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{player.jogador || player.equipa}</p>
                            <p className="truncate text-xs text-muted-foreground">{player.equipa}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="px-3 py-1.5 bg-orange-100 rounded-full flex items-center gap-1">
                              <span className="font-bold text-orange-700 text-sm">{player.golos}</span>
                              <span className="text-[10px] text-orange-600">⚽</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
                        {Object.keys(scorersByChampionship).map((champ) => (
                          <motion.button
                            key={champ}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedChampionship(selectedChampionship === champ ? null : champ)}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                              selectedChampionship === champ
                                ? 'bg-orange-600 text-white'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {champ}
                          </motion.button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {selectedChampionship ? (
                          <motion.div
                            key={selectedChampionship}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                          >
                            <h4 className="mb-4 text-sm font-bold text-foreground">
                              {selectedChampionship.toUpperCase().replace(/_/g, ' ')}
                            </h4>
                            {scorersByChampionship[selectedChampionship]?.length ? (
                              scorersByChampionship[selectedChampionship].map((player, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ x: 4 }}
                                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/40"
                                >
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 text-sm">
                                      {idx + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">{player.jogador || player.equipa}</p>
                                    <p className="truncate text-xs text-muted-foreground">{player.equipa}</p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <div className="px-3 py-1.5 bg-orange-100 rounded-full flex items-center gap-1">
                                      <span className="font-bold text-orange-700 text-sm">{player.golos}</span>
                                      <span className="text-[10px] text-orange-600">⚽</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <p className="py-4 text-center text-sm text-muted-foreground">Sem dados disponíveis</p>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-6 text-center text-muted-foreground"
                          >
                            <p className="text-sm">Clica num campeonato para ver os artilheiros</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Destaques */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Destaques</h3>
                      <p className="text-sm text-blue-100 font-medium">Momentos especiais</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 cursor-pointer border border-white/20 transition-all"
                      onClick={() => navigate('/highlights')}
                    >
                      <div className="flex items-start gap-3">
                        <Newspaper className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm">Melhor golo da jornada</h4>
                          <p className="text-xs text-blue-100 mt-1">Vote no melhor momento</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                      </div>
                    </motion.div>

                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-yellow-300" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">Jogador do Mês</h4>
                          <p className="text-xs text-blue-100">Votação em aberto</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {trending ? (
                <Suspense fallback={<Skeleton className="h-72 rounded-[28px]" />}>
                  <TrendingPanel trending={trending} />
                </Suspense>
              ) : null}

              {newsFeed.length > 0 ? (
                <motion.div whileHover={{ y: -2 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Notícias recentes</h3>
                      <p className="text-sm font-medium text-muted-foreground">Atualizações rápidas para mobile</p>
                    </div>
                    <button onClick={() => navigate('/news')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver todas</button>
                  </div>
                  {newsFeed.map((item) => (
                    <NewsCard key={item._id} item={item} />
                  ))}
                </motion.div>
              ) : null}

              {/* Stats Rápidas */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="surface-card rounded-2xl p-6"
              >
                <h4 className="mb-5 flex items-center gap-2 font-bold text-foreground">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Estatísticas
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="mt-1 text-xs text-muted-foreground">Equipas</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                  >
                    <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="mt-1 text-xs text-muted-foreground">Jogos</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 shadow-2xl backdrop-blur-lg safe-bottom">
        <div className="flex items-center justify-around px-4 py-3 max-w-7xl mx-auto">
          {[
            { icon: HomeIcon, label: 'Início', active: true, action: () => {} },
            { icon: Trophy, label: 'Classificação', action: () => navigate('/standings') },
            { icon: Calendar, label: 'Jogos', action: () => navigate('/matches') },
            { icon: Target, label: 'Estatísticas', action: () => navigate('/stats') },
            { icon: Star, label: 'Destaques', action: () => navigate('/highlights') },
          ].map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.action}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                item.active 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200' 
                  : 'text-muted-foreground hover:bg-muted hover:text-blue-600 dark:hover:text-blue-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
}
