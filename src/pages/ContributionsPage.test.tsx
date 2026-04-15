// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContributionsPage } from './ContributionsPage';

const toastMock = vi.fn();

vi.mock('@/components/ui/select', async () => {
  const React = await import('react');
  const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
  }>({});

  function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
    return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
  }

  function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
  }

  function SelectValue() {
    const context = React.useContext(SelectContext);
    return <span>{context.value}</span>;
  }

  function SelectContent({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  }

  function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
    const context = React.useContext(SelectContext);
    return (
      <button type="button" onClick={() => context.onValueChange?.(value)}>
        {children}
      </button>
    );
  }

  return {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock })
}));

vi.mock('@/services/featureService', () => ({
  createSubmission: vi.fn(),
  getMySubmissions: vi.fn(),
  getMyUploads: vi.fn(),
  searchPlayers: vi.fn(),
  searchTeams: vi.fn(),
  uploadPlayerImage: vi.fn()
}));

import {
  createSubmission,
  getMySubmissions,
  getMyUploads,
  searchPlayers,
  searchTeams,
  uploadPlayerImage
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
        <ContributionsPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('ContributionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (!HTMLElement.prototype.hasPointerCapture) {
      HTMLElement.prototype.hasPointerCapture = () => false;
    }
    if (!HTMLElement.prototype.setPointerCapture) {
      HTMLElement.prototype.setPointerCapture = () => {};
    }
    if (!HTMLElement.prototype.releasePointerCapture) {
      HTMLElement.prototype.releasePointerCapture = () => {};
    }
    vi.mocked(getMySubmissions).mockResolvedValue([]);
    vi.mocked(getMyUploads).mockResolvedValue([]);
    vi.mocked(searchPlayers).mockResolvedValue([]);
    vi.mocked(searchTeams).mockResolvedValue([]);
    vi.mocked(uploadPlayerImage).mockResolvedValue({} as never);
    vi.mocked(createSubmission).mockResolvedValue({
      _id: 'submission-1',
      type: 'team',
      data: {},
      status: 'pending',
      createdAt: '2026-04-10T12:00:00.000Z'
    });
  });

  it('submits a team contribution from the page form', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Equipa' }));

    await user.type(await screen.findByPlaceholderText('Ex: União Micaelense'), 'Atlético Açoriano');
    await user.type(screen.getAllByPlaceholderText('Opcional')[1], 'Campo do Mar');
    await user.type(screen.getByPlaceholderText('História, contexto competitivo e o que deve ser validado.'), 'Clube histórico com forte presença regional.');

    await user.click(screen.getByRole('button', { name: /Enviar para revisão/i }));

    await waitFor(() => {
      expect(createSubmission).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'team',
          data: expect.objectContaining({
            name: 'Atlético Açoriano',
            island: 'Açores',
            stadium: 'Campo do Mar',
            description: 'Clube histórico com forte presença regional.'
          })
        })
      );
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Contribuição enviada' })
    );
  });
});