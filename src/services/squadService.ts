// services/squadService.ts
import axios, { AxiosInstance } from 'axios';
import { invalidateSession } from '@/utils/authSession';
import { API_URL } from '@/services/api';

export interface Player {
  id: string;
  name: string;
  number: number;
  position?: string;
  teamId: string;
  stats?: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

class SquadService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para adicionar token JWT
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('azores_score_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          invalidateSession(status);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtém todos os jogadores de uma equipa
   */
  async getTeamSquad(teamId: string): Promise<Player[]> {
    try {
      const token = localStorage.getItem('azores_score_token');
      if (!token) {
        return [];
      }

      const response = await this.api.get<{
        success: boolean;
        data: Player[];
      }>(`/players/team/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data || [];
    } catch {
      return [];
    }
  }

  /**
   * Obtém detalhes completos do squad com estatísticas
   */
  async getTeamSquadWithStats(teamId: string): Promise<Player[]> {
    try {
      const token = localStorage.getItem('azores_score_token');
      if (!token) {
        return [];
      }

      const response = await this.api.get<{
        success: boolean;
        data: Player[];
      }>(`/players/team/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data || [];
    } catch {
      return [];
    }
  }

  /**
   * Obtém um jogador específico
   */
  async getPlayerById(playerId: string): Promise<Player | null> {
    try {
      const token = localStorage.getItem('azores_score_token');
      if (!token) {
        return null;
      }

      const response = await this.api.get<{
        success: boolean;
        data: Player;
      }>(`/players/${playerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data || null;
    } catch {
      return null;
    }
  }

  /**
   * Procura jogador por nome em um squad
   */
  searchPlayerByName(squad: Player[], name: string): Player | undefined {
    const searchLower = name.toLowerCase();
    return squad.find(p => 
      p.name.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Filtra jogadores por posição
   */
  filterByPosition(squad: Player[], position: string): Player[] {
    return squad.filter(p => p.position?.toLowerCase() === position.toLowerCase());
  }

  /**
   * Valida se um jogador existe no squad
   */
  playerExists(squad: Player[], playerId: string): boolean {
    return squad.some(p => p.id === playerId);
  }
}

// Singleton
export const squadService = new SquadService();
export default SquadService;
