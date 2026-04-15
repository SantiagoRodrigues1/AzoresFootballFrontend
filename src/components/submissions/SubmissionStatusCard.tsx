import { Badge } from '@/components/ui/badge';
import type { Submission } from '@/types/features';

const statusMap = {
  pending: { label: 'Pendente', className: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  approved: { label: 'Aprovada', className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
  rejected: { label: 'Rejeitada', className: 'bg-rose-500/10 text-rose-700 border-rose-500/20' }
};

export function SubmissionStatusCard({ item }: { item: Submission }) {
  const status = statusMap[item.status];

  return (
    <article className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">{item.type}</p>
          <h3 className="mt-2 text-lg font-bold text-foreground">{String(item.data.name || item.data.title || 'Submissão do utilizador')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Criada em {new Date(item.createdAt).toLocaleString('pt-PT')}</p>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>
      {item.reviewNote ? <p className="mt-4 rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{item.reviewNote}</p> : null}
    </article>
  );
}
