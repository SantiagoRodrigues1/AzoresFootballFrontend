import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Columns2, Search } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { comparePlayers, getTeams, searchPlayersForComparison } from '@/services/featureService';

export function PlayerComparisonPage() {
  const [nameQuery, setNameQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
  const [firstPlayerId, setFirstPlayerId] = useState('');
  const [secondPlayerId, setSecondPlayerId] = useState('');
  const [params, setParams] = useState<{ first: string; second: string } | null>(null);

  const teamsQuery = useQuery({
    queryKey: ['comparison-teams'],
    queryFn: getTeams,
    staleTime: 60_000
  });

  const playersQuery = useQuery({
    queryKey: ['comparison-players', nameQuery, selectedTeamFilter],
    queryFn: () => searchPlayersForComparison({ name: nameQuery, team: selectedTeamFilter, limit: 40 }),
    enabled: nameQuery.trim().length >= 2 || Boolean(selectedTeamFilter),
    staleTime: 15_000
  });

  const candidates = useMemo(() => {
    return Array.from(
      new Map((playersQuery.data || []).map((player) => [player.id || player._id, player])).values()
    );
  }, [playersQuery.data]);

  const query = useQuery({
    queryKey: ['player-compare', params],
    queryFn: () => comparePlayers(params!.first, params!.second),
    enabled: Boolean(params)
  });

  return (
    <MobilePage title="Comparar jogadores" subtitle="Estatísticas lado a lado" backTo="/more">
      <div className="space-y-5">
        <Card className="rounded-[28px] border-border/70">
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr,260px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={nameQuery} onChange={(event) => setNameQuery(event.target.value)} placeholder="Pesquisar por nome" className="rounded-full pl-11" />
              </div>
              <select value={selectedTeamFilter} onChange={(event) => setSelectedTeamFilter(event.target.value)} className="h-10 rounded-full border border-input bg-background px-4 text-sm text-foreground">
                <option value="">Todas as equipas</option>
                {(teamsQuery.data || []).map((team) => {
                  const value = `${team.campeonato}::${team.equipa}`;
                  return (
                    <option key={`${team.campeonato}-${team._id}`} value={value}>
                      {team.equipa} · {team.ilha || team.campeonato}
                    </option>
                  );
                })}
              </select>
            </div>

            <select value={firstPlayerId} onChange={(event) => setFirstPlayerId(event.target.value)} className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground">
              <option value="">Selecionar primeiro jogador</option>
              {candidates.map((player) => (
                <option key={`first-${player.id}`} value={player.id}>
                  {(player.name || player.nome)}{player.teamName ? ` · ${player.teamName}` : ''}
                </option>
              ))}
            </select>

            <select value={secondPlayerId} onChange={(event) => setSecondPlayerId(event.target.value)} className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground">
              <option value="">Selecionar segundo jogador</option>
              {candidates.map((player) => (
                <option key={`second-${player.id}`} value={player.id}>
                  {(player.name || player.nome)}{player.teamName ? ` · ${player.teamName}` : ''}
                </option>
              ))}
            </select>

            {playersQuery.isFetching ? <p className="text-sm text-muted-foreground">A procurar jogadores...</p> : null}
            {!playersQuery.isFetching && (nameQuery.trim().length >= 2 || selectedTeamFilter) && candidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum jogador encontrado com os filtros atuais.</p>
            ) : null}

            <Button className="w-full rounded-full" onClick={() => setParams({ first: firstPlayerId, second: secondPlayerId })} disabled={!firstPlayerId || !secondPlayerId}>
              <Columns2 className="mr-2 h-4 w-4" /> Comparar
            </Button>
          </CardContent>
        </Card>

        {query.data ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-[28px] border-border/70"><CardContent className="space-y-3 p-5"><h3 className="text-lg font-bold">{query.data.first.name || query.data.first.nome}</h3><p className="text-sm text-muted-foreground">Equipa: {query.data.comparison.team.first || 'Sem equipa'}</p><p className="text-sm text-muted-foreground">Golos: {query.data.comparison.goals.first}</p><p className="text-sm text-muted-foreground">Assistências: {query.data.comparison.assists.first}</p><p className="text-sm text-muted-foreground">Posição: {query.data.comparison.position.first}</p></CardContent></Card>
            <Card className="rounded-[28px] border-border/70"><CardContent className="space-y-3 p-5"><h3 className="text-lg font-bold">{query.data.second.name || query.data.second.nome}</h3><p className="text-sm text-muted-foreground">Equipa: {query.data.comparison.team.second || 'Sem equipa'}</p><p className="text-sm text-muted-foreground">Golos: {query.data.comparison.goals.second}</p><p className="text-sm text-muted-foreground">Assistências: {query.data.comparison.assists.second}</p><p className="text-sm text-muted-foreground">Posição: {query.data.comparison.position.second}</p></CardContent></Card>
          </div>
        ) : null}
      </div>
    </MobilePage>
  );
}
