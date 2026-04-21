import { motion } from 'framer-motion';
import { useState } from 'react';
import { API_URL } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMatchModal } from '@/components/admin/CreateMatchModal';
import { EditMatchModal } from '@/components/admin/EditMatchModal';
import { MatchCardPremium } from '@/components/matches/MatchCardPremium';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageLoader } from '@/components/feedback/PageLoader';
import { useMatchesByCompetitionQuery } from '@/hooks/queries/useAppQueries';
import { CalendarDays, Plus, Trophy, RefreshCw } from 'lucide-react';
import { IonAlert } from '@ionic/react';

interface Match {
  _id?: string;
  casa: string;
  fora: string;
  data_hora: string;
  status?: 'scheduled' | 'live' | 'finished';
  resultado?: string;
}

export function MatchesPage() {
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [showEditMatchModal, setShowEditMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<any>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  // 'all' means no filter; otherwise holds the selected championship name
  const [selectedChampionship, setSelectedChampionship] = useState<string>('all');

  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const matchesQuery = useMatchesByCompetitionQuery();
  const matchesByCompetition = matchesQuery.data || [];
  const error = matchesQuery.error instanceof Error ? matchesQuery.error.message : null;

  // Derive championship names for the filter buttons
  const championships = matchesByCompetition.map((c) => c.competition);

  // Filter competitions based on the selected championship
  const visibleCompetitions =
    selectedChampionship === 'all'
      ? matchesByCompetition
      : matchesByCompetition.filter((c) => c.competition === selectedChampionship);

  const handleDeleteMatch = async () => {
    if (!deleteTarget || !token) return;

    try {
      const response = await fetch(`${API_URL}/admin/matches/${deleteTarget}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao apagar jogo');
      setShowDeleteAlert(false);
      setDeleteTarget(null);
      matchesQuery.refetch();
    } catch (_err) {
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* ── Sticky Header ──────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Title row */}
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Jogos</h1>
              <p className="text-xs text-muted-foreground">
                {matchesByCompetition.length > 0
                  ? `${matchesByCompetition.reduce((s, c) => s + c.matches.length, 0)} jogos · ${matchesByCompetition.length} campeonatos`
                  : 'Campeonatos de futebol açoriano'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => matchesQuery.refetch()}
                disabled={matchesQuery.isFetching}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
                title="Atualizar"
              >
                <RefreshCw size={15} className={matchesQuery.isFetching ? 'animate-spin' : ''} />
              </button>

              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateMatchModal(true)}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Jogo
                </Button>
              )}
            </div>
          </div>

          {/* Championship filter tabs */}
          {championships.length > 1 && (
            <div className="flex gap-1 pb-0 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {['all', ...championships].map((name) => {
                const active = selectedChampionship === name;
                const label = name === 'all' ? 'Todos' : name.replace('Campeonato ', '');
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedChampionship(name)}
                    className={[
                      'flex-shrink-0 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
                      active
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {matchesQuery.isLoading && <PageLoader label="A carregar calendario..." />}

        {!matchesQuery.isLoading && visibleCompetitions.length > 0 && (
          <div className="space-y-8">
            {visibleCompetitions.map((comp, compIdx) => (
              <motion.section
                key={comp.competition}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: compIdx * 0.07, duration: 0.3 }}
              >
                {/* Section header */}
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={14} className="text-amber-500 flex-shrink-0" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wide truncate">
                    {comp.competition}
                  </h2>
                  <span className="ml-auto flex-shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
                    {comp.matches.length} jogos
                  </span>
                </div>

                {/* Match list */}
                <div className="space-y-2">
                  {comp.matches.map((match, idx) => (
                    <motion.div
                      key={`${match.casa}-${match.fora}-${match.data_hora}-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: compIdx * 0.07 + idx * 0.02 }}
                    >
                      <MatchCardPremium match={match} token={token} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}

        {!matchesQuery.isLoading && visibleCompetitions.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24">
            <EmptyState
              icon={CalendarDays}
              title="Sem jogos agendados"
              description="Nao ha partidas programadas para os campeonatos carregados."
            />
          </motion.div>
        )}
      </main>

      {/* ── Admin Modals ───────────────────────────────── */}
      {isAdmin && token && (
        <>
          <CreateMatchModal
            open={showCreateMatchModal}
            onOpenChange={setShowCreateMatchModal}
            token={token}
            onSave={() => { setShowCreateMatchModal(false); matchesQuery.refetch(); }}
          />
          <EditMatchModal
            open={showEditMatchModal}
            onOpenChange={setShowEditMatchModal}
            match={editingMatch as any}
            token={token}
            onSave={() => { setShowEditMatchModal(false); setEditingMatch(null); matchesQuery.refetch(); }}
          />
          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => { setShowDeleteAlert(false); setDeleteTarget(null); }}
            header="Confirmar eliminacao"
            message="Tem a certeza que deseja apagar este jogo?"
            buttons={[
              { text: 'Cancelar', role: 'cancel' },
              { text: 'Apagar', role: 'destructive', handler: handleDeleteMatch },
            ]}
          />
        </>
      )}
    </div>
  );
}
