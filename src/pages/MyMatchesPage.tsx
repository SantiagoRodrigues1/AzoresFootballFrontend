import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/services/api';
import { motion } from 'framer-motion';
import { IonSpinner } from '@ionic/react';
import { MyMatchCard } from '@/components/matches/MyMatchCard';
import { Search } from 'lucide-react';

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
  competition?: string | { id?: string; name?: string } | null;
  estadio?: string;
}

interface Championship {
  campeonato: string;
  temporada: string;
  proximos_jogos: { jogos: Match[] }[];
}

interface MatchByCompetition {
  competition: string;
  matches: Match[];
}

function getCompetitionName(match: Match) {
  if (typeof match.competition === 'string') {
    return match.competition;
  }

  if (match.competition && typeof match.competition === 'object') {
    return match.competition.name || 'Sem Competição';
  }

  return match.competicao || 'Sem Competição';
}

export function MyMatchesPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [matchesByCompetition, setMatchesByCompetition] = useState<MatchByCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const teamName = user?.assignedTeam || '';

  useEffect(() => {
    fetchTeamMatches();
  }, [teamName, navigate, token]);

  const fetchTeamMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Token não disponível');
        return;
      }

      // use centralized API_URL
      const API_URL_LOCAL = API_URL;

      // Use new team-manager endpoint instead of standings
      const response = await fetch(`${API_URL_LOCAL}/team-manager/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao carregar jogos');

      const data = await response.json();

      // Transform the data to group by competition
      const matches = data.data || data || [];
      
      // Group matches by competition
      const grouped: MatchByCompetition[] = [];
      const competitionMap = new Map<string, Match[]>();

      matches.forEach((match: Match) => {
        const comp = getCompetitionName(match);
        if (!competitionMap.has(comp)) {
          competitionMap.set(comp, []);
        }
        competitionMap.get(comp)!.push(match);
      });

      // Convert to array format
      competitionMap.forEach((matchList, competitionName) => {
        grouped.push({
          competition: competitionName,
          matches: matchList.sort(
            (a, b) =>
              new Date(a.date || a.data_hora || '').getTime() - 
              new Date(b.date || b.data_hora || '').getTime()
          ),
        });
      });

      setMatchesByCompetition(grouped);
    } catch (_err) {
      setError('Falha ao carregar seus jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matchesByCompetition
    .map((comp) => ({
      ...comp,
      matches: comp.matches.filter(
        (match) =>
          (match.homeTeam?.name || match.casa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (match.awayTeam?.name || match.fora || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCompetitionName(match).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((comp) => comp.matches.length > 0);

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
        <motion.h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Os Meus Jogos
        </motion.h1>
        <p className="text-muted-foreground">
          Equipa: <span className="font-semibold text-foreground">{teamName}</span>
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procurar por equipa ou competição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="surface-input w-full rounded-lg py-3 pl-12 pr-4"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-auto mb-6 max-w-6xl rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="font-semibold text-destructive">{error}</p>
          <button
            onClick={fetchTeamMatches}
            className="mt-2 text-sm text-destructive underline hover:opacity-80"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredMatches.length === 0 ? (
        <div className="max-w-6xl mx-auto">
          <div className="surface-card rounded-xl p-12 text-center">
            <p className="mb-2 text-xl text-muted-foreground">⚽</p>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {searchTerm ? 'Nenhum jogo encontrado' : 'Nenhum jogo agendado'}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm
                ? 'Tente ajustar os termos de pesquisa'
                : 'Não tem nenhum jogo agendado no momento'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary font-semibold hover:underline"
              >
                Limpar Pesquisa
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          {filteredMatches.map((competition, ctIndex) => (
            <motion.div
              key={competition.competition}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ctIndex * 0.1 }}
            >
              {/* Competition Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                <h2 className="text-xl font-bold text-foreground">
                  {competition.competition}
                </h2>
                <span className="surface-pill rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {competition.matches.length} jogo{competition.matches.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Matches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competition.matches.map((match, mIndex) => (
                  <motion.div
                    key={match.id || match._id || `${competition.competition}-${mIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: mIndex * 0.05 }}
                  >
                    <MyMatchCard match={match} teamName={teamName} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
