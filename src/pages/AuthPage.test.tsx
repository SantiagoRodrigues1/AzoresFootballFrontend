// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthPage } from './AuthPage';
import { useAuth } from '@/contexts/AuthContext';

const navigateMock = vi.fn();
const toastMock = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock })
}));

function renderPage() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthPage />
    </MemoryRouter>
  );
}

describe('AuthPage', () => {
  beforeEach(() => {
    cleanup();
    navigateMock.mockReset();
    toastMock.mockReset();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn()
    } as never);
  });

  it('submits login and navigates home on success', async () => {
    const loginMock = vi.fn().mockResolvedValue(true);
    vi.mocked(useAuth).mockReturnValue({
      login: loginMock,
      register: vi.fn()
    } as never);

    renderPage();

    fireEvent.change(screen.getByPlaceholderText('email@exemplo.com'), { target: { value: 'fan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Entrar' }).at(-1)!);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('fan@example.com', 'secret123');
    });

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: 'Bem-vindo!' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('submits register and shows error toast when it fails', async () => {
    const registerMock = vi.fn().mockResolvedValue(false);
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: registerMock
    } as never);

    renderPage();

    fireEvent.click(screen.getAllByRole('button', { name: 'Criar Conta' })[0]);
    fireEvent.change(screen.getByPlaceholderText('O seu nome'), { target: { value: 'Novo Utilizador' } });
    fireEvent.change(screen.getAllByPlaceholderText('email@exemplo.com').at(-1)!, { target: { value: 'novo@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Criar Conta' }).at(-1)!);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith('novo@example.com', 'secret123', 'Novo Utilizador', 'fan');
    });

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Erro',
      variant: 'destructive'
    }));
    expect(navigateMock).not.toHaveBeenCalled();
  });
});