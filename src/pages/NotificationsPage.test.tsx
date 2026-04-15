// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationsPage } from './NotificationsPage';

vi.mock('@/services/featureService', () => ({
  getNotifications: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  markNotificationRead: vi.fn(),
  markNotificationUnread: vi.fn()
}));

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread
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
        <NotificationsPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getNotifications).mockResolvedValue([
      {
        _id: 'notif-1',
        titulo: 'Golo do Angrense',
        mensagem: 'O Angrense marcou aos 63 minutos.',
        lida: false,
        criadoEm: '2026-04-10T10:30:00.000Z'
      },
      {
        _id: 'notif-2',
        titulo: 'Submissão aprovada',
        mensagem: 'A tua submissão foi aprovada pelo administrador.',
        lida: true,
        criadoEm: '2026-04-10T11:30:00.000Z'
      }
    ]);
    vi.mocked(markAllNotificationsRead).mockResolvedValue(undefined);
    vi.mocked(markNotificationRead).mockImplementation(async (id) => ({
      _id: id,
      titulo: 'Golo do Angrense',
      mensagem: 'O Angrense marcou aos 63 minutos.',
      lida: true,
      criadoEm: '2026-04-10T10:30:00.000Z'
    }));
    vi.mocked(markNotificationUnread).mockImplementation(async (id) => ({
      _id: id,
      titulo: 'Submissão aprovada',
      mensagem: 'A tua submissão foi aprovada pelo administrador.',
      lida: false,
      criadoEm: '2026-04-10T11:30:00.000Z'
    }));
  });

  it('groups notifications by category and filters unread items', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Partidos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Submissões' })).toBeInTheDocument();
    expect(screen.getByText('1 por ler')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Por ler' }));

    expect(screen.getByText('Golo do Angrense')).toBeInTheDocument();
    expect(screen.queryByText('Submissão aprovada')).not.toBeInTheDocument();
  });

  it('marks a notification as read from the page', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Marcar lida' }));

    await waitFor(() => {
      expect(markNotificationRead).toHaveBeenCalledWith('notif-1');
    });
  });
});