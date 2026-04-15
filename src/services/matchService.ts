/**
 * matchService.ts
 * Serviço para gerenciar operações com jogos
 */

import { API_URL, api } from '@/services/api';

export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
  };
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
  date: string;
  venue: string;
  competition: string;
  referees?: {
    main?: string;
    assistant1?: string;
    assistant2?: string;
    fourthReferee?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface RefereeAssignment {
  main: string;        // ID do árbitro principal
  assistant1: string;  // ID do assistente 1
  assistant2: string;  // ID do assistente 2
  fourthReferee: string; // ID do 4º árbitro
}

/**
 * Obter todos os jogos
 */
export const getAllMatches = async (token?: string): Promise<Match[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/matches`, { headers });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Erro ao obter jogos:', error);
    throw error;
  }
};

/**
 * Obter jogos atribuídos a um árbitro
 */
export const getRefereeMatches = async (refereeId: string, token?: string): Promise<Match[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/referee/${refereeId}/matches`, { headers });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error(`❌ Erro ao obter jogos do árbitro:`, error);
    throw error;
  }
};

/**
 * Obter detalhes de um jogo específico
 */
export const getMatchById = async (matchId: string, token?: string): Promise<Match> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/matches/${matchId}`, { headers });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`❌ Erro ao obter jogo ${matchId}:`, error);
    throw error;
  }
};

/**
 * Atribuir árbitros a um jogo (ADMIN)
 * 
 * @param matchId - ID do jogo
 * @param assignment - Objeto com IDs dos árbitros (main, assistant1, assistant2, fourthReferee)
 * @param token - Token JWT
 */
export const assignRefereesToMatch = async (
  matchId: string,
  assignment: RefereeAssignment,
  token?: string
): Promise<any> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.put(`/admin/matches/${matchId}/referees`, assignment, { headers });
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao atribuir árbitros:`, error);
    throw error;
  }
};

/**
 * Obter jogos sem árbitros atribuídos (para admin)
 */
export const getMatchesWithoutReferees = async (token?: string): Promise<Match[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/matches?referees=missing`, { headers });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Erro ao obter jogos sem árbitros:', error);
    throw error;
  }
};

/**
 * Filtrar jogos por status
 */
export const getMatchesByStatus = async (
  status: 'scheduled' | 'live' | 'finished' | 'postponed',
  token?: string
): Promise<Match[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/matches?status=${status}`, { headers });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error(`❌ Erro ao obter jogos com status ${status}:`, error);
    throw error;
  }
};

/**
 * Obter todos os jogos (ADMIN)
 * Usa o endpoint protegido /admin/matches e requer token
 */
export const getAllAdminMatches = async (token?: string): Promise<Match[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get(`/admin/matches`, { headers });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Erro ao obter jogos (admin):', error);
    throw error;
  }
};

export default {
  getAllMatches,
  getRefereeMatches,
  getMatchById,
  assignRefereesToMatch,
  getMatchesWithoutReferees,
  getMatchesByStatus
  ,getAllAdminMatches
};
