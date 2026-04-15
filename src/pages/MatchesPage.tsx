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
import { CalendarDays, Plus } from 'lucide-react';
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

  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const matchesQuery = useMatchesByCompetitionQuery();
  const matchesByCompetition = matchesQuery.data || [];
  const error = matchesQuery.error instanceof Error ? matchesQuery.error.message : null;

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_35%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="px-4 py-6 sm:px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">⚽ Próximos Jogos</h1>
              <p className="text-sm text-slate-500 mt-1">Campeonatos de futebol açoriano</p>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setShowCreateMatchModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Jogo</span>
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 max-w-6xl mx-auto">
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {matchesQuery.isLoading ? <PageLoader label="A carregar calendário competitivo..." /> : null}

        {/* Competitions */}
        {!matchesQuery.isLoading && matchesByCompetition.length > 0 && (
          <div className="space-y-10">
            {matchesByCompetition.map((comp, compIdx) => (
              <motion.div
                key={comp.competition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: compIdx * 0.1 }}
                className="space-y-4"
              >
                {/* Competition Header */}
                <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-600">
                  <h2 className="text-2xl font-bold text-slate-900">{comp.competition}</h2>
                  <span className="ml-auto inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {comp.matches.length}
                  </span>
                </div>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comp.matches.map((match, idx) => {
                      return (
                        <motion.div
                          key={`${match.casa}-${match.fora}-${match.data_hora}-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (compIdx * 0.1) + (idx * 0.05) }}
                        >
                          <MatchCardPremium match={match} token={token} />
                        </motion.div>
                      );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!matchesQuery.isLoading && matchesByCompetition.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24">
            <EmptyState
              icon={CalendarDays}
              title="Sem jogos agendados"
              description="Não há partidas programadas nos próximos dias para os campeonatos carregados."
            />
          </motion.div>
        ) : null}
      </main>

      {/* Admin Modals */}
      {isAdmin && token && (
        <>
          <CreateMatchModal
            open={showCreateMatchModal}
            onOpenChange={setShowCreateMatchModal}
            token={token}
            onSave={() => {
              setShowCreateMatchModal(false);
              matchesQuery.refetch();
            }}
          />

          <EditMatchModal
            open={showEditMatchModal}
            onOpenChange={setShowEditMatchModal}
            match={editingMatch as any}
            token={token}
            onSave={() => {
              setShowEditMatchModal(false);
              setEditingMatch(null);
              matchesQuery.refetch();
            }}
          />

          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => {
              setShowDeleteAlert(false);
              setDeleteTarget(null);
            }}
            header="Confirmar eliminação"
            message={`Tem a certeza que deseja apagar o jogo entre ${deleteTarget?.split('-')[0]} e ${deleteTarget?.split('-')[1]}?`}
            buttons={[
              { text: 'Cancelar', role: 'cancel' },
              {
                text: 'Apagar',
                role: 'destructive',
                handler: handleDeleteMatch,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
