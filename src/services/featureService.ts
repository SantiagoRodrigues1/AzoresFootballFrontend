import { AxiosError } from 'axios';
import { api } from './api';
import type {
  Achievement,
  AppNotification,
  FavoriteTeam,
  ImageUpload,
  NewsItem,
  PlayerEditRequest,
  PlayerProfile,
  SearchResults,
  SocialComment,
  SocialPost,
  Submission,
  TeamListItem
} from '@/types/features';

export interface ChampionshipStanding {
  campeonato: string;
  temporada: string;
  classificacao: Array<Record<string, unknown>>;
  proximos_jogos?: Array<{ jogos: Array<Record<string, unknown>> }>;
  melhores_marcadores?: Array<Record<string, unknown>>;
  status?: string;
}

function toApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof AxiosError) {
    const responseErrors = error.response?.data?.errors;
    if (Array.isArray(responseErrors) && responseErrors.length) {
      return new Error(responseErrors.join(' '));
    }

    if (typeof error.response?.data?.message === 'string' && error.response.data.message.trim()) {
      return new Error(error.response.data.message);
    }
  }

  return error instanceof Error ? error : new Error(fallbackMessage);
}

export async function getNews(page = 1) {
  const { data } = await api.get('/news', { params: { page, limit: 10 } });
  return data as { data: NewsItem[]; pagination: { page: number; totalPages: number } };
}

export async function getNewsById(id: string) {
  const { data } = await api.get(`/news/${id}`);
  return data.data as NewsItem;
}

export async function createNews(payload: Partial<NewsItem>) {
  const { data } = await api.post('/news', payload);
  return data.data as NewsItem;
}

export async function toggleNewsLike(id: string) {
  const { data } = await api.post(`/news/${id}/like`);
  return data.data as { liked: boolean };
}

export async function getNewsComments(id: string) {
  const { data } = await api.get(`/news/${id}/comments`);
  return data.data as SocialComment[];
}

export async function addNewsComment(id: string, payload: { content: string; parentCommentId?: string | null }) {
  const { data } = await api.post(`/news/${id}/comments`, payload);
  return data.data as SocialComment;
}

export async function getPosts() {
  const { data } = await api.get('/community/posts');
  return data.data as SocialPost[];
}

export async function getCommunityProfile(userId: string) {
  const { data } = await api.get(`/community/profiles/${userId}`);
  return data.data as {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    role?: string;
    createdAt?: string;
    postsCount: number;
    achievements: Achievement[];
  };
}

export async function createPost(payload: { text: string; image?: string | null }) {
  try {
    const { data } = await api.post('/community/posts', payload);
    return data.data as SocialPost;
  } catch (error) {
    throw toApiError(error, 'Não foi possível publicar na comunidade.');
  }
}

export async function togglePostLike(id: string) {
  const { data } = await api.post(`/community/posts/${id}/like`);
  return data.data as { liked: boolean };
}

export async function getPostComments(id: string) {
  const { data } = await api.get(`/community/posts/${id}/comments`);
  return data.data as SocialComment[];
}

export async function addPostComment(id: string, payload: { content: string; parentCommentId?: string | null }) {
  const { data } = await api.post(`/community/posts/${id}/comments`, payload);
  return data.data as SocialComment;
}

export async function toggleCommentLike(id: string) {
  const { data } = await api.post(`/community/comments/${id}/like`);
  return data.data as { liked: boolean };
}

export async function createSubmission(payload: { type: string; data: Record<string, unknown> }) {
  const { data } = await api.post('/submissions', payload);
  return data.data as Submission;
}

export async function getMySubmissions() {
  const { data } = await api.get('/submissions/mine');
  return data.data as Submission[];
}

export async function getAdminSubmissions() {
  const { data } = await api.get('/submissions/admin/review');
  return data.data as Submission[];
}

export async function reviewSubmission(id: string, payload: { status: 'approved' | 'rejected'; reviewNote?: string }) {
  const { data } = await api.post(`/submissions/admin/review/${id}`, payload);
  return data.data as Submission;
}

export async function uploadPlayerImage(payload: { playerId: string; imageBase64: string }) {
  const { data } = await api.post('/images', payload);
  return data.data as ImageUpload;
}

export async function getMyUploads() {
  const { data } = await api.get('/images/mine');
  return data.data as ImageUpload[];
}

export async function getAdminUploads() {
  const { data } = await api.get('/images/admin/review');
  return data.data as ImageUpload[];
}

export async function reviewImageUpload(id: string, payload: { status: 'approved' | 'rejected'; moderationNote?: string }) {
  const { data } = await api.post(`/images/admin/review/${id}`, payload);
  return data.data as ImageUpload;
}

