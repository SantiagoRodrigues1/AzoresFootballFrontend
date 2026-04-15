// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminRoute } from '@/guards/AdminRoute';

const useAuthMock = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/admin-panel']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<div>home-page</div>} />
        <Route path="/auth" element={<div>auth-page</div>} />
        <Route
          path="/admin-panel"
          element={
            <AdminRoute>
              <div>admin-panel-page</div>
            </AdminRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('App protected admin routes', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('redirects a non-admin user away from /admin-panel', async () => {
    useAuthMock.mockReturnValue({
      user: { role: 'fan' },
      isAuthenticated: true,
      isLoading: false
    });

    renderProtectedRoute();

    expect(screen.getByText('home-page')).toBeInTheDocument();
    expect(screen.queryByText('admin-panel-page')).not.toBeInTheDocument();
  });

  it('allows an admin user to access /admin-panel', async () => {
    useAuthMock.mockReturnValue({
      user: { role: 'admin' },
      isAuthenticated: true,
      isLoading: false
    });

    renderProtectedRoute();

    expect(screen.getByText('admin-panel-page')).toBeInTheDocument();
  });
});