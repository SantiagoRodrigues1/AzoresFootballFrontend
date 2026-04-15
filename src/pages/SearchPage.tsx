import { useState } from 'react';
import { MobilePage } from '@/components/layout/MobilePage';
import { SearchAutocomplete } from '@/components/discovery/SearchAutocomplete';
import { TrendingPanel } from '@/components/discovery/TrendingPanel';
import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/services/featureService';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    staleTime: 60_000,
    placeholderData: (previousData) => previousData
  });

  return (
    <MobilePage title="Pesquisa inteligente" subtitle="Autocomplete para jogadores, equipas e notícias" backTo="/more">
      <div className="space-y-5">
        <SearchAutocomplete query={query} onQueryChange={setQuery} />
        <TrendingPanel trending={trendingQuery.data} />
      </div>
    </MobilePage>
  );
}
