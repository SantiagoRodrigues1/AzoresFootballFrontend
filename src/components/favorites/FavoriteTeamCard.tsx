import { Bell, Goal, TimerReset, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { FavoriteTeam } from '@/types/features';

interface FavoriteTeamCardProps {
  item: FavoriteTeam;
  onToggle: (teamId: string) => void;
  onNotificationsChange: (teamId: string, notifications: FavoriteTeam['notifications']) => void;
}

export function FavoriteTeamCard({ item, onToggle, onNotificationsChange }: FavoriteTeamCardProps) {
  return (
    <article className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <h3 className="text-lg font-bold text-foreground">{item.team.name}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.team.island || 'Açores'}</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => onToggle(item.team._id)}>
          Remover
        </Button>
      </div>

      <div className="mt-4 space-y-3 rounded-3xl bg-muted/40 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Início de jogo</span>
          <Switch checked={item.notifications.matchStart} onCheckedChange={(checked) => onNotificationsChange(item.team._id, { ...item.notifications, matchStart: checked })} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2"><Goal className="h-4 w-4 text-primary" /> Golos</span>
          <Switch checked={item.notifications.goals} onCheckedChange={(checked) => onNotificationsChange(item.team._id, { ...item.notifications, goals: checked })} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2"><TimerReset className="h-4 w-4 text-primary" /> Resultado final</span>
          <Switch checked={item.notifications.finalResult} onCheckedChange={(checked) => onNotificationsChange(item.team._id, { ...item.notifications, finalResult: checked })} />
        </div>
      </div>
    </article>
  );
}
