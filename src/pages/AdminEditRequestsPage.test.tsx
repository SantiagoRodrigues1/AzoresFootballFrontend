// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminEditRequestsPage } from './AdminEditRequestsPage';

vi.mock('@/services/featureService', () => ({
  getAdminEditRequests: vi.fn(),
  approveEditRequest: vi.fn(),
  rejectEditRequest: vi.fn()
}));

import { approveEditRequest, getAdminEditRequests, rejectEditRequest } from '@/services/featureService';

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
        <AdminEditRequestsPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('AdminEditRequestsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminEditRequests).mockResolvedValue([
      {
        _id: 'edit-1',
        field: 'position',
        fieldLabel: 'Posição',
        oldValue: 'Avançado',
        newValue: 'Médio',
        justification: 'Mudança tática confirmada.',
        status: 'pending',
        playerId: { _id: 'player-1', name: 'João Silva' },
        userId: { _id: 'user-1', name: 'Carlos Adepto', email: 'carlos@example.com' },
        createdAt: '2026-04-11T10:00:00.000Z'
      }
    ] as never);
    vi.mocked(approveEditRequest).mockResolvedValue({ _id: 'edit-1' } as never);
    vi.mocked(rejectEditRequest).mockResolvedValue({ _id: 'edit-1' } as never);
  });

  it('renders pending edit requests and approves one', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText('João Silva')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Nota opcional para aprovação ou rejeição'), 'Confirmado pelo staff.');
    await user.click(screen.getByRole('button', { name: 'Aprovar' }));

    await waitFor(() => {
      expect(approveEditRequest).toHaveBeenCalledWith('edit-1', { reviewNote: 'Confirmado pelo staff.' });
    });
  });
});