export async function getFavoriteTeams() {
  const { data } = await api.get('/user/favorites');
  return data.data as FavoriteTeam[];
}

export async function toggleFavoriteTeam(teamId: string) {
  const { data } = await api.post(`/user/favorites/toggle/${teamId}`);
  return data.data as { isFavorite: boolean };
}

export async function updateFavoriteSettings(teamId: string, notifications: FavoriteTeam['notifications']) {
  const { data } = await api.put(`/user/favorites/settings/${teamId}`, { notifications });
  return data.data as FavoriteTeam;
}

export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data.data as AppNotification[];
}

export async function getPlayerById(id: string) {
  const { data } = await api.get(`/players/${id}`);
  const player = data.data as PlayerProfile & { id?: string; team?: string | null };

  return {
    ...player,
    _id: player._id || player.id || '',
    id: player.id || player._id || '',
    teamId: player.teamId || player.team || null,
    photo: player.photo || player.image || null,
    image: player.image || player.photo || null,
    name: player.name || player.nome || 'Sem nome'
  } as PlayerProfile;
}

export async function updatePlayer(id: string, payload: { name: string; numero: string; position: string; email?: string; photo?: string }) {
  const { data } = await api.put(`/players/${id}`, payload);
  return data.data as PlayerProfile;
}

export async function createEditRequest(payload: {
  playerId: string;
  field: 'name' | 'numero' | 'position' | 'email' | 'nickname' | 'photo';
  newValue: string | number;
  justification: string;
  proof?: { type: 'link' | 'image'; value: string } | null;
}) {
  try {
    const { data } = await api.post('/edit-requests', payload);
    return data.data as PlayerEditRequest;
  } catch (error) {
    throw toApiError(error, 'Não foi possível enviar o pedido de edição.');
  }
}

export async function getMyEditRequests() {
  const { data } = await api.get('/edit-requests/mine');
  return data.data as PlayerEditRequest[];
}

export async function getAdminEditRequests(status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending') {
  const { data } = await api.get('/edit-requests', { params: { status } });
  return (data.data as PlayerEditRequest[]).map((item) => ({
    ...item,
    fieldLabel: {
      name: 'Nome',
      numero: 'Número',
      position: 'Posição',
      email: 'Email',
      nickname: 'Alcunha',
      photo: 'Foto'
    }[item.field] || item.field
  }));
}

export async function approveEditRequest(id: string, payload: { reviewNote?: string }) {
  const { data } = await api.put(`/edit-requests/${id}/approve`, payload);
  return data.data as PlayerEditRequest;
}

export async function rejectEditRequest(id: string, payload: { reviewNote?: string }) {
  const { data } = await api.put(`/edit-requests/${id}/reject`, payload);
  return data.data as PlayerEditRequest;
}

export async function markNotificationRead(id: string) {
  const { data } = await api.post(`/notifications/${id}/read`);
  return data.data as AppNotification;
}

export async function markNotificationUnread(id: string) {
  const { data } = await api.post(`/notifications/${id}/unread`);
  return data.data as AppNotification;
}

export async function markAllNotificationsRead() {
  await api.post('/notifications/read-all');
}

export async function createPremiumCheckoutSession() {
  try {
    const { data } = await api.post('/billing/checkout-session');
    return data.data as { sessionId: string; url: string };
  } catch (error) {
    throw toApiError(error, 'Não foi possível iniciar o checkout premium.');
  }
}

export async function confirmPremiumCheckoutSession(sessionId: string) {
  try {
    const { data } = await api.post('/billing/checkout-session/confirm', { sessionId });
    return data.data as { sessionId: string; user?: import('@/types').User };
  } catch (error) {
    throw toApiError(error, 'Não foi possível confirmar o pagamento premium.');
  }
}

export async function getBillingStatus() {
  const { data } = await api.get('/billing/status');
  return data.data as { user: import('@/types').User };
}

export async function getTrending() {
  const { data } = await api.get('/discovery/trending');
  return data.data as {
    players: Array<{ views: number; entity: Record<string, unknown> }>;
    teams: Array<{ views: number; entity: Record<string, unknown> }>;
    news: Array<{ views: number; entity: NewsItem }>;
  };
}

export async function searchEverything(query: string) {
  const { data } = await api.get('/discovery/search', { params: { q: query, limit: 6 } });
  return data.data as SearchResults;
}

export async function searchPlayers(query: string) {
  const data = await searchEverything(query);
  return data.players as Array<{
    _id: string;
    name?: string;
    nome?: string;
    position?: string;
    team?: string;
    teamName?: string;
  }>;
}

export async function searchTeams(query: string) {
  const data = await searchEverything(query);
  return data.teams as Array<{
    _id: string;
    name?: string;
    equipa?: string;
    island?: string;
  }>;
}

