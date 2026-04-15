// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommunityPage } from './CommunityPage';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

vi.mock('@/components/community/PostComposer', () => ({
  PostComposer: () => <div data-testid="post-composer" />
}));

vi.mock('@/services/featureService', () => ({
  getPosts: vi.fn(),
  getPostComments: vi.fn(),
  createPost: vi.fn(),
  addPostComment: vi.fn(),
  createReport: vi.fn(),
  toggleCommentLike: vi.fn(),
  togglePostLike: vi.fn()
}));

import {
  addPostComment,
  createPost,
  createReport,
  getPostComments,
  getPosts,
  toggleCommentLike,
  togglePostLike
} from '@/services/featureService';

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <CommunityPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('CommunityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPosts).mockResolvedValue([
      {
        _id: 'post-1',
        text: 'Grande vitória no derby açoriano.',
        image: null,
        likesCount: 8,
        commentsCount: 4,
        reportsCount: 0,
        createdAt: '2026-04-10T11:00:00.000Z',
        author: { id: 'user-1', name: 'Maria Silva' }
      }
    ]);
    vi.mocked(getPostComments).mockResolvedValue([
      {
        _id: 'comment-1',
        entityType: 'post',
        entityId: 'post-1',
        content: 'Que exibição.',
        likesCount: 2,
        repliesCount: 0,
        createdAt: '2026-04-10T11:05:00.000Z',
        author: { id: 'user-2', name: 'João Costa' }
      }
    ]);
    vi.mocked(createPost).mockResolvedValue({} as never);
    vi.mocked(addPostComment).mockResolvedValue({} as never);
    vi.mocked(createReport).mockResolvedValue({} as never);
    vi.mocked(toggleCommentLike).mockResolvedValue({ liked: true });
    vi.mocked(togglePostLike).mockResolvedValue({ liked: true });
  });

  it('loads comments only when the user opens them', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText('Grande vitória no derby açoriano.')).toBeInTheDocument();
    expect(getPostComments).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Ver comentários/i }));

    await waitFor(() => {
      expect(getPostComments).toHaveBeenCalledWith('post-1');
    });

    expect(await screen.findByText('Que exibição.')).toBeInTheDocument();
  });
});