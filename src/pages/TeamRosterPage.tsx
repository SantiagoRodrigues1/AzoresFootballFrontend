import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, Shield, Target, MoreVertical } from 'lucide-react';
import { IonSpinner } from '@ionic/react';
import { PlayerForm } from '@/components/players/PlayerForm';

interface Player {
  _id: string;
  name: string;
  numero: string;
  position: string;
  email?: string;
  photo?: string;
  goals?: number;
  assists?: number;
  team?: string;
}

interface TeamStats {
  totalPlayers: number;
  totalGoals: number;
  totalAssists: number;
}

const POSITION_ICONS: Record<string, string> = {
  'Guarda-redes': '🥅',
  'Defesa Central': '🛡️',
  'Lateral Esquerdo': '⬅️',
  'Lateral Direito': '➡️',
  'Médio Defensivo': '🛡️',
  'Médio': '🎯',
  'Médio Ofensivo': '⚡',
  'Extremo Esquerdo': '⬅️⚡',
  'Extremo Direito': '➡️⚡',
  'Avançado': '⚽',
  'Outro': '👤'
};

export function TeamRosterPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // using shared API_URL from services/api
  const isOwnTeam = user?.assignedTeam === teamId;

  // Carregar jogadores
  useEffect(() => {
    fetchPlayers();
    fetchStats();
  }, [teamId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/players/team/${teamId}`);
      if (!response.ok) throw new Error('Erro ao carregar jogadores');

      const data = await response.json();
      setPlayers(data.data || []);
    } catch (err) {
      console.error('❌ Erro:', err);
      setError('Não foi possível carregar o plantel');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/players/team/${teamId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (_err) {
    }
  };

  // Adicionar jogador
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [...prev, newPlayer]);
    fetchStats();
    setIsFormOpen(false);
  };

  // Atualizar jogador
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev =>
      prev.map(p => p._id === updatedPlayer._id ? updatedPlayer : p)
    );
    setEditingPlayer(null);
    fetchStats();
  };

  // Remover jogador
  const handleDeletePlayer = async (playerId: string) => {
    if (!window.confirm('Tem a certeza que quer remover este jogador?')) return;

    try {
      const response = await fetch(`${API_URL}/players/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao remover jogador');

      setPlayers(prev => prev.filter(p => p._id !== playerId));
      fetchStats();
    } catch (err) {
      alert('Erro ao remover jogador');
    }
  };

  // Agrupar jogadores por posição
  const playersByPosition = players.reduce((acc, player) => {
    const pos = player.position || 'Outro';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center pb-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <IonSpinner name="crescent" color="primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-shell min-h-screen p-4 pb-24"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-start gap-4 mb-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
              <Users size={32} className="text-primary" />
              Plantel da Equipa
            </h1>
            {stats && (
              <p className="mt-2 text-muted-foreground">
                {stats.totalPlayers} jogador{stats.totalPlayers !== 1 ? 'es' : ''} • 
                {stats.totalGoals} golo{stats.totalGoals !== 1 ? 's' : ''} • 
                {stats.totalAssists} assistência{stats.totalAssists !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {isOwnTeam && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingPlayer(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
            >
              <Plus size={20} />
              Adicionar Jogador
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto mb-6 max-w-6xl rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Empty State */}
      {players.length === 0 ? (
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="surface-card rounded-xl p-12 text-center"
          >
            <div className="text-5xl mb-3">👥</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Sem jogadores registados
            </h3>
            <p className="mb-4 text-muted-foreground">
              {isOwnTeam
                ? 'Clique no botão acima para adicionar o primeiro jogador'
                : 'A equipa ainda não tem jogadores registados'}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Golo-dromed por Posição */}
          {Object.entries(playersByPosition).map(([position, posPlayers], idx) => (
            <motion.div
              key={position}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{POSITION_ICONS[position] || '👤'}</div>
                <h2 className="text-xl font-bold text-foreground">{position}</h2>
                <span className="surface-pill rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {posPlayers.length}
                </span>
              </div>

              {/* Grid de Jogadores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posPlayers.map((player, pidx) => (
                  <motion.div
                    key={player._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: pidx * 0.05 }}
                    className="surface-card overflow-hidden rounded-lg transition-shadow"
                  >
                    {/* Player Card */}
                    <div className="p-4">
                      {/* Header com número e menu */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Jersey */}
                          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                            {player.numero}
                          </div>

                          {/* Name & Position */}
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-base leading-snug">
                              {player.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>

                        {/* Menu */}
                        {isOwnTeam && (
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenId(menuOpenId === player._id ? null : player._id)}
                              className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {menuOpenId === player._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="surface-card absolute right-0 top-full z-10 mt-1 rounded-lg"
                              >
                                <button
                                  onClick={() => {
                                    setEditingPlayer(player);
                                    setMenuOpenId(null);
                                    setIsFormOpen(true);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted/60"
                                >
                                  <Edit2 size={14} /> Editar
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeletePlayer(player._id);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 size={14} /> Remover
                                </button>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      {(player.goals || player.assists) && (
                        <div className="flex gap-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target size={14} />
                            <span>{player.goals || 0} golos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield size={14} />
                            <span>{player.assists || 0} asst</span>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {player.email && (
                        <p className="mt-2 truncate text-xs text-muted-foreground">{player.email}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Player Form Modal */}
      <PlayerForm
        teamId={teamId!}
        onPlayerAdded={handleAddPlayer}
        onPlayerUpdated={handleUpdatePlayer}
        initialPlayer={editingPlayer}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlayer(null);
        }}
        isEditMode={!!editingPlayer}
      />
    </motion.div>
  );
}
