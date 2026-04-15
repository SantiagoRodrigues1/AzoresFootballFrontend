import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Newspaper, RefreshCcw } from 'lucide-react';
import { MobilePage } from '@/components/layout/MobilePage';
import { NewsCard } from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { createNews, getNews } from '@/services/featureService';

export function NewsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Liga');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const query = useInfiniteQuery({
    queryKey: ['news-feed'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getNews(pageParam),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    }
  });

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      setTitle('');
      setCategory('Liga');
      setContent('');
      setImage('');
      queryClient.invalidateQueries({ queryKey: ['news-feed'] });
    }
  });

  const items = query.data?.pages.flatMap((entry) => entry.data) || [];

  return (
    <MobilePage
      title="Notícias"
      subtitle="Feed mobile-first com comentários e likes"
      actions={<Button variant="outline" size="icon" className="rounded-full" onClick={() => query.refetch()}><RefreshCcw className="h-4 w-4" /></Button>}
    >
      <div className="space-y-4">
        {user?.role === 'admin' ? (
          <section className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
            <h2 className="text-lg font-bold text-foreground">Publicar notícia</h2>
            <div className="mt-4 space-y-3">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título" className="rounded-full" />
              <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Categoria" className="rounded-full" />
              <Input value={image} onChange={(event) => setImage(event.target.value)} placeholder="URL da imagem" className="rounded-full" />
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Conteúdo da notícia" className="min-h-32 rounded-3xl" />
              <Button className="w-full rounded-full" onClick={() => createMutation.mutate({ title, category, image: image || null, content })} disabled={!title.trim() || !content.trim()}>
                Publicar notícia
              </Button>
            </div>
          </section>
        ) : null}
        {query.isLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-[28px]" />) : null}
        {!query.isLoading && !items.length ? (
          <div className="rounded-[28px] border border-dashed border-border p-10 text-center text-muted-foreground">
            <Newspaper className="mx-auto mb-3 h-8 w-8" /> Ainda não existem notícias.
          </div>
        ) : null}
        {items.map((item) => <NewsCard key={item._id} item={item} />)}
        {query.hasNextPage ? (
          <Button className="w-full rounded-full" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage}>
            {query.isFetchingNextPage ? 'A carregar...' : 'Carregar mais'}
          </Button>
        ) : null}
      </div>
    </MobilePage>
  );
}
