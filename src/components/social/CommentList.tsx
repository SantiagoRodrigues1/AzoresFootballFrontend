import { useState } from 'react';
import { Heart, CornerDownRight, Flag, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import type { SocialComment } from '@/types/features';

export function CommentList({ comments, onLike, onReport, onReply }: { comments: SocialComment[]; onLike?: (id: string) => void; onReport?: (id: string) => void; onReply?: (parentCommentId: string, content: string) => Promise<void> }) {
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const sortedComments = [...comments].sort((first, second) => {
    if (!first.parentCommentId && second.parentCommentId) return -1;
    if (first.parentCommentId && !second.parentCommentId) return 1;
    return new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedComments.map((comment) => {
        const isReply = Boolean(comment.parentCommentId);
        return (
          <div
            key={comment._id}
            className={`rounded-2xl border border-border/70 bg-card p-4 ${isReply ? 'ml-6' : ''}`}
          >
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback>{comment.author?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {isReply ? <CornerDownRight className="h-4 w-4 text-muted-foreground" /> : null}
                  <span>{comment.author?.name || 'Utilizador'}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{comment.content}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-3" onClick={() => onLike?.(comment._id)}>
                    <Heart className="mr-2 h-4 w-4" /> {comment.likesCount}
                  </Button>
                  {onReply ? (
                    <Button variant="ghost" size="sm" className="h-8 rounded-full px-3" onClick={() => {
                      setReplyTarget(comment._id);
                      setReplyDraft('');
                    }}>
                      <Reply className="mr-2 h-4 w-4" /> Responder
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-3" onClick={() => onReport?.(comment._id)}>
                    <Flag className="mr-2 h-4 w-4" /> Denunciar
                  </Button>
                </div>
                {replyTarget === comment._id && onReply ? (
                  <div className="mt-3 rounded-2xl bg-muted/40 p-3">
                    <Textarea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      placeholder="Escreve uma resposta..."
                      className="min-h-20 rounded-2xl border-none bg-background shadow-none"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="rounded-full" onClick={() => {
                        setReplyTarget(null);
                        setReplyDraft('');
                      }}>
                        Cancelar
                      </Button>
                      <Button size="sm" className="rounded-full" disabled={!replyDraft.trim()} onClick={async () => {
                        await onReply(comment._id, replyDraft.trim());
                        setReplyTarget(null);
                        setReplyDraft('');
                      }}>
                        Enviar resposta
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
