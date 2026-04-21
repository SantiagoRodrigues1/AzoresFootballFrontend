// User Types
export type UserRole = 'fan' | 'referee' | 'club_manager' | 'team_manager' | 'team_president' | 'journalist' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string | null;
  role: UserRole;
  normalizedRole?: 'fan' | 'referee' | 'club_manager' | 'admin';
  plan?: 'free' | 'club_manager' | 'premium';
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: 'inactive' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  subscriptionCurrentPeriodEnd?: string | Date | null;
  refereeStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  favoriteTeams: string[];
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  assignedTeam?: string | null;
}

export * from './features';

// Match Types
export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  playerId: string;
  playerName: string;
  teamId: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  competition: string;
  venue: string;
  island: string;
  date: Date;
  events: MatchEvent[];
}

// Team Types
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  island: string;
  stadium: string;
  founded?: number;
  colors: {
    primary: string;
    secondary: string;
  };
}

// Player Types
export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
  nationality: string;
  birthDate: Date;
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

// Referee Types
export interface Referee {
  id: string;
  name: string;
  island: string;
  category: string;
  matchesRefereed: number;
  rating: number;
}

// Competition Types
export interface Competition {
  id: string;
  name: string;
  shortName: string;
  season: string;
  type: 'league' | 'cup' | 'tournament';
}

// Standing Types
export interface Standing {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Team Manager - Formation Types
export type FormationName = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2';

export interface FormationPosition {
  x: number;
  y: number;
  label: string;
  positionType: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
}

export interface Formation {
  name: FormationName;
  positions: FormationPosition[];
}

// Team Manager - Call-up and Lineup Types
export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface CallUpPlayer {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: PlayerPosition;
  selected: boolean;
  isStarter?: boolean;
  isBench?: boolean;
}

export interface MatchCallUp {
  id: string;
  matchId: string;
  teamId: string;
  teamName: string;
  players: CallUpPlayer[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

export interface LineupPlayer {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: PlayerPosition;
  formationPosition: string;
  isStarter: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  fieldPosition?: { x: number; y: number };
}

export interface MatchLineup {
  id: string;
  matchId: string;
  teamId: string;
  teamName: string;
  formation: FormationName;
  startingXI: LineupPlayer[];
  bench: LineupPlayer[];
  status: 'draft' | 'submitted' | 'locked';
  createdAt: Date;
  submittedAt?: Date;
  submittedBy: string;
  updatedAt?: Date;
}

export interface MatchPreparation {
  matchId: string;
  teamId: string;
  callUp?: MatchCallUp;
  lineup?: MatchLineup;
  status: 'callup_pending' | 'callup_ready' | 'lineup_pending' | 'lineup_locked';
  timeToKickoff: number; // minutes
}
