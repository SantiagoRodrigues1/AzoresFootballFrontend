import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { MobilePage } from '@/components/layout/MobilePage';
import { CommentList } from '@/components/social/CommentList';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addNewsComment, getNewsById, getNewsComments, toggleCommentLike, toggleNewsLike, trackEntityView } from '@/services/featureService';

export function NewsDetailPage() {
  const { newsId = '' } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const newsQuery = useQuery({ queryKey: ['news', newsId], queryFn: async () => {
    const item = await getNewsById(newsId);
    await trackEntityView('news', newsId);
    return item;
  }});
  const commentsQuery = useQuery({ queryKey: ['news-comments', newsId], queryFn: () => getNewsComments(newsId), enabled: Boolean(newsId) });

  const likeMutation = useMutation({
    mutationFn: () => toggleNewsLike(newsId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news', newsId] })
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => addNewsComment(newsId, { content }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['news-comments', newsId] });
      queryClient.invalidateQueries({ queryKey: ['news', newsId] });
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ parentCommentId, content }: { parentCommentId: string; content: string }) => addNewsComment(newsId, { content, parentCommentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-comments', newsId] });
      queryClient.invalidateQueries({ queryKey: ['news', newsId] });
    }
  });

  const commentLikeMutation = useMutation({
    mutationFn: (id: string) => toggleCommentLike(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news-comments', newsId] })
  });

  const item = newsQuery.data;

  return (
    <MobilePage title={item?.title || 'Notícia'} subtitle={item?.category} backTo="/news">
      {item ? (
        <div className="space-y-6">
          {item.image ? <img src={item.image} alt={item.title} className="aspect-[16/10] w-full rounded-[32px] object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} /> : null}
          <div className="rounded-[32px] border border-border/70 bg-card p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{item.author?.name || 'Redação'}</span>
              <span>{new Date(item.createdAt).toLocaleString('pt-PT')}</span>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">{item.content}</p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="rounded-full" onClick={() => likeMutation.mutate()}><Heart className="mr-2 h-4 w-4" /> {item.likesCount}</Button>
              <div className="inline-flex items-center rounded-full border border-border px-4 text-sm text-muted-foreground"><MessageCircle className="mr-2 h-4 w-4" /> {item.commentsCount}</div>
            </div>
          </div>

          <section className="rounded-[32px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
            <h2 className="text-lg font-bold text-foreground">Comentários</h2>
            <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreve um comentário..." className="mt-4 min-h-24 rounded-3xl" />
            <div className="mt-3 flex justify-end">
              <Button className="rounded-full" onClick={() => commentMutation.mutate(comment)} disabled={!comment.trim()}>Comentar</Button>
            </div>
            <div className="mt-4">
              <CommentList comments={commentsQuery.data || []} onLike={(id) => commentLikeMutation.mutate(id)} onReply={(parentCommentId, content) => replyMutation.mutateAsync({ parentCommentId, content })} />
            </div>
          </section>
        </div>
      ) : null}
    </MobilePage>
  );
}
