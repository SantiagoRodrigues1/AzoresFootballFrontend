import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  Edit2,
  Plus,
  Trash2,
  Award,
  MapPin,
  Calendar,
  Shield,
  Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';
import { getFavoriteTeams, toggleFavoriteTeam } from '@/services/featureService';
import { TeamModal } from '@/components/admin/TeamModal';
import { PlayerModal } from '@/components/admin/PlayerModal';
import { StartingXIModal } from '@/components/admin/StartingXIModal';
import { TeamMatchesSection } from '@/components/admin/TeamMatchesSection';
import { TeamMembersModal } from '@/components/admin/TeamMembersModal';
import { IonButton, IonAlert } from '@ionic/react';
import { isClubManagerRole } from '@/utils/access';

interface Player {
  id: string;
  nome: string;
  numero: string;
  url?: string;
  position?: string;
  email?: string;
  status?: 'available' | 'injured' | 'suspended' | 'called_up';
}

type RawPlayer = Player & {
  posicao?: string;
  id_jogador?: string;
  name?: string;
  numero_camisola?: string;
};

interface Team {
  _id: string;
  clubId?: string | null;
  equipa: string;
  name?: string;
  campeonato?: string;
  logo?: string;
  colors?: { primary: string };
  stadium?: string;
  founded?: number;
  rival?: string;
  description?: string;
  players?: Player[];
}

interface PlayersByPosition {
  [position: string]: Player[];
}

interface Match {
  casa: string;
  fora: string;
  data_hora: string;
  status?: 'scheduled' | 'live' | 'finished';
  resultado?: string;
  estadio?: string;
}

// Cores por posição para melhor visual
const positionColors: { [key: string]: string } = {
  'Guarda-redes': 'from-green-50 to-green-100 border-green-200 text-green-700 dark:from-green-950/70 dark:to-green-900/40 dark:border-green-800 dark:text-green-200',
  'Defesa Central': 'from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-950/70 dark:to-blue-900/40 dark:border-blue-800 dark:text-blue-200',
  'Lateral Esquerdo': 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 dark:from-indigo-950/70 dark:to-indigo-900/40 dark:border-indigo-800 dark:text-indigo-200',
  'Lateral Direito': 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 dark:from-indigo-950/70 dark:to-indigo-900/40 dark:border-indigo-800 dark:text-indigo-200',
  'Médio Defensivo': 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 dark:from-yellow-950/70 dark:to-yellow-900/40 dark:border-yellow-800 dark:text-yellow-200',
  'Médio': 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 dark:from-yellow-950/70 dark:to-yellow-900/40 dark:border-yellow-800 dark:text-yellow-200',
  'Médio Ofensivo': 'from-orange-50 to-orange-100 border-orange-200 text-orange-700 dark:from-orange-950/70 dark:to-orange-900/40 dark:border-orange-800 dark:text-orange-200',
  'Extremo Esquerdo': 'from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-950/70 dark:to-purple-900/40 dark:border-purple-800 dark:text-purple-200',
  'Extremo Direito': 'from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-950/70 dark:to-purple-900/40 dark:border-purple-800 dark:text-purple-200',
  'Avançado': 'from-red-50 to-red-100 border-red-200 text-red-700 dark:from-red-950/70 dark:to-red-900/40 dark:border-red-800 dark:text-red-200',
  'Outro': 'from-slate-50 to-slate-100 border-slate-200 text-slate-700 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-200',
};

// Função para garantir que os jogadores estão agrupados corretamente por posição
function groupPlayersByPosition(playersData: PlayersByPosition | RawPlayer[] | null | undefined): PlayersByPosition {
  // Se já está agrupado, retorna como está
  if (Array.isArray(Object.values(playersData)?.[0])) {
    return playersData as PlayersByPosition;
  }

  // Se é um array flat, reagrupa
  if (Array.isArray(playersData)) {
    const grouped: PlayersByPosition = {};
    playersData.forEach((player) => {
      const position = player.position || player.posicao || 'Outro';
      if (!grouped[position]) {
        grouped[position] = [];
      }
      grouped[position].push({
        id: player.id || player.id_jogador || Math.random().toString(),
        nome: player.nome || player.name || '',
        numero: player.numero || player.numero_camisola || '',
        position: position,
        url: player.url || '',
        email: player.email || '',
        status: player.status || 'available',
      });
    });
    return grouped;
  }

  return playersData || {};
}

