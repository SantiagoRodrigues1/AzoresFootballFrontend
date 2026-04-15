// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NotificationCard } from './NotificationCard';

describe('NotificationCard', () => {
  it('renders unread notifications and toggles to read', async () => {
    const onToggleRead = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationCard
        item={{
          _id: 'notif-1',
          titulo: 'Golo do Angrense',
          mensagem: 'O Angrense marcou aos 63 minutos.',
          lida: false,
          criadoEm: '2026-04-10T10:30:00.000Z'
        }}
        onToggleRead={onToggleRead}
      />
    );

    expect(screen.getByText('Golo do Angrense')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar lida' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Marcar lida' }));

    expect(onToggleRead).toHaveBeenCalledWith('notif-1', false);
  });

  it('renders read notifications and allows marking as unread', async () => {
    const onToggleRead = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationCard
        item={{
          _id: 'notif-2',
          titulo: 'Resultado final',
          mensagem: 'O jogo terminou 2-1.',
          lida: true,
          criadoEm: '2026-04-10T11:30:00.000Z'
        }}
        onToggleRead={onToggleRead}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Marcar por ler' }));

    expect(onToggleRead).toHaveBeenCalledWith('notif-2', true);
  });
});