export async function comparePlayers(firstPlayerId: string, secondPlayerId: string) {
  const { data } = await api.get('/discovery/compare/players', { params: { firstPlayerId, secondPlayerId } });
  return data.data;
}

export async function searchPlayersForComparison(params: { name?: string; team?: string; limit?: number }) {
  const { data } = await api.get('/discovery/players', {
    params: {
      name: params.name || undefined,
      team: params.team || undefined,
      limit: params.limit || 40
    }
  });

  return data.data as Array<{
    _id: string;
    id: string;
    name: string;
    nome?: string;
    numero?: string;
    position?: string;
    teamId?: string | null;
    teamName?: string | null;
    photo?: string | null;
  }>;
}

export async function getAchievements() {
  const { data } = await api.get('/discovery/achievements/me');
  return data.data as Achievement[];
}

export async function getStandings() {
  const { data } = await api.get('/standings');
  return data as ChampionshipStanding[];
}

export async function getMatchesByCompetition() {
  const { data } = await api.get('/matches-by-competition');
  return data as ChampionshipStanding[];
}

export async function getTeamManagerMatch(id: string) {
  const { data } = await api.get(`/team-manager/matches/${id}`);
  return data as {
    id: string;
    homeTeam: { id: string; name: string };
    awayTeam: { id: string; name: string };
    date: string;
    status: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished';
  };
}

// ===========================
// JOURNALIST REQUESTS
// ===========================

export async function submitJournalistRequest(payload: { name: string; company: string }) {
  const { data } = await api.post('/journalist/request', payload);
  return data.data;
}

export async function getMyJournalistRequest() {
  const { data } = await api.get('/journalist/my-request');
  return data.data as { _id: string; name: string; company: string; status: 'pending' | 'approved' | 'rejected'; rejectionReason?: string | null; createdAt: string } | null;
}

export async function getMyJournalistNews() {
  const { data } = await api.get('/journalist/my-news');
  return data.data as NewsItem[];
}

// ===========================
// ADMIN — JOURNALIST REQUESTS
// ===========================

export async function getAdminJournalistRequests(status?: string) {
  const params = status ? { status } : {};
  const { data } = await api.get('/journalist/admin/requests', { params });
  return data.data as Array<{
    _id: string;
    userId: { _id: string; name: string; email: string; role: string; avatar?: string | null };
    name: string;
    company: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: { name: string } | null;
    reviewedAt?: string | null;
    rejectionReason?: string | null;
    createdAt: string;
  }>;
}

export async function approveJournalistRequest(id: string) {
  const { data } = await api.put(`/journalist/admin/requests/${id}/approve`);
  return data.data;
}

export async function rejectJournalistRequest(id: string, reason?: string) {
  const { data } = await api.put(`/journalist/admin/requests/${id}/reject`, { reason });
  return data.data;
}

// ===========================
// ADMIN — USER MANAGEMENT
// ===========================

export async function getAdminUsers(params?: { role?: string; search?: string; page?: number }) {
  const { data } = await api.get('/journalist/admin/users', { params });
  return data as {
    data: Array<{ _id: string; name: string; email: string; role: string; plan: string; status: string; avatar?: string | null; createdAt: string }>;
    pagination: { page: number; totalPages: number; total: number };
  };
}

export async function changeUserRole(userId: string, role: string) {
  const { data } = await api.put(`/journalist/admin/users/${userId}/role`, { role });
  return data.data;
}

export async function createAdminUser(payload: { name: string; email: string; password: string; role: string }) {
  const { data } = await api.post('/journalist/admin/users', payload);
  return data.data;
}

export async function getTeamManagerLineup(matchId: string, teamId: string) {
  try {
    const { data } = await api.get(`/team-manager/lineups/${matchId}/${teamId}`);
    return data.data as Record<string, unknown> | null;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function startLiveMatch(matchId: string) {
  const { data } = await api.post(`/live-match/${matchId}/start`);
  return data.data as {
    id: string;
    homeTeam: { id: string; name: string };
    awayTeam: { id: string; name: string };
    date: string;
    status: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished';
  };
}

export async function trackEntityView(entityType: 'player' | 'team' | 'news', entityId: string) {
  await api.post('/discovery/views', { entityType, entityId });
}

export async function createReport(payload: { entityType: 'post' | 'comment'; entityId: string; reason: string; details?: string }) {
  const { data } = await api.post('/reports', payload);
  return data.data;
}

export async function getReports() {
  const { data } = await api.get('/reports/admin');
  return data.data;
}

export async function reviewReport(id: string, status: 'reviewed' | 'dismissed') {
  const { data } = await api.post(`/reports/admin/${id}`, { status });
  return data.data;
}

export async function getTeams() {
  const { data } = await api.get('/teams');
  return data as TeamListItem[];
}
