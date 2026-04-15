import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, CheckCircle2, FileClock, Heart, Megaphone, ShieldCheck, Siren, Sparkles, Trophy } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { getNotifications, markAllNotificationsRead, markNotificationRead, markNotificationUnread } from '@/services/featureService';
import { queryKeys } from '@/lib/queryKeys';
import type { AppNotification } from '@/types/features';

function updateNotificationsCache(
  current: AppNotification[] | undefined,
  updater: (items: AppNotification[]) => AppNotification[]
) {
  return updater([...(current || [])]);
}

function getNotificationMeta(item: AppNotification) {
  switch (item.eventKey) {
    case 'edit_request.created':
    case 'edit_request.approved':
    case 'edit_request.rejected':
      return { key: 'edit-requests', label: 'Pedidos de edição', icon: FileClock, accentClassName: 'bg-amber-500/5 border-amber-500/20' };
    case 'comment.created':
    case 'like.created':
      return { key: 'community', label: 'Comunidade', icon: Heart, accentClassName: 'bg-rose-500/5 border-rose-500/20' };
    case 'match.live_update':
    case 'favorite.team_update':
      return { key: 'matches', label: 'Partidos', icon: Trophy, accentClassName: 'bg-sky-500/5 border-sky-500/20' };
    default:
      break;
  }

  switch (item.tipo) {
    case 'edit_request':
    case 'edit_request_approved':
    case 'edit_request_rejected':
      return { key: 'edit-requests', label: 'Pedidos de edição', icon: FileClock, accentClassName: 'bg-amber-500/5 border-amber-500/20' };
    case 'pedido_aprovado':
    case 'pedido_rejeitado':
      return { key: 'submissions', label: 'Submissões', icon: FileClock, accentClassName: 'bg-amber-500/5 border-amber-500/20' };
    case 'goal':
    case 'match_start':
    case 'final_result':
      return { key: 'matches', label: 'Jogos', icon: Trophy, accentClassName: 'bg-sky-500/5 border-sky-500/20' };
    default:
      break;
  }

  const haystack = `${item.titulo} ${item.mensagem}`.toLowerCase();

  if (haystack.includes('submiss') || haystack.includes('aprova') || haystack.includes('rejeit')) {
    return { key: 'submissions', label: 'Submissões', icon: FileClock, accentClassName: 'bg-amber-500/5 border-amber-500/20' };
  }

  if (haystack.includes('favorit') || haystack.includes('golo') || haystack.includes('resultado') || haystack.includes('jogo')) {
    return { key: 'matches', label: 'Partidos', icon: Trophy, accentClassName: 'bg-sky-500/5 border-sky-500/20' };
  }

  if (haystack.includes('like') || haystack.includes('coment') || haystack.includes('post')) {
    return { key: 'community', label: 'Comunidade', icon: Heart, accentClassName: 'bg-rose-500/5 border-rose-500/20' };
  }

  if (haystack.includes('alerta') || haystack.includes('seguran') || haystack.includes('conta')) {
    return { key: 'system', label: 'Sistema', icon: ShieldCheck, accentClassName: 'bg-violet-500/5 border-violet-500/20' };
  }

  return { key: 'updates', label: 'Atualizações', icon: Megaphone, accentClassName: 'bg-emerald-500/5 border-emerald-500/20' };
}

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: getNotifications,
    staleTime: 15_000,
    placeholderData: (previous) => previous
  });

  const toggleReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => (read ? markNotificationUnread(id) : markNotificationRead(id)),
    onMutate: async ({ id, read }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });
      const previousNotifications = queryClient.getQueryData<AppNotification[]>(queryKeys.notifications.all);

      queryClient.setQueryData<AppNotification[]>(queryKeys.notifications.all, (current) =>
        updateNotificationsCache(current, (items) =>
          items.map((item) => (item._id === id ? { ...item, lida: !read } : item))
        )
      );

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.all, context.previousNotifications);
      }
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<AppNotification[]>(queryKeys.notifications.all, (current) =>
        updateNotificationsCache(current, (items) =>
          items.map((item) => (item._id === updatedNotification._id ? updatedNotification : item))
        )
      );
    }
  });

  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });
      const previousNotifications = queryClient.getQueryData<AppNotification[]>(queryKeys.notifications.all);

      queryClient.setQueryData<AppNotification[]>(queryKeys.notifications.all, (current) =>
        updateNotificationsCache(current, (items) => items.map((item) => ({ ...item, lida: true })))
      );

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.all, context.previousNotifications);
      }
    }
  });

  const notifications = notificationsQuery.data || [];
  const unreadCount = notifications.filter((item) => !item.lida).length;
  const filteredNotifications = useMemo(() => {
    const byReadState = notifications.filter((item) => {
      if (filter === 'unread') {
        return !item.lida;
      }

      if (filter === 'read') {
        return item.lida;
      }

      return true;
    });

    if (typeFilter === 'all') {
      return byReadState;
    }

    return byReadState.filter((item) => getNotificationMeta(item).key === typeFilter);
  }, [filter, notifications, typeFilter]);

  const availableTypeFilters = useMemo(() => {
    const filterMap = new Map<string, string>();

    notifications.forEach((item) => {
      const meta = getNotificationMeta(item);
      filterMap.set(meta.key, meta.label);
    });

    return Array.from(filterMap.entries()).map(([id, label]) => ({ id, label }));
  }, [notifications]);

  const groupedNotifications = useMemo(() => {
    const groups = new Map<string, { label: string; icon: typeof Trophy; accentClassName: string; items: AppNotification[] }>();

    filteredNotifications.forEach((item) => {
      const meta = getNotificationMeta(item);
      const current = groups.get(meta.key);

      if (current) {
        current.items.push(item);
        return;
      }

      groups.set(meta.key, {
        label: meta.label,
        icon: meta.icon,
        accentClassName: meta.accentClassName,
        items: [item]
      });
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      items: [...group.items].sort((left, right) => Number(left.lida) - Number(right.lida))
    }));
  }, [filteredNotifications]);

  return (
    <MobilePage
      title="Notificações"
      subtitle={unreadCount ? `${unreadCount} por ler` : 'Resultados, favoritos, comunidade e estado das tuas submissões'}
      backTo="/more"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => readAllMutation.mutate()}
          disabled={!unreadCount || readAllMutation.isPending}
        >
          Marcar tudo
        </Button>
      }
    >
      <div className="space-y-4">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="glass-card rounded-[28px] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-[28px] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Siren className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Por ler</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-[28px] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lidas</p>
                <p className="text-2xl font-bold text-foreground">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: 'Por ler' },
            { id: 'read', label: 'Lidas' }
          ].map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={filter === item.id ? 'default' : 'outline'}
              className="rounded-full"
              onClick={() => setFilter(item.id as 'all' | 'unread' | 'read')}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {availableTypeFilters.length ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              type="button"
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              className="rounded-full"
              onClick={() => setTypeFilter('all')}
            >
              Todas as categorias
            </Button>
            {availableTypeFilters.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={typeFilter === item.id ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setTypeFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : null}

        {groupedNotifications.map((group) => (
          <section key={group.label} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <group.icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {group.items.filter((item) => !item.lida).length}/{group.items.length}
              </span>
            </div>

            <div className="space-y-3">
              {group.items.map((item) => (
                <NotificationCard
                  key={item._id}
                  item={item}
                  categoryLabel={group.label}
                  icon={group.icon}
                  accentClassName={group.accentClassName}
                  onToggleRead={(id, read) => toggleReadMutation.mutate({ id, read })}
                />
              ))}
            </div>
          </section>
        ))}

        {!filteredNotifications.length ? (
          <EmptyState
            icon={Sparkles}
            title={filter === 'all' ? 'Centro de notificações vazio' : 'Nada para mostrar neste filtro'}
            description={filter === 'all' ? 'Quando houver novidades sobre jogos, favoritos, comunidade ou submissões, elas aparecem aqui.' : `Não existem notificações ${filter === 'unread' ? 'por ler' : 'lidas'} neste momento.`}
          />
        ) : null}
      </div>
    </MobilePage>
  );
}