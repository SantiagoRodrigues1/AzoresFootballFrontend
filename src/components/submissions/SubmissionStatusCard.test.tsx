// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubmissionStatusCard } from './SubmissionStatusCard';

describe('SubmissionStatusCard', () => {
  it('renders approved submission details and review note', () => {
    render(
      <SubmissionStatusCard
        item={{
          _id: 'submission-1',
          type: 'player',
          data: { name: 'João Silva' },
          status: 'approved',
          reviewNote: 'Dados validados com sucesso.',
          createdAt: '2026-04-10T09:00:00.000Z'
        }}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Aprovada')).toBeInTheDocument();
    expect(screen.getByText('Dados validados com sucesso.')).toBeInTheDocument();
  });
});