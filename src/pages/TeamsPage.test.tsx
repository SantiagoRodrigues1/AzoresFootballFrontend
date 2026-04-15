// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TeamsPage } from './TeamsPage';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('@/components/admin/CreateTeamModal', () => ({
  CreateTeamModal: () => null
}));

import { useAuth } from '@/contexts/AuthContext';

describe('TeamsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ user: null, token: null } as never);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'team-1',
            name: 'Fayal',
            campeonato: 'campeonato_horta'
          },
          {
            _id: 'team-2',
            equipa: 'SC Barreiro',
            campeonato: 'campeonato_terceira'
          }
        ]
      })
    );
  });

  it('renders name fallback data and filters by championship', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Fayal')).toBeInTheDocument();
    expect(screen.getByText('SC Barreiro')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Horta' }));

    await waitFor(() => {
      expect(screen.getByText('Fayal')).toBeInTheDocument();
      expect(screen.queryByText('SC Barreiro')).not.toBeInTheDocument();
    });
  });
});
