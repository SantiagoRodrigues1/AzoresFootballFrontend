import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MobilePage } from '@/components/layout/MobilePage';
import { FavoriteTeamCard } from '@/components/favorites/FavoriteTeamCard';
import { getFavoriteTeams, toggleFavoriteTeam, updateFavoriteSettings } from '@/services/featureService';

export function FavoritesPage() {
  const queryClient = useQueryClient();
  const favoritesQuery = useQuery({ queryKey: ['favorite-teams'], queryFn: getFavoriteTeams });

  const toggleMutation = useMutation({
    mutationFn: toggleFavoriteTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-teams'] })
  });

  const settingsMutation = useMutation({
    mutationFn: ({ teamId, notifications }: { teamId: string; notifications: any }) => updateFavoriteSettings(teamId, notifications),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-teams'] })
  });

  return (
    <MobilePage title="Favoritos" subtitle="Segue equipas e controla alertas" backTo="/more">
      <div className="space-y-4">
        {(favoritesQuery.data || []).map((item) => (
          <FavoriteTeamCard
            key={item.id}
            item={item}
            onToggle={(teamId) => toggleMutation.mutate(teamId)}
            onNotificationsChange={(teamId, notifications) => settingsMutation.mutate({ teamId, notifications })}
          />
        ))}
        {!favoritesQuery.data?.length ? <div className="rounded-[28px] border border-dashed border-border p-10 text-center text-muted-foreground">Ainda não segues nenhuma equipa.</div> : null}
      </div>
    </MobilePage>
  );
}