// Função para determinar permissões do usuário
function getUserPermissions(
  userRole: string | undefined,
  teamId: string | undefined,
  assignedTeam: string | undefined
): {
  canEditTeam: boolean;
  canManagePlayers: boolean;
  canSelectPlayers: boolean;
  canManageMatches: boolean;
  canAssignReferees: boolean;
  isFullAdmin: boolean;
} {
  const isAdmin = userRole === 'admin';
  const isTeamPresident = userRole === 'team_president' && assignedTeam === teamId;
  const isTeamManager = isClubManagerRole(userRole) && assignedTeam === teamId;

  return {
    canEditTeam: isAdmin || isTeamPresident,
    canManagePlayers: isAdmin || isTeamPresident,
    canSelectPlayers: isAdmin || isTeamManager || isTeamPresident,
    canManageMatches: isAdmin || isTeamPresident,
    canAssignReferees: isAdmin,
    isFullAdmin: isAdmin,
  };
}

function getTeamDisplayName(team?: Partial<Team> | null) {
  return (team?.name || team?.equipa || '').trim();
}

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Estado das modais
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [showStartingXIModal, setShowStartingXIModal] = useState(false);
  const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);
  const [showDeletePlayerAlert, setShowDeletePlayerAlert] = useState(false);
  const [showDeleteTeamAlert, setShowDeleteTeamAlert] = useState(false);

  // Dados da página
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<PlayersByPosition | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Estado de edição
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

  // Permissões
  const permissions = getUserPermissions(user?.role, teamId, user?.assignedTeam);
  const persistedTeamId = team?.clubId || (team?._id && /^[a-f\d]{24}$/i.test(team._id) ? team._id : null);
  const canManagePersistedTeam = Boolean(persistedTeamId);
  const favoriteTeamId = team?.clubId || (teamId && /^[a-fA-F0-9]{24}$/.test(teamId) ? teamId : null);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!teamId) {
          setError('ID da equipa não fornecido');
          setLoading(false);
          return;
        }

        // use centralized API_URL
        const API_URL_LOCAL = API_URL;

        // Busca a equipa
        const teamsResponse = await fetch(`${API_URL_LOCAL}/teams`);
        if (!teamsResponse.ok) throw new Error('Erro ao carregar equipas');

        const teams: Team[] = await teamsResponse.json();
        const selectedTeam = teams.find((t) => t._id === teamId || t.clubId === teamId);

        if (!selectedTeam) throw new Error('Equipa não encontrada');

        const normalizedTeam = {
          ...selectedTeam,
          campeonato: selectedTeam.campeonato || 'azores_score',
          name: getTeamDisplayName(selectedTeam),
          equipa: getTeamDisplayName(selectedTeam),
          players: Array.isArray(selectedTeam.players) ? selectedTeam.players : []
        };

        setTeam(normalizedTeam);

        // Busca jogadores com campeonato e nome da equipa
        const playersResponse = await fetch(
          `${API_URL_LOCAL}/teams/${encodeURIComponent(normalizedTeam.campeonato || 'azores_score')}/${encodeURIComponent(
            getTeamDisplayName(normalizedTeam)
          )}/players`
        );

        if (!playersResponse.ok) {
          if (playersResponse.status === 404) {
            setPlayers({});
          } else {
            throw new Error(`Erro ${playersResponse.status}`);
          }
        } else {
          const playersData = await playersResponse.json();
          const groupedPlayers = groupPlayersByPosition(playersData || []);
          setPlayers(groupedPlayers);
        }

        // Busca jogos
        try {
          const standingsResponse = await fetch(`${API_URL}/standings`);
          if (standingsResponse.ok) {
            const standings = await standingsResponse.json() as Array<{
              proximos_jogos?: Array<{ jogos?: Match[] }>;
            }>;
            const allMatches: Match[] = [];
            standings.forEach((champ) => {
              if (champ.proximos_jogos && Array.isArray(champ.proximos_jogos)) {
                champ.proximos_jogos.forEach((day) => {
                  if (day.jogos && Array.isArray(day.jogos)) {
                    allMatches.push(...day.jogos);
                  }
                });
              }
            });
            setMatches(allMatches);
          }
        } catch {
          setMatches([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetail();
  }, [teamId]);

  useEffect(() => {
    const loadFavoriteState = async () => {
      if (!token || !favoriteTeamId) {
        setIsFavorite(false);
        return;
      }

      try {
        const favorites = await getFavoriteTeams();
        setIsFavorite(favorites.some((favorite) => favorite.team._id === favoriteTeamId));
      } catch {
        setIsFavorite(false);
      }
    };

    loadFavoriteState();
  }, [favoriteTeamId, token]);

  const handleToggleFavorite = async () => {
    if (!favoriteTeamId) {
      return;
    }

    try {
      setFavoriteLoading(true);
      const result = await toggleFavoriteTeam(favoriteTeamId);
      setIsFavorite(result.isFavorite);
    } catch {
      setError('Não foi possível atualizar o estado de favorito.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handler para apagar jogador
  const handleDeletePlayer = async () => {
    if (!playerToDelete || !team || !token || !persistedTeamId || !/^[a-f\d]{24}$/i.test(playerToDelete)) return;

    try {
      const API_URL_LOCAL = API_URL;
      const url = `${API_URL_LOCAL}/teams/${encodeURIComponent(teamCampeonato)}/${encodeURIComponent(
        teamDisplayName
      )}/players/${encodeURIComponent(playerToDelete)}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao apagar jogador');

      // Recarregar jogadores
      const playersResponse = await fetch(
        `${API_URL_LOCAL}/teams/${encodeURIComponent(teamCampeonato)}/${encodeURIComponent(
          teamDisplayName
        )}/players`
      );

      if (playersResponse.ok) {
        const data = await playersResponse.json();
        const groupedPlayers = groupPlayersByPosition(data || []);
        setPlayers(groupedPlayers);
      }

      setShowDeletePlayerAlert(false);
      setPlayerToDelete(null);
    } catch (err) {
      setError('Erro ao apagar jogador');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">A carregar detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-40 shadow-lg">
          <div className="px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Equipa</h1>
          </div>
        </header>
        <div className="text-center py-12 text-destructive px-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">{error || 'Equipa não encontrada'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const allPlayers = players ? Object.values(players).flat() : [];
  const teamDisplayName = getTeamDisplayName(team);
  const teamCampeonato = team.campeonato || 'azores_score';

  return (
    <div className="app-shell min-h-screen">
      {/* Header Premium */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{teamDisplayName}</h1>
              <p className="text-xs text-white/70">Plantel 2025/2026</p>
            </div>
          </div>
          {permissions.canEditTeam && canManagePersistedTeam && (
            <div className="flex items-center gap-2">
              {permissions.isFullAdmin && (
                <IonButton
                  color="light"
                  fill="clear"
                  onClick={() => setShowTeamMembersModal(true)}
                  title="Gerir Membros"
                >
                  <Users className="w-4 h-4" />
                </IonButton>
              )}
              <IonButton color="light" fill="clear" onClick={() => setShowEditTeamModal(true)}>
                <Edit2 className="w-4 h-4" />
              </IonButton>
              {permissions.isFullAdmin && (
                <IonButton
                  color="danger"
                  fill="clear"
                  onClick={() => setShowDeleteTeamAlert(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </IonButton>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Team Information Card */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card rounded-2xl p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo */}
            <div
              className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl shadow-md border-4 flex-shrink-0"
              style={{
                backgroundColor: `${team.colors?.primary || '#3b82f6'}20`,
                borderColor: `${team.colors?.primary || '#3b82f6'}40`,
              }}
            >
              {team.logo || '⚽'}
            </div>

            {/* Team Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-4">{teamDisplayName}</h2>

              <div className="space-y-2 text-sm">
                {team.stadium && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{team.stadium}</span>
                  </div>
                )}

                {team.founded && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Fundado em {team.founded}</span>
                  </div>
                )}

                {team.rival && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Rival: {team.rival}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-primary font-semibold pt-2">
                  <Users className="w-4 h-4" />
                  <span>{allPlayers.length} Jogadores</span>
                </div>
              </div>

              {token && favoriteTeamId ? (
                <button
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all ${isFavorite ? 'border-yellow-300 bg-yellow-100 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200' : 'bg-card text-foreground hover:border-yellow-300 dark:hover:border-yellow-700'}`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'A seguir' : 'Seguir equipa'}
                </button>
              ) : null}
            </div>
          </div>

          {/* Team Description */}
          {team.description && (
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{team.description}"
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-32 space-y-8">
        {/* Player Management Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Plantel</h3>
              <p className="text-sm text-muted-foreground">
                Jogadores organizados por posição
              </p>
            </div>
            {permissions.canManagePlayers && canManagePersistedTeam && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IonButton
                  expand="block"
                  onClick={() => {
                    setEditingPlayer(null);
                    setShowEditPlayerModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Jogador
                </IonButton>
              </motion.div>
            )}
          </div>

          {permissions.canSelectPlayers && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStartingXIModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl font-semibold text-primary hover:from-primary/30 hover:to-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Definir Starting XI
            </motion.button>
          )}

          {!players || Object.keys(players).length === 0 ? (
            <div className="surface-card-muted rounded-2xl py-12 text-center">
              <span className="text-6xl mb-4 block">⚽</span>
              <h3 className="text-lg font-semibold text-foreground">Sem dados de jogadores</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Comece a adicionar jogadores ao plantel
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(players).map(([position, playerList], sectionIndex) => (
                <motion.div
                  key={position}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="surface-card overflow-hidden rounded-2xl transition-shadow"
                >
                  {/* Position Header */}
                  <div
                    className={`bg-gradient-to-r ${
                      positionColors[position] || positionColors['Outro']
                    } px-6 py-5 border-b border-border`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/50 border-2 border-current flex items-center justify-center font-bold text-lg opacity-80">
                        {position.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{position}</h3>
                        <p className="text-xs font-semibold opacity-70">
                          {playerList.length} jogador{playerList.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Players */}
                  <div className="divide-y divide-border/70">
                    {playerList.map((player, idx) => (
                      <motion.div
                        key={`${player.id}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-6 py-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/0 transition-all cursor-pointer group"
                        onClick={() => navigate(`/player/${encodeURIComponent(player.id)}`)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-sm">
                              <span className="font-bold text-primary text-lg">
                                {player.numero}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {player.nome}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">{position}</p>
                                {player.status && player.status !== 'available' && (
                                  <span className="rounded px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200">
                                    {player.status === 'injured'
                                      ? '🤕 Lesionado'
                                      : player.status === 'suspended'
                                      ? '⚠️ Suspenso'
                                      : player.status === 'called_up'
                                      ? '✅ Convocado'
                                      : player.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {permissions.canManagePlayers && canManagePersistedTeam && /^[a-f\d]{24}$/i.test(player.id) && (
                              <>
                                <IonButton
                                  fill="clear"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingPlayer({ ...player, position });
                                    setShowEditPlayerModal(true);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4 text-primary" />
                                </IonButton>
                                <IonButton
                                  fill="clear"
                                  color="danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerToDelete(player.id);
                                    setShowDeletePlayerAlert(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </IonButton>
                              </>
                            )}
                            {player.url && (
                              <a
                                href={player.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-lg hover:bg-primary/15 transition-all border border-primary/20"
                              >
                                ZeroZero
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Matches Section */}
        {matches.length > 0 && (
          <section className="space-y-4">
            <TeamMatchesSection
              teamId={teamId || ''}
              teamName={teamDisplayName}
              matches={matches}
              canEdit={permissions.canManageMatches}
              token={token || undefined}
              onCreateMatch={() => {}}
              onEditMatch={() => {}}
              onDeleteMatch={async () => {}}
            />
          </section>
        )}

        {/* User Role Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 border-t border-border/70 py-4 text-center text-xs text-muted-foreground"
          >
            <p>
              Utilizador: <span className="font-semibold">{user.name}</span> ({user.role})
            </p>
            {!permissions.canEditTeam &&
              !permissions.canManagePlayers &&
              !permissions.canSelectPlayers && (
                <p className="mt-1 text-muted-foreground">
                  Modo visualização - sem permissões de edição
                </p>
              )}
          </motion.div>
        )}
      </main>

      {/* Modals */}
      {token && (
        <>
          <TeamModal
            open={showEditTeamModal}
            onOpenChange={setShowEditTeamModal}
            team={team}
            token={token}
            onSave={() => {
              window.location.reload();
            }}
          />

          <PlayerModal
            open={showEditPlayerModal}
            onOpenChange={setShowEditPlayerModal}
            player={editingPlayer}
            teamId={persistedTeamId || ''}
            teamCampeonato={teamCampeonato}
            teamName={teamDisplayName}
            token={token}
            isNew={!editingPlayer}
            onSave={() => {
              // Reload page to show all changes
              window.location.reload();
            }}
          />

          <StartingXIModal
            open={showStartingXIModal}
            onOpenChange={setShowStartingXIModal}
            players={allPlayers}
            onSave={() => {
              setShowStartingXIModal(false);
            }}
          />

          <IonAlert
            isOpen={showDeletePlayerAlert}
            onDidDismiss={() => {
              setShowDeletePlayerAlert(false);
              setPlayerToDelete(null);
            }}
            header="Confirmar"
            message="Tem a certeza que deseja apagar este jogador?"
            buttons={[
              { text: 'Cancelar', role: 'cancel' },
              { text: 'Apagar', role: 'destructive', handler: handleDeletePlayer },
            ]}
          />

          {permissions.isFullAdmin && (
            <IonAlert
              isOpen={showDeleteTeamAlert}
              onDidDismiss={() => setShowDeleteTeamAlert(false)}
              header="Confirmar"
              message="Tem a certeza que deseja apagar esta equipa? Esta ação é irreversível."
              buttons={[
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Apagar',
                  role: 'destructive',
                  handler: async () => {
                    if (!team) return;
                    try {
                      const API_URL_LOCAL = API_URL;
                      const res = await fetch(`${API_URL_LOCAL}/admin/clubs/${persistedTeamId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (!res.ok) throw new Error('Erro ao apagar equipa');
                      navigate('/teams');
                    } catch {
                      setError('Erro ao apagar equipa');
                    } finally {
                      setShowDeleteTeamAlert(false);
                    }
                  },
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}
