// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerDetailPage } from './PlayerDetailPage';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('@/services/featureService', () => ({
  getPlayerById: vi.fn(),
  createEditRequest: vi.fn(),
  updatePlayer: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

import { useAuth } from '@/contexts/AuthContext';
import { createEditRequest, getPlayerById, updatePlayer } from '@/services/featureService';

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <MemoryRouter initialEntries={['/player/507f1f77bcf86cd799439011']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/player/:playerId" element={<PlayerDetailPage />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('PlayerDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL() {
        this.result = 'data:image/png;base64,AAAA';
        this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);
    if (!HTMLElement.prototype.hasPointerCapture) {
      HTMLElement.prototype.hasPointerCapture = () => false;
    }
    if (!HTMLElement.prototype.setPointerCapture) {
      HTMLElement.prototype.setPointerCapture = () => {};
    }
    if (!HTMLElement.prototype.releasePointerCapture) {
      HTMLElement.prototype.releasePointerCapture = () => {};
    }
    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = () => {};
    }
    vi.mocked(getPlayerById).mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'João Silva',
      numero: '9',
      position: 'Avançado',
      teamId: 'team-1',
      teamName: 'Santa Clara B',
      email: 'joao@example.com',
      goals: 7,
      assists: 3,
      photo: ''
    });
    vi.mocked(createEditRequest).mockResolvedValue({ _id: 'edit-1' } as never);
    vi.mocked(updatePlayer).mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as never);
  });

  it('lets a normal user submit a player edit request', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'fan' }, isAuthenticated: true } as never);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderPage();

    await user.click(await screen.findByRole('button', { name: /Request Edit/i }));
    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(screen.getByText('Nome'));
    fireEvent.change(screen.getByLabelText('Novo valor'), { target: { value: 'João Silva Confirmado' } });
    fireEvent.change(screen.getByLabelText('Justificação'), { target: { value: 'O jogador está a atuar como médio nas últimas jornadas.' } });
    await user.click(screen.getByRole('button', { name: 'Enviar pedido' }));

    await waitFor(() => {
      expect(createEditRequest).toHaveBeenCalledWith(expect.objectContaining({
        playerId: '507f1f77bcf86cd799439011',
        field: 'name',
        newValue: 'João Silva Confirmado'
      }));
    });
  }, 10000);

  it('uses the uploaded image as the new value when requesting a photo edit', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'fan' }, isAuthenticated: true } as never);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderPage();

    await user.click(await screen.findByRole('button', { name: /Request Edit/i }));
    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(screen.getByText('Foto'));
    fireEvent.change(screen.getByLabelText('Nova foto (ficheiro)'), {
      target: {
        files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })]
      }
    });
    fireEvent.change(screen.getByLabelText('Justificação'), { target: { value: 'A foto oficial do jogador foi atualizada recentemente.' } });
    await user.click(screen.getByRole('button', { name: 'Enviar pedido' }));

    await waitFor(() => {
      expect(createEditRequest).toHaveBeenCalledWith(expect.objectContaining({
        playerId: '507f1f77bcf86cd799439011',
        field: 'photo',
        newValue: 'data:image/png;base64,AAAA'
      }));
    });
  }, 10000);

  it('lets a team manager edit a player directly when owning the team', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'team_manager', assignedTeam: 'team-1' },
      isAuthenticated: true
    } as never);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderPage();

    await user.click(await screen.findByRole('button', { name: /Edit Player/i }));
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'João Silva Atualizado' } });
    await user.click(screen.getByRole('button', { name: 'Guardar alterações' }));

    await waitFor(() => {
      expect(updatePlayer).toHaveBeenCalledWith('507f1f77bcf86cd799439011', expect.objectContaining({ name: 'João Silva Atualizado' }));
    });
  }, 10000);
});