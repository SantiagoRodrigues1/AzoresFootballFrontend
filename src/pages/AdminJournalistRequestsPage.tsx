import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAdminJournalistRequests, approveJournalistRequest, rejectJournalistRequest } from '@/services/featureService';
import { Clock, CheckCircle, XCircle, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminJournalistRequestsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const requestsQuery = useQuery({
    queryKey: ['admin-journalist-requests', filter],
    queryFn: () => getAdminJournalistRequests(filter)
  });

  const approveMutation = useMutation({
    mutationFn: approveJournalistRequest,
    onSuccess: () => {
      toast({ title: 'Aprovado!', description: 'O utilizador foi promovido a jornalista.' });
      queryClient.invalidateQueries({ queryKey: ['admin-journalist-requests'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível aprovar o pedido.', variant: 'destructive' });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectJournalistRequest(id, reason),
    onSuccess: () => {
      toast({ title: 'Rejeitado', description: 'O pedido foi rejeitado.' });
      setRejectingId(null);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-journalist-requests'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível rejeitar o pedido.', variant: 'destructive' });
    }
  });

  const requests = requestsQuery.data || [];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado'
  };

  return (
    <div className="px-4 py-6 space-y-4">
      <h2 className="text-lg font-bold text-foreground">Pedidos de Jornalista</h2>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>

      {/* Loading */}
      {requestsQuery.isLoading && (
        <div className="text-center py-8 text-muted-foreground">A carregar...</div>
      )}

      {/* Empty */}
      {!requestsQuery.isLoading && requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum pedido {statusLabel[filter]?.toLowerCase()}</p>
        </div>
      )}

      {/* Requests List */}
      <AnimatePresence mode="popLayout">
        {requests.map(req => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-2xl border border-border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {statusIcon(req.status)}
                  <span className="text-sm font-medium text-foreground">
                    {req.userId?.name || 'Utilizador'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {req.userId?.email}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {req.name}</span>
                  <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {req.company}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(req.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Actions for pending */}
            {req.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                {rejectingId === req._id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Motivo (opcional)"
                      className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm border border-border text-foreground"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate({ id: req._id, reason: rejectReason || undefined })}
                      disabled={rejectMutation.isPending}
                    >
                      Confirmar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setRejectReason(''); }}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="rounded-lg"
                      onClick={() => approveMutation.mutate(req._id)}
                      disabled={approveMutation.isPending}
                    >
                      ✅ Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-lg"
                      onClick={() => setRejectingId(req._id)}
                    >
                      ❌ Rejeitar
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Rejection reason if rejected */}
            {req.status === 'rejected' && req.rejectionReason && (
              <p className="text-xs text-red-500 mt-2">Motivo: {req.rejectionReason}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
