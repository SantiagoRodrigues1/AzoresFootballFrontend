import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCheck, ClipboardCheck, Filter, Loader2, ShieldAlert, XCircle } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { queryKeys } from '@/lib/queryKeys';
import { approveEditRequest, getAdminEditRequests, rejectEditRequest } from '@/services/featureService';

export function AdminEditRequestsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const requestsQuery = useQuery({
    queryKey: queryKeys.editRequests.admin(status),
    queryFn: () => getAdminEditRequests(status),
    placeholderData: (previous) => previous
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, action, reviewNote }: { id: string; action: 'approve' | 'reject'; reviewNote?: string }) =>
      action === 'approve' ? approveEditRequest(id, { reviewNote }) : rejectEditRequest(id, { reviewNote }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.editRequests.root });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    }
  });

  const stats = useMemo(() => {
    const items = requestsQuery.data || [];
    return {
      total: items.length,
      pending: items.filter((item) => item.status === 'pending').length,
      approved: items.filter((item) => item.status === 'approved').length,
      rejected: items.filter((item) => item.status === 'rejected').length
    };
  }, [requestsQuery.data]);

  const requestItems = requestsQuery.data || [];

  return (
    <MobilePage title="Edit Requests" subtitle="Rever alterações pedidas pelos utilizadores" backTo="/more">
      <div className="space-y-4">
        <section className="grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: stats.total, icon: ClipboardCheck },
            { label: 'Pendentes', value: stats.pending, icon: ShieldAlert },
            { label: 'Aprovados', value: stats.approved, icon: CheckCheck },
            { label: 'Rejeitados', value: stats.rejected, icon: XCircle }
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-[28px] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'pending', label: 'Pendentes' },
            { id: 'approved', label: 'Aprovados' },
            { id: 'rejected', label: 'Rejeitados' },
            { id: 'all', label: 'Todos' }
          ].map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={status === item.id ? 'default' : 'outline'}
              className="rounded-full"
              onClick={() => setStatus(item.id as typeof status)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {requestsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            A carregar pedidos...
          </div>
        ) : null}

        {!requestsQuery.isLoading && !requestItems.length ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Sem pedidos neste filtro"
            description="Quando os utilizadores enviarem pedidos de edição, eles vão aparecer aqui com o histórico e a prova submetida."
          />
        ) : null}

        <div className="space-y-4">
          {requestItems.map((item) => {
            const playerName = item.playerId?.name || item.playerId?.nome || 'Jogador';
            const proofValue = item.proof?.value || '';
            const isImageProof = item.proof?.type === 'image' || proofValue.startsWith('data:image/');

            return (
              <Card key={item._id} className="rounded-[30px] border-border/70 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-primary/70">{item.fieldLabel || item.field}</p>
                      <h2 className="text-xl font-bold text-foreground">{playerName}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pedido por {item.userId?.name || item.userId?.email || 'Utilizador'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-700' : item.status === 'rejected' ? 'bg-rose-500/10 text-rose-700' : 'bg-amber-500/10 text-amber-700'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-border/70 bg-muted/30 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Valor atual</p>
                      <p className="mt-2 font-semibold text-foreground">{String(item.oldValue || 'Sem valor')}</p>
                    </div>
                    <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">Novo valor</p>
                      <p className="mt-2 font-semibold text-foreground">{String(item.newValue || 'Sem valor')}</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border/70 bg-card/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Justificação</p>
                    <p className="mt-2 text-sm leading-6 text-foreground">{item.justification}</p>
                  </div>

                  {proofValue ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Prova</p>
                      {isImageProof ? (
                        <img src={proofValue} alt="Prova enviada" className="max-h-64 w-full rounded-[24px] object-cover" />
                      ) : (
                        <a href={proofValue} target="_blank" rel="noreferrer" className="block truncate rounded-[20px] border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium text-primary underline-offset-4 hover:underline">
                          {proofValue}
                        </a>
                      )}
                    </div>
                  ) : null}

                  {item.status === 'pending' ? (
                    <>
                      <Textarea
                        value={reviewNotes[item._id] || ''}
                        onChange={(event) => setReviewNotes((current) => ({ ...current, [item._id]: event.target.value }))}
                        className="min-h-24 rounded-[24px]"
                        placeholder="Nota opcional para aprovação ou rejeição"
                      />
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          disabled={reviewMutation.isPending}
                          onClick={() => reviewMutation.mutate({ id: item._id, action: 'reject', reviewNote: reviewNotes[item._id] })}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          type="button"
                          className="rounded-full"
                          disabled={reviewMutation.isPending}
                          onClick={() => reviewMutation.mutate({ id: item._id, action: 'approve', reviewNote: reviewNotes[item._id] })}
                        >
                          {reviewMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Aprovar
                        </Button>
                      </div>
                    </>
                  ) : item.reviewNote ? (
                    <div className="rounded-[24px] border border-border/70 bg-muted/30 p-4 text-sm text-foreground">
                      <span className="font-semibold">Nota da revisão:</span> {item.reviewNote}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MobilePage>
  );
}