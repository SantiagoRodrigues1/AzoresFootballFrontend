// services/liveMatchService.ts
import axios, { AxiosInstance } from 'axios';
import { invalidateSession } from '@/utils/authSession';
import { API_URL } from '@/services/api';

// Types
export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  player?: {
    id: string;
    name: string;
    number: number;
  };
  assistedBy?: {
    id: string;
    name: string;
    number: number;
  };
  playerIn?: {
    id: string;
    name: string;
    number: number;
  };
  playerOut?: {
    id: string;
    name: string;
    number: number;
  };
  team: string;
  timestamp: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished' | 'postponed' | 'cancelled';
  addedTime: number;
  events: MatchEvent[];
  date: string;
  updatedAt: string;
}

export interface EventPayload {
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  playerId?: string;
  playerInId?: string;
  playerOutId?: string;
  assistId?: string;
}

export interface Lineup {
  _id: string;
  match: string;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  formation: string;
  starters: Array<{
    playerId: string;
    playerName: string;
    playerNumber: number;
    position: string;
  }>;
  substitutes: Array<{
    playerId: string;
    playerName: string;
    playerNumber: number;
    position: string;
    benchNumber: number;
  }>;
  status: string;
}

class LiveMatchService {
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
   * Helper para obter headers com token
   */
  private getHeaders() {
    const token = localStorage.getItem('azores_score_token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Inicia um jogo
   */
  async startMatch(matchId: string): Promise<Match> {
    try {
      const response = await this.api.post<{ success: boolean; data: Match }>(
        `/live-match/${matchId}/start`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Erro ao iniciar jogo');
    }
  }

  /**
   * Adiciona um evento ao jogo
   */
  async addEvent(matchId: string, event: EventPayload): Promise<Match> {
    try {
      const response = await this.api.post<{
        success: boolean;
        data: Match;
      }>(`/live-match/${matchId}/event`, event, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Erro ao adicionar evento');
    }
  }

  /**
   * Atualiza o status do jogo
   */
  async updateStatus(
    matchId: string,
    status: 'live' | 'halftime' | 'second_half' | 'finished' | 'postponed' | 'cancelled'
  ): Promise<Match> {
    try {
      const response = await this.api.post<{
        success: boolean;
        data: Match;
      }>(`/live-match/${matchId}/status`, { status }, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Erro ao atualizar status');
    }
  }

  /**
   * Termina o jogo
   */
  async finishMatch(matchId: string, league: string, season: string): Promise<Match> {
    try {
      const response = await this.api.post<{
        success: boolean;
        data: Match;
      }>(`/live-match/${matchId}/finish`, { league, season }, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Erro ao terminar jogo');
    }
  }

  /**
   * Adiciona tempo adicional
   */
  async addAddedTime(matchId: string, minutes: number): Promise<Match> {
    try {
      const response = await this.api.post<{
        success: boolean;
        data: Match;
      }>(`/live-match/${matchId}/added-time`, { minutes }, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Erro ao adicionar tempo');
    }
  }

  /**
   * Obtém detalhes do jogo.
   * Devolve o match e a flag canEdit calculada pelo servidor.
   */
  async getMatchDetails(matchId: string): Promise<{ match: Match; canEdit: boolean }> {
    try {
      const token = localStorage.getItem('azores_score_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await this.api.get<{
        success: boolean;
        data: Match;
        permissions?: { canEdit: boolean };
      }>(`/live-match/${matchId}`, { headers });
      return {
        match: response.data.data,
        canEdit: response.data.permissions?.canEdit ?? false,
      };
    } catch (error) {
      this.handleError(error, 'Erro ao obter detalhes do jogo');
    }
  }

  /**
   * Busca a escalação de uma equipa num jogo
   */
  async getLineup(matchId: string, teamId: string): Promise<Lineup | null> {
    try {
      const token = localStorage.getItem('azores_score_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await this.api.get<{
        success: boolean;
        data: Lineup;
      }>(`/live-match/${matchId}/lineup/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      this.handleError(error, 'Erro ao obter escalação');
    }
  }

  /**
   * Busca as escalações de ambas as equipas
   */
  async getMatchLineups(matchId: string) {
    try {
      const token = localStorage.getItem('azores_score_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await this.api.get<{
        success: boolean;
        data: {
          homeTeam: Team;
          awayTeam: Team;
          lineups: Lineup[];
        };
      }>(`/live-match/${matchId}/lineups`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      this.handleError(error, 'Erro ao obter escalações');
    }
  }

  /**
   * Handler de erros
   */
  private handleError(error: unknown, defaultMessage: string): never {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || defaultMessage;
    throw new Error(message);
  }
}

// Singleton
export const liveMatchService = new LiveMatchService();
export default LiveMatchService;
