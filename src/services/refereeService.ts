/**
 * refereeService.ts
 * Serviço para gerenciar operações com árbitros
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RefereeUser {
  id: string;
  name: string;
  email: string;
  federacao?: string;
  categoria?: string;
  avatar?: string;
}

/**
 * Obter lista de árbitros aprovados
 */
export const getApprovedReferees = async (token?: string): Promise<RefereeUser[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/users?role=referee&status=approved`, {
      headers
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Erro ao obter árbitros aprovados:', error);
    throw error;
  }
};

/**
 * Obter todos os árbitros (para admin)
 */
export const getAllReferees = async (token?: string): Promise<RefereeUser[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/users?role=referee`, {
      headers
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('❌ Erro ao obter árbitros:', error);
    throw error;
  }
};

/**
 * Obter detalhes de um árbitro específico
 */
export const getRefereeById = async (refereeId: string, token?: string): Promise<RefereeUser> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/users/${refereeId}`, {
      headers
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`❌ Erro ao obter árbitro ${refereeId}:`, error);
    throw error;
  }
};

/**
 * Obter dashboard do árbitro (estatísticas)
 */
export const getRefereeDashboard = async (token?: string) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/referee/dashboard`, {
      headers
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Erro ao obter dashboard do árbitro:', error);
    throw error;
  }
};

/**
 * Upload de relatório pós-jogo
 */
export const uploadMatchReport = async (
  matchId: string,
  formData: FormData,
  token?: string
): Promise<any> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/matches/${matchId}/report`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao fazer upload do relatório:`, error);
    throw error;
  }
};

/**
 * Confirmar presença do árbitro num jogo
 */
export const confirmRefereeAttendance = async (
  matchId: string,
  token?: string
): Promise<any> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/matches/${matchId}/confirm-attendance`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao confirmar presença:`, error);
    throw error;
  }
};

/**
 * Marcar como indisponível
 */
export const markRefereeUnavailable = async (
  matchId: string,
  token?: string
): Promise<any> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/matches/${matchId}/unavailable`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao marcar como indisponível:`, error);
    throw error;
  }
};

export default {
  getApprovedReferees,
  getAllReferees,
  getRefereeById,
  getRefereeDashboard,
  uploadMatchReport,
  confirmRefereeAttendance,
  markRefereeUnavailable
};
