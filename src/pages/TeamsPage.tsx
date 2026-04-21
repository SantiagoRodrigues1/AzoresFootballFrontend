// src/pages/TeamsPage.tsx
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Search, Trophy, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateTeamModal } from '@/components/admin/CreateTeamModal';
import { API_URL } from '@/services/api';
import { IonButton } from '@ionic/react';

// Tipos baseados no teu scraping
interface Team {
  _id: string;
  clubId?: string | null;
  equipa?: string;
  name?: string;
  campeonato: string;      // ex.: "campeonato_terceira", "campeonato_graciosa"
  ilha?: string;           // derivado do campeonato
  logo?: string;
  colors?: { primary: string };
  founded?: number;
  players?: unknown[];
}

function formatCampeonatoLabel(campeonato?: string | null) {
  if (!campeonato || campeonato === 'azores_score') {
    return 'Campeonato Açores';
  }

  return campeonato
    .replace('campeonato_', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getTeamName(team?: Partial<Team> | null) {
  return (team?.name || team?.equipa || '').trim();
}

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampeonato, setSelectedCampeonato] = useState<string | null>(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const championshipOptions = useMemo(() => {
    const dynamicChampionships = Array.from(
      new Set(teams.map((team) => team.campeonato).filter(Boolean))
    )
      .sort((left, right) => left.localeCompare(right, 'pt', { sensitivity: 'base' }))
      .map((campeonato) => ({ id: campeonato, nome: formatCampeonatoLabel(campeonato) }));

    return [{ id: null, nome: 'Todas' }, ...dynamicChampionships];
  }, [teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/teams`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: Team[] = await response.json();

      const uniqueTeams = Array.from(
        new Map(
          data.flatMap((team) => {
            const campeonato = team.campeonato || 'azores_score';
            const equipa = getTeamName(team);

            if (!equipa) {
              return [];
            }

            return [[
              `${campeonato}::${equipa.toLowerCase()}`,
              {
                ...team,
                name: equipa,
                equipa,
                campeonato,
                ilha: team.ilha || formatCampeonatoLabel(campeonato),
                players: Array.isArray(team.players) ? team.players : []
              }
            ]];
          })
        ).values()
      ).sort((a, b) => getTeamName(a).localeCompare(getTeamName(b), 'pt', { sensitivity: 'base' }));

      setTeams(uniqueTeams);
    } catch {
      setError('Não foi possível carregar todas as equipas. Verifica o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Filtragem por campeonato e pesquisa
  const filteredTeams = teams.filter(team => {
    const matchesSearch = getTeamName(team).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChamp = !selectedCampeonato || team.campeonato === selectedCampeonato;
    return matchesSearch && matchesChamp;
  });

  const hasRenderableLogo = (logo?: string) => {
    if (!logo) {
      return false;
    }

    return !logo.includes('via.placeholder.com') && !logo.includes('placeholder.com');
  };

  return (
    <div className="app-shell min-h-screen">
      {/* Header Premium */}
      <header className="page-hero sticky top-0 z-50 safe-top rounded-b-3xl overflow-hidden">
        <div className="px-4 pt-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-white flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-white">Equipas</h1>
                <p className="text-sm text-white/70">Todos os clubes açorianos</p>
              </div>
            </div>
            {isAdmin && token && (
              <IonButton 
                fill="solid"
                className="text-primary-foreground"
                onClick={() => setShowCreateTeamModal(true)}
              >
                <Plus className="w-4 h-4" />
              </IonButton>
            )}
          </div>

          {/* Pesquisa */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar equipa..."
              className="w-full rounded-xl border border-white/20 bg-white/14 px-4 py-3 pl-11 text-white placeholder:text-white/65 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
          </div>

          {/* Filtro por Campeonato */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {championshipOptions.map((camp) => (
              <button
                key={camp.id || 'todas'}
                onClick={() => setSelectedCampeonato(camp.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCampeonato === camp.id
                    ? 'bg-white text-primary shadow-lg scale-105'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {camp.nome}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
         <main className="px-4 mt-0 pb-32 relative z-0">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="surface-card animate-pulse rounded-2xl p-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-muted" />
                <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-muted" />
                <div className="mx-auto h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">⚽</span>
            <h3 className="text-xl font-semibold text-foreground">Sem resultados</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Nenhuma equipa encontrada para "{searchQuery || 'este campeonato'}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredTeams.map((team, index) => {
              const teamName = getTeamName(team);
              const initials = teamName
                .split(' ')
                .slice(0, 2)
                .map((word) => word[0] || '')
                .join('')
                .toUpperCase();

              return (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/team/${team._id}`)}
                  className="surface-card cursor-pointer rounded-2xl p-6 transition-all group hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-md border-4 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${team.colors?.primary || '#3b82f6'}20`,
                        borderColor: `${team.colors?.primary || '#3b82f6'}40`
                      }}
                    >
                      {hasRenderableLogo(team.logo) ? (
                        <img src={team.logo} alt={teamName} className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <span className="text-primary">{initials}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-2">
                      {teamName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        {team.ilha || team.campeonato?.replace('campeonato_', '').toUpperCase().replace('_', ' ') || 'Desconhecida'}
                      </p>
                      {team.founded && (
                        <p className="text-xs text-muted-foreground">
                          Fundado em {team.founded}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Admin - Create Team Modal */}
      {isAdmin && token && (
        <CreateTeamModal
          open={showCreateTeamModal}
          onOpenChange={setShowCreateTeamModal}
          token={token}
          onSave={fetchTeams}
        />
      )}
    </div>
  );
}
