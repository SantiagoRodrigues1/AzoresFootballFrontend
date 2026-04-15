export interface FeatureUser {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
  role?: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string | null;
  category: string;
  author?: FeatureUser;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  tags?: string[];
  createdAt: string;
}

export interface SocialComment {
  _id: string;
  entityType: 'news' | 'post';
  entityId: string;
  content: string;
  author?: FeatureUser;
  likesCount: number;
  repliesCount: number;
  parentCommentId?: string | null;
  createdAt: string;
}

export interface SocialPost {
  _id: string;
  text: string;
  image?: string | null;
  author?: FeatureUser;
  likesCount: number;
  commentsCount: number;
  reportsCount: number;
  createdAt: string;
}

export interface Submission {
  _id: string;
  type: 'player' | 'team' | 'match' | 'image';
  data: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string | null;
  createdAt: string;
}

export interface ImageUpload {
  _id: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string | null;
  createdAt: string;
  playerId?: {
    _id: string;
    name: string;
    team?: string;
  };
}

export interface FavoriteTeam {
  id: string;
  team: {
    _id: string;
    name: string;
    logo?: string;
    island?: string;
  };
  notifications: {
    matchStart: boolean;
    goals: boolean;
    finalResult: boolean;
  };
}

export interface AppNotification {
  _id: string;
  tipo?: string;
  eventKey?: string | null;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadoEm: string;
  acaoUrl?: string;
  botaoTexto?: string;
  cor?: string;
  descricao?: string;
}

export interface PlayerProfile {
  _id: string;
  id?: string;
  name: string;
  nome?: string;
  numero: string;
  position: string;
  team?: string;
  teamId?: string;
  teamName?: string | null;
  email?: string;
  nickname?: string;
  photo?: string | null;
  image?: string | null;
  goals?: number;
  assists?: number;
  createdAt?: string;
}

export interface PlayerEditRequest {
  _id: string;
  playerId?: {
    _id: string;
    name?: string;
    nome?: string;
    numero?: string;
    position?: string;
    email?: string;
    nickname?: string;
    team?: string;
    photo?: string;
    image?: string;
  };
  field: 'name' | 'numero' | 'position' | 'email' | 'nickname' | 'photo';
  fieldLabel?: string;
  oldValue: string | number | null;
  newValue: string | number;
  justification: string;
  proof?: {
    type: 'link' | 'image';
    value: string;
  } | null;
  status: 'pending' | 'approved' | 'rejected';
  userId?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  reviewedBy?: {
    _id: string;
    name?: string;
    email?: string;
  };
  reviewNote?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface TrendingItem<T> {
  views: number;
  entity: T;
}

export interface SearchResults {
  players: Array<Record<string, unknown>>;
  teams: Array<Record<string, unknown>>;
  news: NewsItem[];
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
}

export interface TeamListItem {
  _id: string;
  equipa: string;
  campeonato: string;
  ilha?: string;
  logo?: string;
}
