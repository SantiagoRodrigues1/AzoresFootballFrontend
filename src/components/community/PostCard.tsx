import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Flag, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CommentList } from '@/components/social/CommentList';
import type { SocialComment, SocialPost } from '@/types/features';

interface PostCardProps {
  post: SocialPost;
  onLike: (id: string) => void;
  onComment: (id: string, content: string) => Promise<void>;
  onReply: (id: string, parentCommentId: string, content: string) => Promise<void>;
  onCommentLike?: (id: string) => void;
  onReport?: (id: string) => void;
  onCommentReport?: (id: string) => void;
  loadComments: () => Promise<SocialComment[]>;
}

export function PostCard({ post, onLike, onComment, onReply, onCommentLike, onReport, onCommentReport, loadComments }: PostCardProps) {
  const [draft, setDraft] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(post.commentsCount > 0 && post.commentsCount <= 2);
  const commentsQuery = useQuery({
    queryKey: ['community-comments', post._id],
    queryFn: loadComments,
    enabled: isCommentsOpen,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 border border-border">
          <AvatarFallback>{post.author?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">{post.author?.name || 'Utilizador'}</h3>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: pt })}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onReport?.(post._id)}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/90">{post.text}</p>
          {post.image ? <img src={post.image} alt="post" className="mt-4 aspect-[4/3] w-full rounded-3xl object-cover" /> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onLike(post._id)}>
              <Heart className="mr-2 h-4 w-4" /> {post.likesCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setIsCommentsOpen((current) => !current)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isCommentsOpen ? 'Ocultar comentários' : 'Ver comentários'}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{post.commentsCount}</span>
              {isCommentsOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-muted/40 p-3">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escreve um comentário..."
          className="min-h-20 rounded-3xl border-none bg-background shadow-none"
        />
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            className="rounded-full"
            disabled={!draft.trim()}
            onClick={async () => {
              setIsCommentsOpen(true);
              await onComment(post._id, draft.trim());
              setDraft('');
            }}
          >
            Responder
          </Button>
        </div>
      </div>

      {isCommentsOpen ? (
        <div className="mt-4">
          {commentsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: Math.min(Math.max(post.commentsCount, 1), 3) }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <CommentList
              comments={commentsQuery.data || []}
              onLike={onCommentLike}
              onReport={onCommentReport}
              onReply={(parentCommentId, content) => onReply(post._id, parentCommentId, content)}
            />
          )}
        </div>
      ) : null}
    </motion.article>
  );
}
