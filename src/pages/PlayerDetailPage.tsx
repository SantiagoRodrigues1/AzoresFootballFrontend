import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Briefcase, Edit3, Loader2, Mail, ShieldCheck, Sparkles, Trophy, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import { getPlayerById } from '@/services/featureService';
import { PlayerDirectEditDialog } from '@/components/players/PlayerDirectEditDialog';
import { PlayerEditRequestDialog } from '@/components/players/PlayerEditRequestDialog';
import { hasClubManagerAccess } from '@/utils/access';

export function PlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [directEditOpen, setDirectEditOpen] = useState(false);

  const playerQuery = useQuery({
    queryKey: queryKeys.players.detail(playerId || 'unknown'),
    queryFn: () => getPlayerById(playerId || ''),
    enabled: Boolean(playerId),
    staleTime: 30_000,
    placeholderData: (previous) => previous
  });

  const player = playerQuery.data;
  const normalizedPlayerId = String(player?._id || player?.id || '').trim();
  const canDirectEdit = useMemo(() => {
    if (!player || !user) {
      return false;
    }

    return hasClubManagerAccess(user) && Boolean(user?.assignedTeam) && user?.assignedTeam === (player.teamId || player.team);
  }, [player, user]);
  const canRequestEdit = isAuthenticated && !canDirectEdit && /^[a-f\d]{24}$/i.test(normalizedPlayerId);

  if (playerQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-foreground">A carregar perfil do jogador...</p>
        </div>
      </div>
    );
  }

  if (playerQuery.isError || !player) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--foreground)))] shadow-lg">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-background/15 text-primary-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Perfil do Jogador</h1>
          </div>
        </header>
        <div className="px-4 py-10">
          <EmptyState
            icon={AlertCircle}
            title="Jogador não encontrado"
            description="Não foi possível carregar os dados deste jogador."
            action={<Button className="rounded-full" onClick={() => navigate(-1)}>Voltar</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.14),transparent_30%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background))_100%)] pb-28">
    <header className="sticky top-0 z-40 border-b border-border/70 bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--foreground)))] shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-white">{player.name}</h1>
            <p className="truncate text-sm text-white/70">{player.teamName || 'Sem equipa associada'}</p>
          </div>
          {canDirectEdit ? (
            <Button type="button" variant="secondary" className="rounded-full bg-background text-foreground hover:bg-background/90" onClick={() => setDirectEditOpen(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Player
            </Button>
          ) : canRequestEdit ? (
            <Button type="button" variant="secondary" className="rounded-full bg-background text-foreground hover:bg-background/90" onClick={() => setRequestDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Request Edit
            </Button>
          ) : isAuthenticated ? (
            <Button type="button" variant="secondary" className="rounded-full bg-background text-foreground hover:bg-background/90" disabled>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Edição indisponível
            </Button>
          ) : (
            <Button type="button" variant="secondary" className="rounded-full bg-background text-foreground hover:bg-background/90" onClick={() => navigate('/auth')}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Entrar para editar
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[32px] border border-border/70 bg-card/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[auto,1fr] sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,rgba(14,116,144,0.18),rgba(59,130,246,0.18))] text-primary shadow-inner">
              {player.photo ? <img src={player.photo} alt={player.name} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10" />}
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  #{player.numero}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                  {player.position}
                </span>
                {canDirectEdit ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Gestão direta ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Edição com aprovação
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{player.name}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-border/70 bg-muted/30 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Equipa</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Briefcase className="h-4 w-4 text-primary" />{player.teamName || 'Sem equipa'}</p>
                </div>
                <div className="rounded-[24px] border border-border/70 bg-muted/30 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Golos</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Trophy className="h-4 w-4 text-primary" />{player.goals || 0}</p>
                </div>
                <div className="rounded-[24px] border border-border/70 bg-muted/30 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assistências</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{player.assists || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contacto e perfil</p>
              <h3 className="mt-2 text-lg font-bold text-foreground">Informação registada</h3>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground"><Mail className="h-4 w-4 text-primary" />{player.email || 'Sem email público'}</p>
            </div>
            <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Alcunha</p>
              <p className="mt-2 text-sm font-medium text-foreground">{player.nickname || 'Sem alcunha registada'}</p>
            </div>
          </div>
        </motion.section>
      </main>

      <PlayerEditRequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        player={player}
        onSubmitted={() => playerQuery.refetch()}
      />

      <PlayerDirectEditDialog
        open={directEditOpen}
        onOpenChange={setDirectEditOpen}
        player={player}
        onUpdated={() => playerQuery.refetch()}
      />
    </div>
  );
}
