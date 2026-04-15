import { useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShieldAlert, Trophy, User2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchEverything } from '@/services/featureService';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { queryKeys } from '@/lib/queryKeys';

interface SearchAutocompleteProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function SearchAutocomplete({ query, onQueryChange }: SearchAutocompleteProps) {
  const deferredQuery = useDeferredValue(query);
  const debouncedQuery = useDebouncedValue(deferredQuery.trim(), 250);
  const enabled = debouncedQuery.length >= 2;
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.discovery.search(debouncedQuery),
    queryFn: () => searchEverything(debouncedQuery),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Pesquisar jogadores, equipas e notícias..."
          className="h-12 rounded-full pl-11"
        />
      </div>

      {enabled ? (
        <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {data?.players.slice(0, 4).map((player: any) => (
                <Link key={player._id} to={`/player/${player._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                  <User2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{player.name || player.nome}</p>
                    <p className="text-xs text-muted-foreground">Jogador</p>
                  </div>
                </Link>
              ))}
              {data?.teams.slice(0, 4).map((team: any) => (
                <Link key={team._id} to={`/team/${team._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                  <Trophy className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{team.name || team.equipa}</p>
                    <p className="text-xs text-muted-foreground">Equipa</p>
                  </div>
                </Link>
              ))}
              {data?.news.slice(0, 4).map((item) => (
                <Link key={item._id} to={`/news/${item._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Notícia</p>
                  </div>
                </Link>
              ))}
              {!data?.players.length && !data?.teams.length && !data?.news.length ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">Sem resultados para esta pesquisa.</div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
