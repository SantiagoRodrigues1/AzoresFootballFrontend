import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MessageSquareText, Medal } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobilePage } from '@/components/layout/MobilePage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCommunityProfile } from '@/services/featureService';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const profileQuery = useQuery({
    queryKey: ['community-profile', userId],
    queryFn: () => getCommunityProfile(userId!),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const profile = profileQuery.data;

  return (
    <MobilePage
      title="Perfil"
      subtitle="Comunidade"
      backTo="/community"
    >
      {profileQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-[28px]" />
          <Skeleton className="h-24 rounded-[28px]" />
        </div>
      ) : profileQuery.isError || !profile ? (
        <Card className="rounded-[28px] border-border/70 bg-card">
          <CardContent className="p-6 text-center text-muted-foreground">
            Perfil não encontrado ou sem dados disponíveis.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Avatar + nome */}
          <Card className="rounded-[28px] border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="text-xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-bold text-foreground">{profile.name}</h2>
                  {profile.username ? (
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  ) : null}
                  {profile.role ? (
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                      {profile.role}
                    </span>
                  ) : null}
                </div>
              </div>

              {profile.createdAt ? (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Membro {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true, locale: pt })}
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-[28px] border-border/70 bg-card">
              <CardContent className="flex flex-col items-center justify-center p-5">
                <MessageSquareText className="mb-2 h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">{profile.postsCount ?? 0}</span>
                <span className="text-xs text-muted-foreground">Publicações</span>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-border/70 bg-card">
              <CardContent className="flex flex-col items-center justify-center p-5">
                <Medal className="mb-2 h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">
                  {profile.achievements?.length ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">Conquistas</span>
              </CardContent>
            </Card>
          </div>

          {/* Conquistas */}
          {profile.achievements?.length > 0 ? (
            <Card className="rounded-[28px] border-border/70 bg-card">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Conquistas</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.achievements.map((a, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {typeof a === 'string' ? a : (a as any).label ?? JSON.stringify(a)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </MobilePage>
  );
}

export default UserProfilePage;
