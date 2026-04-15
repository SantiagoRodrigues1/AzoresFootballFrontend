import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { AppNotification } from '@/types/features';

export function NotificationCard({
  item,
  onToggleRead,
  categoryLabel,
  icon: Icon,
  accentClassName
}: {
  item: AppNotification;
  onToggleRead: (id: string, read: boolean) => void;
  categoryLabel?: string;
  icon?: LucideIcon;
  accentClassName?: string;
}) {
  return (
    <article className={`interactive-surface rounded-[28px] border p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] ${item.lida ? 'border-border/60 bg-card' : 'border-primary/20 bg-primary/5'} ${accentClassName || ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {Icon ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
            ) : null}
            <div className="min-w-0">
              {categoryLabel ? <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">{categoryLabel}</p> : null}
              <h3 className="truncate font-bold text-foreground">{item.titulo}</h3>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.mensagem}</p>
        </div>
        {!item.lida ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" /> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{new Date(item.criadoEm).toLocaleString('pt-PT')}</p>
        <div className="flex items-center gap-2">
          {item.acaoUrl ? (
            <Button asChild size="sm" variant="ghost" className="rounded-full">
              <Link to={item.acaoUrl}>
                Abrir
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          <Button
            size="sm"
            variant={item.lida ? 'outline' : 'secondary'}
            className="rounded-full"
            onClick={() => onToggleRead(item._id, item.lida)}
          >
            {item.lida ? 'Marcar por ler' : 'Marcar lida'}
          </Button>
        </div>
      </div>
    </article>
  );
}
