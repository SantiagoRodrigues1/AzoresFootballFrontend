import { LineupPlayer, FormationName, CallUpPlayer } from '@/types';
import { isClubManagerRole } from '@/utils/access';
import { FORMATIONS } from './formations';

/**
 * Validates a complete lineup for a given formation
 */
export function validateLineup(
  formation: FormationName,
  selectedPlayers: LineupPlayer[]
): {
  isValid: boolean;
  errors: string[];
} {
  const formationData = FORMATIONS[formation];
  const errors: string[] = [];

  // Check number of players
  if (selectedPlayers.length !== formationData.positions.length) {
    errors.push(
      `Número de jogadores incorrecto. Esperado ${formationData.positions.length}, obtido ${selectedPlayers.length}`
    );
  }

  // Check for goalkeeper
  const hasGoalkeeper = selectedPlayers.some((p) => p.position === 'goalkeeper');
  if (!hasGoalkeeper) {
    errors.push('É necessário um guarda-redes na escalação');
  }

  // Check for duplicates
  const playerIds = selectedPlayers.map((p) => p.playerId);
  const duplicates = playerIds.filter((id, index) => playerIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Jogadores duplicados encontrados: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a call-up selection
 */
export function validateCallUp(
  starters: CallUpPlayer[],
  bench: CallUpPlayer[]
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check number of starters
  if (starters.length !== 11) {
    errors.push(`Titulares incorrecto. Esperado 11, obtido ${starters.length}`);
  }

  // Check number of bench
  if (bench.length !== 8) {
    errors.push(`Suplentes incorrecto. Esperado 8, obtido ${bench.length}`);
  }

  // Check for duplicates
  const allPlayerIds = [...starters.map((p) => p.playerId), ...bench.map((p) => p.playerId)];
  const uniqueIds = new Set(allPlayerIds);
  if (uniqueIds.size !== allPlayerIds.length) {
    errors.push('Não podem haver jogadores duplicados na convocação');
  }

  // Check for at least one goalkeeper
  const hasGoalkeeper =
    starters.some((p) => p.position === 'goalkeeper') ||
    bench.some((p) => p.position === 'goalkeeper');
  if (!hasGoalkeeper) {
    errors.push('É necessário um guarda-redes na convocação');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates time remaining until match kickoff
 */
export function getTimeToKickoff(matchDate: Date): {
  totalMinutes: number;
  hours: number;
  minutes: number;
  isCallUpOpen: boolean;
  isLineupOpen: boolean;
  isMatchStarted: boolean;
} {
  const kickoff = new Date(matchDate).getTime();
  const now = new Date().getTime();
  const diffMs = kickoff - now;
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    totalMinutes: Math.max(0, totalMinutes),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    isCallUpOpen: totalMinutes <= 24 * 60 && totalMinutes > 0, // 24 hours before
    isLineupOpen: totalMinutes <= 60 && totalMinutes > 0, // 1 hour before
    isMatchStarted: totalMinutes <= 0,
  };
}

/**
 * Groups players by position for filtering
 */
export function groupPlayersByPosition(players: CallUpPlayer[]): Record<string, CallUpPlayer[]> {
  return {
    goalkeeper: players.filter((p) => p.position === 'goalkeeper'),
    defender: players.filter((p) => p.position === 'defender'),
    midfielder: players.filter((p) => p.position === 'midfielder'),
    forward: players.filter((p) => p.position === 'forward'),
  };
}

/**
 * Checks team manager permissions for a match
 */
export function canTeamManagerEditMatch(
  userRole: string | undefined,
  assignedTeamId: string | undefined,
  homeTeamId: string,
  awayTeamId: string
): boolean {
  if (!isClubManagerRole(userRole) || !assignedTeamId) {
    return false;
  }

  return assignedTeamId === homeTeamId || assignedTeamId === awayTeamId;
}

/**
 * Generates a unique match identifier
 */
export function generateMatchId(homeTeam: string, awayTeam: string, date: string): string {
  const timestamp = new Date(date).getTime();
  return `${homeTeam.replace(/\s+/g, '_')}_vs_${awayTeam.replace(/\s+/g, '_')}_${timestamp}`;
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(hours: number, minutes: number): string {
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Auto-position players in formation based on their position
 */
export function autoPositionPlayers(
  callUpPlayers: CallUpPlayer[],
  formation: FormationName
): LineupPlayer[] {
  const formationData = FORMATIONS[formation];
  const positioned: LineupPlayer[] = [];

  // Separate players by position
  const goalkeepers = callUpPlayers.filter((p) => p.position === 'goalkeeper');
  const defenders = callUpPlayers.filter((p) => p.position === 'defender');
  const midfielders = callUpPlayers.filter((p) => p.position === 'midfielder');
  const forwards = callUpPlayers.filter((p) => p.position === 'forward');

  // Count slots by type in formation
  const goalkeeperSlots = formationData.positions.filter(
    (p) => p.positionType === 'goalkeeper'
  );
  const defenderSlots = formationData.positions.filter(
    (p) => p.positionType === 'defender'
  );
  const midfielderSlots = formationData.positions.filter(
    (p) => p.positionType === 'midfielder'
  );
  const forwardSlots = formationData.positions.filter(
    (p) => p.positionType === 'forward'
  );

  // Position goalkeepers
  for (let i = 0; i < Math.min(goalkeepers.length, goalkeeperSlots.length); i++) {
    const player = goalkeepers[i];
    const slot = goalkeeperSlots[i];
    positioned.push({
      playerId: player.playerId,
      playerName: player.playerName,
      playerNumber: player.playerNumber,
      position: player.position,
      formationPosition: slot.label,
      isStarter: true,
      fieldPosition: { x: slot.x, y: slot.y },
    });
  }

  // Position defenders
  for (let i = 0; i < Math.min(defenders.length, defenderSlots.length); i++) {
    const player = defenders[i];
    const slot = defenderSlots[i];
    positioned.push({
      playerId: player.playerId,
      playerName: player.playerName,
      playerNumber: player.playerNumber,
      position: player.position,
      formationPosition: slot.label,
      isStarter: true,
      fieldPosition: { x: slot.x, y: slot.y },
    });
  }

  // Position midfielders
  for (let i = 0; i < Math.min(midfielders.length, midfielderSlots.length); i++) {
    const player = midfielders[i];
    const slot = midfielderSlots[i];
    positioned.push({
      playerId: player.playerId,
      playerName: player.playerName,
      playerNumber: player.playerNumber,
      position: player.position,
      formationPosition: slot.label,
      isStarter: true,
      fieldPosition: { x: slot.x, y: slot.y },
    });
  }

  // Position forwards
  for (let i = 0; i < Math.min(forwards.length, forwardSlots.length); i++) {
    const player = forwards[i];
    const slot = forwardSlots[i];
    positioned.push({
      playerId: player.playerId,
      playerName: player.playerName,
      playerNumber: player.playerNumber,
      position: player.position,
      formationPosition: slot.label,
      isStarter: true,
      fieldPosition: { x: slot.x, y: slot.y },
    });
  }

  return positioned;
}

/**
 * Generate automatic lineup suggestion
 */
export function generateAutoLineup(
  callUpPlayers: CallUpPlayer[],
  formation: FormationName
): LineupPlayer[] {
  // Sort by starter status, limiting to needed positions
  const starters = callUpPlayers.filter((p) => p.isStarter).slice(0, 11);

  if (starters.length >= 11) {
    return autoPositionPlayers(starters, formation);
  }

  // Fallback: use first 11 available
  const topPlayers = callUpPlayers.slice(0, 11);
  return autoPositionPlayers(topPlayers, formation);
}

/**
 * Check if user can access lineup management
 * - Admin: full access all matches
/**
 * Check if user has permission to access team lineup
 * - Admin: full access
 * - Team Manager: only their team's matches (by ID comparison)
 */
export function checkLineupAccess(
  userRole: string | undefined | null,
  userTeamId: string | null | undefined,
  matchHomeTeamId: any,
  matchAwayTeamId: any,
  userEmail?: string
): boolean {
  if (!userRole) return false;

  // Admin has full access
  if (userRole === 'admin') {
    return true;
  }

  // Team Manager: only their team's matches
  if (isClubManagerRole(userRole)) {
    // IMPORTANT: Use ID-based comparison only (no string matching)
    if (!userTeamId) return false;

    // Convert to strings for comparison
    const userTeamIdStr = String(userTeamId).trim();
    const homeTeamIdStr = String(matchHomeTeamId).trim();
    const awayTeamIdStr = String(matchAwayTeamId).trim();

    // Check if user's team matches home or away team ID
    return userTeamIdStr === homeTeamIdStr || userTeamIdStr === awayTeamIdStr;
  }

  return false;
}
