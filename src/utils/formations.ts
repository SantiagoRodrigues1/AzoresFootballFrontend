import { Formation, FormationName, FormationPosition } from '@/types';

export const FORMATIONS: Record<FormationName, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      // GR
      { x: 50, y: 8, label: 'GR', positionType: 'goalkeeper' },
      // Defesa (4)
      { x: 18, y: 28, label: 'LD', positionType: 'defender' },
      { x: 37, y: 28, label: 'DC1', positionType: 'defender' },
      { x: 63, y: 28, label: 'DC2', positionType: 'defender' },
      { x: 82, y: 28, label: 'LE', positionType: 'defender' },
      // Médios (3)
      { x: 30, y: 52, label: 'MD1', positionType: 'midfielder' },
      { x: 50, y: 57, label: 'MD', positionType: 'midfielder' },
      { x: 70, y: 52, label: 'MD2', positionType: 'midfielder' },
      // Avançados (3)
      { x: 18, y: 80, label: 'EE', positionType: 'forward' },
      { x: 50, y: 86, label: 'AV', positionType: 'forward' },
      { x: 82, y: 80, label: 'ED', positionType: 'forward' },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      // GR
      { x: 50, y: 8, label: 'GR', positionType: 'goalkeeper' },
      // Defesa (4)
      { x: 18, y: 28, label: 'LD', positionType: 'defender' },
      { x: 37, y: 28, label: 'DC1', positionType: 'defender' },
      { x: 63, y: 28, label: 'DC2', positionType: 'defender' },
      { x: 82, y: 28, label: 'LE', positionType: 'defender' },
      // Médios (4) - bem distribuído
      { x: 15, y: 55, label: 'ME1', positionType: 'midfielder' },
      { x: 38, y: 55, label: 'ME2', positionType: 'midfielder' },
      { x: 62, y: 55, label: 'ME3', positionType: 'midfielder' },
      { x: 85, y: 55, label: 'ME4', positionType: 'midfielder' },
      // Avançados (2)
      { x: 35, y: 82, label: 'AV1', positionType: 'forward' },
      { x: 65, y: 82, label: 'AV2', positionType: 'forward' },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      // GR
      { x: 50, y: 8, label: 'GR', positionType: 'goalkeeper' },
      // Defesa (3)
      { x: 30, y: 28, label: 'DC1', positionType: 'defender' },
      { x: 50, y: 24, label: 'DC2', positionType: 'defender' },
      { x: 70, y: 28, label: 'DC3', positionType: 'defender' },
      // Médios (5)
      { x: 18, y: 50, label: 'ME1', positionType: 'midfielder' },
      { x: 38, y: 53, label: 'ME2', positionType: 'midfielder' },
      { x: 50, y: 57, label: 'ME', positionType: 'midfielder' },
      { x: 62, y: 53, label: 'ME3', positionType: 'midfielder' },
      { x: 82, y: 50, label: 'ME4', positionType: 'midfielder' },
      // Avançados (2)
      { x: 35, y: 82, label: 'AV1', positionType: 'forward' },
      { x: 65, y: 82, label: 'AV2', positionType: 'forward' },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      // GR
      { x: 50, y: 8, label: 'GR', positionType: 'goalkeeper' },
      // Defesa (4)
      { x: 18, y: 28, label: 'LD', positionType: 'defender' },
      { x: 37, y: 28, label: 'DC1', positionType: 'defender' },
      { x: 63, y: 28, label: 'DC2', positionType: 'defender' },
      { x: 82, y: 28, label: 'LE', positionType: 'defender' },
      // Médios Defensivos (2)
      { x: 37, y: 48, label: 'MD1', positionType: 'midfielder' },
      { x: 63, y: 48, label: 'MD2', positionType: 'midfielder' },
      // Médios Ofensivos (3)
      { x: 18, y: 65, label: 'MA1', positionType: 'midfielder' },
      { x: 50, y: 70, label: 'MA', positionType: 'midfielder' },
      { x: 82, y: 65, label: 'MA2', positionType: 'midfielder' },
      // Avançado (1)
      { x: 50, y: 86, label: 'AV', positionType: 'forward' },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      // GR
      { x: 50, y: 8, label: 'GR', positionType: 'goalkeeper' },
      // Defesa (5)
      { x: 12, y: 30, label: 'LD', positionType: 'defender' },
      { x: 32, y: 28, label: 'DC1', positionType: 'defender' },
      { x: 50, y: 24, label: 'DC2', positionType: 'defender' },
      { x: 68, y: 28, label: 'DC3', positionType: 'defender' },
      { x: 88, y: 30, label: 'LE', positionType: 'defender' },
      // Médios (3)
      { x: 35, y: 58, label: 'MD1', positionType: 'midfielder' },
      { x: 50, y: 62, label: 'MD2', positionType: 'midfielder' },
      { x: 65, y: 58, label: 'MD3', positionType: 'midfielder' },
      // Avançados (2)
      { x: 35, y: 82, label: 'AV1', positionType: 'forward' },
      { x: 65, y: 82, label: 'AV2', positionType: 'forward' },
    ],
  },
};

export const FORMATION_NAMES: FormationName[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2'];

export const POSITION_COLORS: Record<string, string> = {
  goalkeeper: 'bg-yellow-100 border-yellow-400',
  defender: 'bg-blue-100 border-blue-400',
  midfielder: 'bg-green-100 border-green-400',
  forward: 'bg-red-100 border-red-400',
};

export const POSITION_DISPLAY_NAMES: Record<string, string> = {
  goalkeeper: 'Guarda-Redes',
  defender: 'Defesa',
  midfielder: 'Médio',
  forward: 'Avançado',
};

export function getFormationByName(name: FormationName): Formation {
  return FORMATIONS[name];
}

export function validateLineupPositions(
  formation: Formation,
  selectedPlayers: string[]
): boolean {
  return selectedPlayers.length === formation.positions.length;
}

export function getPositionLabel(x: number, y: number, formation: Formation): string | null {
  const position = formation.positions.find((p) => p.x === x && p.y === y);
  return position?.label || null;
}
