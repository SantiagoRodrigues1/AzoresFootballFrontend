import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';
import { invalidateSession } from '@/utils/authSession';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Hook customizado para fetch com autenticação automática
 * Garante que o token JWT é enviado em todas as requisições protegidas
 */
export function useAuthFetch() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const fetchWithAuth = useCallback(
    async (endpoint: string, options: FetchOptions = {}) => {
      const { requiresAuth = true, ...fetchOptions } = options;

      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      };

      // Adicionar token se necessário e disponível
      if (requiresAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (requiresAuth && !token) {
        console.warn('⚠️ Endpoint protegido mas sem token disponível');
      }

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
        });

        // Verificar se a resposta é JSON antes de fazer parse
        const contentType = response.headers.get('content-type');
        const data = contentType?.includes('application/json')
          ? await response.json()
          : await response.text();

        // Log detalhado para debug
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            invalidateSession(response.status);
          }

          console.error(`❌ [${response.status}] ${endpoint}`, {
            error: data?.message || data?.error || data,
            requiresAuth,
            hasToken: !!token,
          });
        }

        return {
          ok: response.ok,
          status: response.status,
          data,
          error: !response.ok ? (data?.message || data?.error || 'Erro desconhecido') : null,
        };
      } catch (error) {
        console.error('❌ Erro na requisição:', endpoint, error);
        return {
          ok: false,
          status: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }
    },
    [token, API_URL]
  );

  return { fetchWithAuth, API_URL, token };
}
