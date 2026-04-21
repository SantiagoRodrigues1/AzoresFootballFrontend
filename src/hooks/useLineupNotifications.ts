import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/services/api';

export interface Notification {
  id: string;
  type: 'lineup' | 'match' | 'info';
  title: string;
  message: string;
  matchId: string;
  teamId: string;
  teamName: string;
  timestamp: Date;
  read: boolean;
}

export function useLineupNotifications(token?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/team-manager/notifications/lineups`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar notificações');
      }

      const data = await response.json();
      setNotifications(
        data.data.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    clearAll
  };
}

export function useFavoriteTeams(token?: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.data.map((team: any) => team._id));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = async (teamId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/user/favorites/check/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.isFavorite;
      }
    } catch {
    }

    return false;
  };

  const toggleFavorite = async (teamId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/user/favorites/toggle/${teamId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newFavorites = data.data.favoriteTeams || [];
        setFavorites(newFavorites);
        return data.data.isFavorite;
      }
    } catch {
    }

    return false;
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  return {
    favorites,
    loading,
    checkIsFavorite,
    toggleFavorite,
    refetchFavorites: fetchFavorites
  };
}
