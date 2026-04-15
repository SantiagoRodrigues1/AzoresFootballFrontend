import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquareDashed } from 'lucide-react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { MobilePage } from '@/components/layout/MobilePage';
import { PostComposer } from '@/components/community/PostComposer';
import { PostCard } from '@/components/community/PostCard';
import { createPost, addPostComment, createReport, getPostComments, getPosts, toggleCommentLike, togglePostLike } from '@/services/featureService';
import { queryKeys } from '@/lib/queryKeys';

export function CommunityPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const postsQuery = useQuery({
    queryKey: queryKeys.community.posts,
    queryFn: getPosts,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData
  });

  const postMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.posts }),
    onError: (error) => {
      toast({
        title: 'Publicação não enviada',
        description: error instanceof Error ? error.message : 'Não foi possível publicar na comunidade.',
        variant: 'destructive'
      });
    }
  });

  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.posts })
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => addPostComment(postId, { content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts });
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ postId, parentCommentId, content }: { postId: string; parentCommentId: string; content: string }) => addPostComment(postId, { content, parentCommentId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts });
    }
  });

  const commentLikeMutation = useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts });
    }
  });

  const reportMutation = useMutation({
    mutationFn: (postId: string) => createReport({ entityType: 'post', entityId: postId, reason: 'Conteúdo indevido' }),
    onSuccess: () => toast({ title: 'Publicação denunciada', description: 'A equipa de moderação vai rever este conteúdo.' })
  });

  const commentReportMutation = useMutation({
    mutationFn: (commentId: string) => createReport({ entityType: 'comment', entityId: commentId, reason: 'Comentário indevido' }),
    onSuccess: () => toast({ title: 'Comentário denunciado', description: 'A equipa de moderação vai rever este comentário.' })
  });

  return (
    <MobilePage title="Comunidade" subtitle="Feed social para adeptos e managers">
      <div className="space-y-4">
        <PostComposer onSubmit={async (payload) => postMutation.mutateAsync(payload)} />
        {postsQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-[28px]" />)}
          </div>
        ) : null}
        {!postsQuery.isLoading && !(postsQuery.data || []).length ? (
          <EmptyState
            icon={MessageSquareDashed}
            title="A comunidade ainda está silenciosa"
            description="A primeira publicação abre o feed para comentários, reações e denúncias moderadas."
          />
        ) : null}
        {(postsQuery.data || []).map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={(id) => likeMutation.mutate(id)}
            onComment={(id, content) => commentMutation.mutateAsync({ postId: id, content })}
            onReply={(id, parentCommentId, content) => replyMutation.mutateAsync({ postId: id, parentCommentId, content })}
            onCommentLike={(id) => commentLikeMutation.mutate(id)}
            onReport={(id) => reportMutation.mutate(id)}
            onCommentReport={(id) => commentReportMutation.mutate(id)}
            loadComments={() => getPostComments(post._id)}
          />
        ))}
      </div>
    </MobilePage>
  );
}
