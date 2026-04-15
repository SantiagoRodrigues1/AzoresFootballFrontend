// src/components/standings/StandingsTable.tsx
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface Standing {
  posicao: string;
  equipa: string;
  name?: string;
  pontos: string;
  jogos: string;
  vitorias: string;
  empates: string;
  derrotas: string;
  golos: string;
  diferenca: string;
}

interface Props {
  standings: Standing[];
  titulo?: string;
}

function toSafeInteger(value: string | number | undefined, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const match = value.match(/-?\d+/);
    if (match) {
      const parsed = Number.parseInt(match[0], 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

export default function StandingsTable({ standings, titulo = "Classificação" }: Props) {
  if (!standings || standings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Sem dados de classificação disponíveis.
        </CardContent>
      </Card>
    );
  }

  // Corrige dados do JSON
  const corrected = standings.map((item, idx) => {
    const legacyBrokenName = typeof item.pontos === 'string' && !/^\d+$/.test(item.pontos.trim())
      ? item.pontos.trim()
      : '';
    const teamName = item.equipa?.trim() || item.name?.trim() || legacyBrokenName || `Equipa ${idx + 1}`;
    const won = toSafeInteger(item.vitorias, 0);
    const drawn = toSafeInteger(item.empates, 0);
    const lost = toSafeInteger(item.derrotas, 0);
    const played = toSafeInteger(item.jogos, won + drawn + lost);
    const goalDiff = toSafeInteger(item.diferenca, 0);
    const points = toSafeInteger(item.pontos, won * 3 + drawn);

    return {
      originalPosition: toSafeInteger(item.posicao, idx + 1),
      team: teamName,
      played,
      won,
      drawn,
      lost,
      goalDifference: goalDiff,
      points,
    };
  });

  // Ordena por pontos > vitórias > diferença de golos
  corrected.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    return b.goalDifference - a.goalDifference;
  });

  // Atualiza posições após ordenar
  const finalStandings = corrected.map((team, idx) => ({ ...team, position: idx + 1 }));

  return (
    <Card className="overflow-hidden border shadow-xl rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-5">
        <CardTitle className="text-2xl flex items-center gap-3">
          <Trophy className="h-7 w-7" />
          {titulo}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/90">
                <TableHead className="w-14 text-center font-bold text-sm">Pos</TableHead>
                <TableHead className="font-bold pl-6 text-sm">Equipa</TableHead>
                <TableHead className="text-center font-bold text-sm">J</TableHead>
                <TableHead className="text-center font-bold text-sm">V</TableHead>
                <TableHead className="text-center font-bold text-sm">E</TableHead>
                <TableHead className="text-center font-bold text-sm">D</TableHead>
                <TableHead className="text-center font-bold text-sm">DG</TableHead>
                <TableHead className="text-center font-bold text-sm">Pts</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {finalStandings.map((team, idx) => {
                const pos = team.position;
                let rowClass = "hover:bg-muted/30 transition-colors";

                if (pos === 1) rowClass += " bg-yellow-50/80 font-medium dark:bg-yellow-500/10";
                else if (pos === 2) rowClass += " bg-gray-50/80 font-medium dark:bg-slate-500/10";
                else if (pos === 3) rowClass += " bg-amber-50/80 font-medium dark:bg-amber-500/10";

                return (
                  <TableRow key={idx} className={rowClass}>
                    <TableCell className="text-center font-bold text-lg">
                      {pos <= 3 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {pos === 1 && <Trophy className="h-5 w-5 text-yellow-600" />}
                          {pos === 2 && <Medal className="h-5 w-5 text-gray-600" />}
                          {pos === 3 && <Award className="h-5 w-5 text-amber-700" />}
                          {pos}
                        </div>
                      ) : (
                        pos
                      )}
                    </TableCell>

                    <TableCell className="pl-6 font-medium text-base">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-2xl shadow-sm">
                          🏆
                        </div>
                        <span className="truncate max-w-[220px]">{team.team}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-sm">{team.played}</TableCell>
                    <TableCell className="text-center text-sm">{team.won}</TableCell>
                    <TableCell className="text-center text-sm">{team.drawn}</TableCell>
                    <TableCell className="text-center text-sm">{team.lost}</TableCell>
                    <TableCell className="text-center font-medium text-sm">
                      {team.goalDifference >= 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-base px-4 py-1.5 font-bold">
                        {team.points}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
