import { useAuth } from '@/contexts/AuthContext';

interface FetchOptions extends RequestInit {
  url: string;
}

export function useFetch() {
  const { token, logout } = useAuth();

  const fetchWithAuth = async (options: FetchOptions) => {
    const { url, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Se receber 401/403, invalidar a sessão do utilizador
      if (response.status === 401 || response.status === 403) {
        logout();
        return { error: response.status === 401 ? 'Sessão expirada' : 'Acesso negado', status: response.status };
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        return { error: error.message || 'Erro na requisição', status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return { error: String(error), status: 500 };
    }
  };

  return { fetchWithAuth };
}
