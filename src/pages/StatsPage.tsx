// src/pages/StatsPage.tsx
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StandingsTable from '@/components/standings/StandingsTable';
import { Loader2, AlertCircle } from 'lucide-react';
import { getStandings } from '@/services/featureService';
import { EmptyState } from '@/components/feedback/EmptyState';

const championships = [
  { id: 'azores_score', label: 'Campeonato dos Açores' },
  { id: 'campeonato_sao_miguel', label: 'São Miguel' },
  { id: 'campeonato_terceira', label: 'Terceira' },
  { id: 'campeonato_sao_jorge', label: 'São Jorge' },
  { id: 'campeonato_graciosa', label: 'Graciosa' },
  { id: 'campeonato_horta', label: 'Horta' },
];

const championshipLabels = Object.fromEntries(championships.map((championship) => [championship.id, championship.label]));

export default function StatsPage() {
  const [activeChamp, setActiveChamp] = useState(championships[0].id);
  const standingsQuery = useQuery({
    queryKey: ['standings'],
    queryFn: getStandings,
    placeholderData: (previous) => previous
  });

  const selectedData = useMemo(
    () => standingsQuery.data?.find((item) => item.campeonato === activeChamp),
    [activeChamp, standingsQuery.data]
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-ocean safe-top sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-primary-foreground">Classificações</h1>
          <p className="text-sm text-primary-foreground/70">Campeonatos regionais dos Açores</p>
        </div>

        <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
          {championships.map((champ) => (
            <button
              key={champ.id}
              onClick={() => setActiveChamp(champ.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeChamp === champ.id
                  ? 'bg-primary-foreground text-primary shadow-sm'
                  : 'bg-primary-foreground/20 text-primary-foreground'
              }`}
            >
              {champ.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-6">
        {standingsQuery.isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">A carregar classificações...</p>
          </div>
        )}

        {standingsQuery.isError && (
          <div className="text-center py-12 text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Não foi possível carregar os dados. Verifica se o backend está disponível.</p>
            <button 
              onClick={() => standingsQuery.refetch()}
              className="mt-4 px-6 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!standingsQuery.isLoading && !standingsQuery.isError && selectedData && (
          <motion.div
            key={activeChamp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <StandingsTable 
              standings={selectedData.classificacao} 
              titulo={`${selectedData.temporada} - ${championshipLabels[selectedData.campeonato] || selectedData.campeonato}`}
            />
          </motion.div>
        )}

        {!standingsQuery.isLoading && !standingsQuery.isError && !selectedData && (
          <EmptyState
            icon={AlertCircle}
            title="Sem classificação disponível"
            description="Este campeonato ainda não tem dados prontos para apresentação."
          />
        )}
      </main>
    </div>
  );
}
