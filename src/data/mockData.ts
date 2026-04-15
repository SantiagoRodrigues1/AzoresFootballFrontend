import { Team, Match, Player, Standing, Competition } from '@/types';

// Equipas Açorianas
export const teams: Team[] = [
  {
    id: '1',
    name: 'Santa Clara',
    shortName: 'STC',
    logo: '⚽',
    island: 'São Miguel',
    stadium: 'Estádio de São Miguel',
    founded: 1927,
    colors: { primary: '#E30613', secondary: '#FFFFFF' }
  },
  {
    id: '2',
    name: 'Lusitânia FC',
    shortName: 'LUS',
    logo: '🔵',
    island: 'São Miguel',
    stadium: 'Campo da Matriz',
    founded: 1922,
    colors: { primary: '#1E3A8A', secondary: '#FFFFFF' }
  },
  {
    id: '3',
    name: 'CD Operário',
    shortName: 'OPE',
    logo: '🟡',
    island: 'São Miguel',
    stadium: 'Campo do Operário',
    founded: 1937,
    colors: { primary: '#FACC15', secondary: '#000000' }
  },
  {
    id: '4',
    name: 'Marítimo da Ribeira Grande',
    shortName: 'MRG',
    logo: '🟢',
    island: 'São Miguel',
    stadium: 'Campo do Marítimo RG',
    founded: 1945,
    colors: { primary: '#166534', secondary: '#FFFFFF' }
  },
  {
    id: '5',
    name: 'Atlético Clube de Rabo de Peixe',
    shortName: 'ARP',
    logo: '🔴',
    island: 'São Miguel',
    stadium: 'Campo de Rabo de Peixe',
    founded: 1960,
    colors: { primary: '#DC2626', secondary: '#FFFFFF' }
  },
  {
    id: '6',
    name: 'GD Velense',
    shortName: 'VEL',
    logo: '🟣',
    island: 'São Jorge',
    stadium: 'Campo das Velas',
    founded: 1932,
    colors: { primary: '#7C3AED', secondary: '#FFFFFF' }
  },
  {
    id: '7',
    name: 'FC Horta',
    shortName: 'FCH',
    logo: '🔷',
    island: 'Faial',
    stadium: 'Campo do FC Horta',
    founded: 1926,
    colors: { primary: '#0369A1', secondary: '#FFFFFF' }
  },
  {
    id: '8',
    name: 'CD Praiense',
    shortName: 'PRA',
    logo: '⚪',
    island: 'Terceira',
    stadium: 'Campo Municipal da Praia',
    founded: 1936,
    colors: { primary: '#FFFFFF', secondary: '#000000' }
  },
];

// Jogos ao Vivo / Próximos
export const matches: Match[] = [
  {
    id: '1',
    homeTeam: teams[0],
    awayTeam: teams[1],
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    minute: 67,
    competition: 'Campeonato Regional',
    venue: 'Estádio de São Miguel',
    island: 'São Miguel',
    date: new Date(),
    events: [
      { id: 'e1', minute: 12, type: 'goal', playerId: 'p1', playerName: 'João Silva', teamId: '1' },
      { id: 'e2', minute: 34, type: 'goal', playerId: 'p2', playerName: 'Pedro Costa', teamId: '2' },
      { id: 'e3', minute: 45, type: 'yellow_card', playerId: 'p3', playerName: 'Miguel Santos', teamId: '1' },
      { id: 'e4', minute: 58, type: 'goal', playerId: 'p4', playerName: 'André Ferreira', teamId: '1', assistPlayerId: 'p5', assistPlayerName: 'Rui Oliveira' },
    ]
  },
  {
    id: '2',
    homeTeam: teams[6],
    awayTeam: teams[7],
    homeScore: 0,
    awayScore: 0,
    status: 'live',
    minute: 23,
    competition: 'Taça dos Açores',
    venue: 'Campo do FC Horta',
    island: 'Faial',
    date: new Date(),
    events: [
      { id: 'e5', minute: 15, type: 'yellow_card', playerId: 'p6', playerName: 'Carlos Mendes', teamId: '7' },
    ]
  },
  {
    id: '3',
    homeTeam: teams[2],
    awayTeam: teams[3],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    competition: 'Campeonato Regional',
    venue: 'Campo do Operário',
    island: 'São Miguel',
    date: new Date(Date.now() + 86400000), // Amanhã
    events: []
  },
  {
    id: '4',
    homeTeam: teams[4],
    awayTeam: teams[5],
    homeScore: 3,
    awayScore: 2,
    status: 'finished',
    competition: 'Campeonato Regional',
    venue: 'Campo de Rabo de Peixe',
    island: 'São Miguel',
    date: new Date(Date.now() - 86400000), // Ontem
    events: [
      { id: 'e6', minute: 10, type: 'goal', playerId: 'p7', playerName: 'Tiago Almeida', teamId: '5' },
      { id: 'e7', minute: 25, type: 'goal', playerId: 'p8', playerName: 'Hugo Dias', teamId: '6' },
      { id: 'e8', minute: 55, type: 'goal', playerId: 'p9', playerName: 'Nuno Reis', teamId: '5' },
      { id: 'e9', minute: 72, type: 'goal', playerId: 'p10', playerName: 'Filipe Gomes', teamId: '6' },
      { id: 'e10', minute: 88, type: 'goal', playerId: 'p7', playerName: 'Tiago Almeida', teamId: '5' },
    ]
  },
];

// Classificação
export const standings: Standing[] = [
  { position: 1, team: teams[0], played: 12, won: 9, drawn: 2, lost: 1, goalsFor: 28, goalsAgainst: 10, goalDifference: 18, points: 29 },
  { position: 2, team: teams[1], played: 12, won: 8, drawn: 2, lost: 2, goalsFor: 22, goalsAgainst: 12, goalDifference: 10, points: 26 },
  { position: 3, team: teams[4], played: 12, won: 7, drawn: 3, lost: 2, goalsFor: 20, goalsAgainst: 11, goalDifference: 9, points: 24 },
  { position: 4, team: teams[6], played: 12, won: 6, drawn: 3, lost: 3, goalsFor: 18, goalsAgainst: 14, goalDifference: 4, points: 21 },
  { position: 5, team: teams[2], played: 12, won: 5, drawn: 4, lost: 3, goalsFor: 16, goalsAgainst: 13, goalDifference: 3, points: 19 },
  { position: 6, team: teams[7], played: 12, won: 4, drawn: 3, lost: 5, goalsFor: 14, goalsAgainst: 16, goalDifference: -2, points: 15 },
  { position: 7, team: teams[3], played: 12, won: 2, drawn: 2, lost: 8, goalsFor: 10, goalsAgainst: 22, goalDifference: -12, points: 8 },
  { position: 8, team: teams[5], played: 12, won: 1, drawn: 1, lost: 10, goalsFor: 8, goalsAgainst: 28, goalDifference: -20, points: 4 },
];

// Competições
export const competitions: Competition[] = [
  { id: '1', name: 'Campeonato Regional dos Açores', shortName: 'CRA', season: '2024/25', type: 'league' },
  { id: '2', name: 'Taça dos Açores', shortName: 'TA', season: '2024/25', type: 'cup' },
  { id: '3', name: 'Supertaça dos Açores', shortName: 'STA', season: '2024/25', type: 'tournament' },
];

// Ilhas dos Açores
export const islands = [
  'São Miguel',
  'Terceira', 
  'Faial',
  'Pico',
  'São Jorge',
  'Graciosa',
  'Flores',
  'Corvo',
  'Santa Maria'
];
