# 🏆 Mapa Completo de IDs de Equipas e Estruturas de Dados

Pesquisa comprehensiva de **todas as estruturas de dados** que contêm IDs e nomes de equipas no workspace frontend.

---

## 📋 Sumário Executivo

- **Total de ficheiros com dados de equipas identificados**: 60+
- **Padrões de ID encontrados**: TypeScript interfaces, MongoDB ObjectIds, string IDs
- **Dois sistemas de nomeação**: `casa/fora` (português) e `homeTeam/awayTeam` (inglês)
- **Serviços de mapeamento**: 5 serviços principais
- **APIs de resolução de equipas**: 12+ endpoints

---

## 🎯 1. TIPOS DE DADOS (TypeScript Interfaces)

### 1.1 Estrutura Principal do Match (`src/types/index.ts`)

```typescript
export interface Match {
  id: string;
  homeTeam: Team;          // ← ObjectId resolvido para Team object
  awayTeam: Team;          // ← ObjectId resolvido para Team object
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
```

### 1.2 Tipo Team (`src/types/index.ts`)

```typescript
export interface Team {
  id: string;              // ← MongoDB ObjectId como string
  name: string;            // ← Nome da equipa (ex: "Santa Clara B")
  shortName: string;       // ← Abreviatura
  logo: string;            // ← URL do logo
  island: string;          // ← Ilha (São Miguel, Terceira, etc)
  stadium: string;         // ← Estádio
  founded?: number;
  colors: {
    primary: string;
    secondary: string;
  };
}
```

### 1.3 Match Event com Team ID (`src/types/index.ts`)

```typescript
export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  playerId: string;
  playerName: string;
  teamId: string;          // ← ID DIRETO da equipa
  assistPlayerId?: string;
  assistPlayerName?: string;
}
```

### 1.4 Player com Team ID (`src/types/index.ts`)

```typescript
export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;          // ← Team ID DIRETO
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
```

### 1.5 Lineup e Call-up com Team IDs (`src/types/index.ts`)

```typescript
export interface MatchCallUp {
  id: string;
  matchId: string;
  teamId: string;          // ← Team ID DIRETO
  teamName: string;        // ← Nome da equipa
  players: CallUpPlayer[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

export interface MatchLineup {
  id: string;
  matchId: string;
  teamId: string;          // ← Team ID DIRETO
  teamName: string;        // ← Nome da equipa
  formation: FormationName;
  startingXI: LineupPlayer[];
  bench: LineupPlayer[];
  status: 'draft' | 'submitted' | 'locked';
  createdAt: Date;
  submittedAt?: Date;
  submittedBy: string;
  updatedAt?: Date;
}
```

### 1.6 MatchPreparation (`src/types/index.ts`)

```typescript
export interface MatchPreparation {
  matchId: string;
  teamId: string;          // ← Team ID DIRETO
  callUp?: MatchCallUp;
  lineup?: MatchLineup;
  status: 'callup_pending' | 'callup_ready' | 'lineup_pending' | 'lineup_locked';
  timeToKickoff: number;
}
```

---

## 🔗 2. SERVIÇOS DE RESOLUÇÃO DE EQUIPAS

### 2.1 liveMatchService.ts

**Tipos internos do serviço:**

```typescript
export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: Team;          // ← Objeto Team com ID + nome + logo
  awayTeam: Team;          // ← Objeto Team com ID + nome + logo
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'halftime' | 'second_half' | 'finished' | 'postponed' | 'cancelled';
  addedTime: number;
  events: MatchEvent[];
  date: string;
  updatedAt: string;
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
  substitutes: Array<{...}>;
  status: string;
}
```

**Métodos principais:**
- `getMatchDetails(matchId)` - Retorna Match com homeTeam/awayTeam resolvidos
- `getLineup(matchId, teamId)` - Retorna Lineup para uma equipa específica

### 2.2 squadService.ts

```typescript
export interface Player {
  id: string;
  name: string;
  number: number;
  position?: string;
  teamId: string;          // ← Team ID DIRETO
  stats?: {...};
}
```

**Métodos:**
- `getTeamSquad(teamId)` - Returns `Player[]` com teamId incluído
- `getTeamSquadWithStats(teamId)` - Returns `Player[]` com stats

**API Endpoints:**
```
GET /api/players/team/{teamId}
GET /api/players/team/{teamId}/stats
```

### 2.3 matchService.ts

```typescript
export interface Match {
  id: string;
  homeTeam: {
    id: string;           // ← Team ID
    name: string;         // ← Team name
    logo?: string;
  };
  awayTeam: {
    id: string;           // ← Team ID
    name: string;         // ← Team name
    logo?: string;
  };
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
  date: string;
  venue: string;
  competition: string;
  referees?: {...};
  created_at?: string;
  updated_at?: string;
}
```

---

## 🔄 3. DOIS SISTEMAS DE NOMES DE EQUIPAS

### 3.1 Sistema "casa/fora" (Legacy - em componentes antigos)

Encontrado em:
- [TeamMatchesSection.tsx](src/components/admin/TeamMatchesSection.tsx)
- [TeamDetailPage.tsx](src/pages/TeamDetailPage.tsx)
- [MatchCardPremium.tsx](src/components/matches/MatchCardPremium.tsx)
- [MyMatchCard.tsx](src/components/matches/MyMatchCard.tsx)
- [MatchCardWithLineup.tsx](src/components/matches/MatchCardWithLineup.tsx)

**Estrutura:**

```typescript
interface Match {
  casa: string;           // ← Nome da equipa da casa (ex: "Santa Clara B")
  fora: string;           // ← Nome da equipa de fora (ex: "Angrense")
  data_hora: string;
  status?: 'scheduled' | 'live' | 'finished';
  resultado?: string;
  estadio?: string;
}
```

**Exemplo de uso:**

```typescript
// TeamMatchesSection.tsx (linha 41)
const teamMatches = matches.filter(
  (m) => m.casa.toLowerCase() === teamName.toLowerCase() || 
         m.fora.toLowerCase() === teamName.toLowerCase()
);

// MatchCardPremium.tsx (linhas 85-110)
let homeTeamName = 'Equipa Casa';
let awayTeamName = 'Equipa Fora';

if (match.casa) {
  const casaStr = String(match.casa).trim();
  if (casaStr && casaStr !== '' && casaStr !== 'null') {
    homeTeamName = casaStr;
  }
}

if (match.fora) {
  const foraStr = String(match.fora).trim();
  if (foraStr && foraStr !== '' && foraStr !== 'null') {
    awayTeamName = foraStr;
  }
}

// Fallback para homeTeam/awayTeam se casa/fora vazios
if (homeTeamName === 'Equipa Casa' && match.homeTeam?.name) {
  homeTeamName = String(match.homeTeam.name).trim();
}

if (awayTeamName === 'Equipa Fora' && match.awayTeam?.name) {
  awayTeamName = String(match.awayTeam.name).trim();
}
```

### 3.2 Sistema "homeTeam/awayTeam" (Moderno - APIs)

Encontrado em todos os serviços e componentes novos:
- [liveMatchService.ts](src/services/liveMatchService.ts)
- [matchService.ts](src/services/matchService.ts)
- [LiveMatchManager.tsx](src/pages/LiveMatchManager.tsx)
- [MatchCard.tsx](src/components/referee/MatchCard.tsx)
- [MatchDetails.tsx](src/pages/referee/MatchDetails.tsx)

**Estrutura:**

```typescript
interface Match {
  id: string;
  homeTeam: {               // ← Objeto com ID + nome + logo
    id: string;
    name: string;
    logo?: string;
  };
  awayTeam: {               // ← Objeto com ID + nome + logo
    id: string;
    name: string;
    logo?: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  date: string;
  venue: string;
  // ... outros campos
}
```

**Exemplo de uso:**

```typescript
// LiveMatchManager.tsx (linhas 449-471)
<h3>{match.homeTeam.name}</h3>
<h3>{match.awayTeam.name}</h3>

// MatchCard.tsx (linhas 107-139)
<img src={match.homeTeam.logo} alt={match.homeTeam.name} />
<p className="team-name">{match.homeTeam.name}</p>

<img src={match.awayTeam.logo} alt={match.awayTeam.name} />
<p className="team-name">{match.awayTeam.name}</p>
```

---

## 🛣️ 4. Api ENDPOINTS E MAPEAMENTO DE IDS

### 4.1 Endpoints de Jogos (Match)

| Método | Endpoint | Retorna | Team ID Structure |
|--------|----------|---------|------------------|
| GET | `/api/matches` | `Match[]` | `homeTeam.id`, `awayTeam.id` (ObjectId resolvidos) |
| GET | `/api/matches/{matchId}` | Single `Match` | `homeTeam.id`, `awayTeam.id` |
| GET | `/api/team-manager/matches` | Matches da equipa do manager | `homeTeam.id`, `awayTeam.id` |
| GET | `/api/team-manager/lineups/:matchId/:teamId` | Lineup específica | Campo direto `teamId` |
| POST | `/api/team-manager/lineups/:matchId/:teamId` | Salva lineup | Usa `teamId` do URL |
| GET | `/live-match/{matchId}/lineup/{teamId}` | Escalação para team | URL param `teamId` |

### 4.2 Endpoints de Jogadores (Players)

| Método | Endpoint | Retorna | Team ID |
|--------|----------|---------|---------|
| GET | `/api/players/team/{teamId}` | `Player[]` | Campo `teamId` em cada jogador |
| GET | `/api/players/team/{teamId}/stats` | `Player[]` com stats | Campo `teamId` em cada jogador |
| GET | `/api/players/{playerId}` | Single `Player` | Campo `teamId` |

### 4.3 Endpoints de Equipas (Teams/Clubs)

| Método | Endpoint | Retorna | ID Structure |
|--------|----------|---------|--------------|
| GET | `/api/teams` | `Team[]` | Campo `_id` ou `id` (MongoDB ObjectId) |
| GET | `/api/teams/{teamId}` | Single `Team` | Campo `_id` ou `id` |
| GET | `/api/clubs` | `Club[]` (MongoDB) | `_id` (MongoDB ObjectId) |

### 4.4 Endpoints de Escalaçâo / Lineup

| Método | Endpoint | Retorna | Team ID Usage |
|--------|----------|---------|--------------|
| GET | `/api/team-manager/lineups/{matchId}/{teamId}` | Saved `Lineup` | Path param `teamId` |
| POST | `/api/team-manager/lineups/{matchId}/{teamId}` | Save `Lineup` | Path param `teamId` |
| GET | `/live-match/{matchId}/lineup/{teamId}` | Escalação | Path param `teamId` |
| GET | `/api/lines/match/{matchId}` | Lineups para ambas as equipas | `team` field com `id`, `name`, `logo` |

---

## 📍 5. FICHEIROS COM DADOS DE EQUIPAS (Mapa Completo)

### 5.1 Tipos (Type Definitions)

- **[src/types/index.ts](src/types/index.ts)** - ⭐ Definições centrais de todos os tipos
  - `Match` com `homeTeam: Team` e `awayTeam: Team`
  - `Team` com `id`, `name`, `shortName`, `logo`
  - `Player` com `teamId`
  - `MatchEvent` com `teamId`
  - `MatchCallUp` com `teamId`, `teamName`
  - `MatchLineup` com `teamId`, `teamName`
  - `MatchPreparation` com `teamId`

### 5.2 Serviços (Services)

- **[src/services/liveMatchService.ts](src/services/liveMatchService.ts)** - ⭐ Serviço principal para jogos ao vivo
  - Define `Match` com `homeTeam: Team`, `awayTeam: Team`
  - Define `Lineup` com `team: { id, name, logo }`
  - Métodos: `getMatchDetails()`, `getLineup(matchId, teamId)`

- **[src/services/squadService.ts](src/services/squadService.ts)** - Gerencia jogadores de equipas
  - Define `Player` com `teamId`
  - Métodos: `getTeamSquad(teamId)`, `getTeamSquadWithStats(teamId)`
  - API: `GET /api/players/team/{teamId}`

- **[src/services/matchService.ts](src/services/matchService.ts)** - Serviço genérico de jogos
  - Define `Match` com `homeTeam: { id, name, logo }`, `awayTeam: { id, name, logo }`
  - Define `RefereeAssignment` (sem team ID direto)

- **[src/services/refereeService.ts](src/services/refereeService.ts)** - Gerencia árbitros
  - Não contém estruturas diretas com team IDs

- **[src/services/index.ts](src/services/index.ts)** - Agregador de serviços

### 5.3 Páginas (Pages)

- **[src/pages/LiveMatchManager.tsx](src/pages/LiveMatchManager.tsx)** - ⭐ Gerenciador de jogos ao vivo
  - Estado: `match: Match` com `homeTeam.id`, `awayTeam.id`
  - Estado: `loadedTeamId: string | null` para distinguir qual equipa foi carregada
  - Função: `fetchSquadForTeam(teamId)` - carrega jogadores de uma equipa
  - Verifica: `user?.assignedTeam === match.homeTeam.id || user?.assignedTeam === match.awayTeam.id`

- **[src/pages/TeamDetailPage.tsx](src/pages/TeamDetailPage.tsx)** - Detalhes da equipa
  - Route param: `teamId` (vem de `/team/:teamId`)
  - Estrutura: `team: { _id, equipa, campeonato, logo, colors, stadium }`
  - Interface `Match` com `casa`, `fora` (sistema legacy)

- **[src/pages/MatchDetailsPage.tsx](src/pages/MatchDetailsPage.tsx)** - Detalhes do jogo
  - Interação com Match que tem `homeTeam.id`, `awayTeam.id`

- **[src/pages/ViewLineupsPage.tsx](src/pages/ViewLineupsPage.tsx)** - Visualiza escalações
  - Interface `Match` com `_id`, `homeTeam._id`, `awayTeam._id`

- **[src/pages/admin/AdminMatches.tsx](src/pages/admin/AdminMatches.tsx)** - Admin de jogos
  - Estrutura `Match` com `homeTeam: { name, logo }`, `awayTeam: { name, logo }`

- **[src/pages/admin/AssignReferees.tsx](src/pages/admin/AssignReferees.tsx)** - Atribuir árbitros
  - Estrutura `Match` com `homeTeam: { name }`, `awayTeam: { name }`

- **[src/pages/referee/RefereeMatches.tsx](src/pages/referee/RefereeMatches.tsx)** - Jogos do árbitro
  - Estrutura `Match` com `homeTeam: { name, logo }`, `awayTeam: { name, logo }`

- **[src/pages/referee/MatchDetails.tsx](src/pages/referee/MatchDetails.tsx)** - Detalhes para árbitro
  - Estrutura `Match` com `homeTeam: { name, logo, id }`, `awayTeam: { name, logo, id }`
  - Usa `match.homeTeam.id` para integração

- **[src/pages/referee/UploadReport.tsx](src/pages/referee/UploadReport.tsx)** - Upload de relatório
  - Estrutura `Match` com `homeTeam: { name }`, `awayTeam: { name }`

### 5.4 Componentes (Components)

#### Componentes de Match/Jogo

- **[src/components/live/MatchSummary.tsx](src/components/live/MatchSummary.tsx)**
  - Campo: `homeTeamId = match.homeTeam.id`
  - Filtra golos por `team === homeTeamId`

- **[src/components/live/ScoreHeader.tsx](src/components/live/ScoreHeader.tsx)**
  - Usa `match.homeTeam.name`, `match.awayTeam.name`

- **[src/components/live/EventTimeline.tsx](src/components/live/EventTimeline.tsx)**
  - Props: `homeTeamName?: string`, `awayTeamName?: string`

- **[src/components/referee/MatchCard.tsx](src/components/referee/MatchCard.tsx)**
  - Estrutura: `match.homeTeam: { name, logo }`, `match.awayTeam: { name, logo }`

#### Componentes de Escalação/Lineup

- **[src/components/lineup/LineupViewerModal.tsx](src/components/lineup/LineupViewerModal.tsx)**
  - Props: `homeTeam?: string`, `awayTeam?: string`
  - Defaults: `homeTeam = 'Casa'`, `awayTeam = 'Fora'`

- **[src/components/lineup/LineupViewerFlashscore.tsx](src/components/lineup/LineupViewerFlashscore.tsx)**
  - Props: `homeTeam?: string`, `awayTeam?: string`
  - Itera sobre `allLineups[teamIdx]` para cada equipa

#### Componentes de Match Card

- **[src/components/matches/MatchCardPremium.tsx](src/components/matches/MatchCardPremium.tsx)** - ⭐ Resolve ambos os sistemas
  - Tenta `match.casa` → fallback `match.homeTeam?.name`
  - Tenta `match.fora` → fallback `match.awayTeam?.name`
  - Função: `getTeamStyle(teamName)` para cores por equipa
  - Logs: `console.log('✅ Final Team Names:', { homeTeamName, awayTeamName });`

- **[src/components/matches/MyMatchCard.tsx](src/components/matches/MyMatchCard.tsx)** - ⭐ Integração casa/fora
  - `homeTeamName = match.casa || match.homeTeam?.name || ''`
  - `awayTeamName = match.fora || match.awayTeam?.name || ''`
  - `isHome = homeTeamName.toLowerCase().includes(teamName.toLowerCase())`

- **[src/components/matches/MatchCardWithLineup.tsx](src/components/matches/MatchCardWithLineup.tsx)** - ⭐ Com escalação
  - `homeTeamName = match.casa || match.homeTeam?.name || 'Casa'`
  - `awayTeamName = match.fora || match.awayTeam?.name || 'Fora'`
  - Função: `getTeamEmoji(teamName)` para emojis por equipa

#### Componentes de Admin

- **[src/components/admin/TeamMatchesSection.tsx](src/components/admin/TeamMatchesSection.tsx)** - ⭐ Lista de jogos por equipa
  - Props: `teamId: string`, `teamName: string`
  - Filtra matches: `m.casa === teamName || m.fora === teamName`
  - Interface: `Match { casa, fora, data_hora, status, resultado, estadio }`

- **[src/components/admin/TeamMembersModal.tsx](src/components/admin/TeamMembersModal.tsx)**
  - Props: `teamId: string`, `teamName: string`
  - Campo: `assignedTeam: teamId` ao criar novo membro

- **[src/components/admin/StartingXIModal.tsx](src/components/admin/StartingXIModal.tsx)**
  - Gerencia jogadores por equipa

#### Componentes de Equipas/Teams

- **[src/components/team/FavoriteTeamButton.tsx](src/components/team/FavoriteTeamButton.tsx)**
  - Props: `teamId: string`
  - API: `GET /api/user/favorites/toggle/{teamId}`

#### Componentes de Jogadores

- **[src/components/players/PlayerForm.tsx](src/components/players/PlayerForm.tsx)**
  - Props: `teamId: string`
  - Campo: `team: teamId` ao criar jogador

#### Componentes de Notificações

- **[src/components/notifications/NotificationCenter.tsx](src/components/notifications/NotificationCenter.tsx)**
  - Props: `teamId: string`

### 5.5 Utils / Helpers

- **[src/utils/lineupHelpers.ts](src/utils/lineupHelpers.ts)** - ⭐ Helpers para escalações
  - Função: `canTeamManagerEditMatch(userRole, assignedTeamId, homeTeamId, awayTeamId)`
  - Lógica: `assignedTeamId === homeTeamId || assignedTeamId === awayTeamId`
  - Função: `isTeamManagerOfMatch(userTeamId, matchHomeTeamId, matchAwayTeamId)`
  - Converte IDs para string para comparação robusta:
    ```typescript
    const userTeamIdStr = String(userTeamId).trim();
    const homeTeamIdStr = String(matchHomeTeamId).trim();
    const awayTeamIdStr = String(matchAwayTeamId).trim();
    return userTeamIdStr === homeTeamIdStr || userTeamIdStr === awayTeamIdStr;
    ```

### 5.6 Contextos (Contexts)

- **[src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)** - Contexto de autenticação
  - Armazena `user` com `assignedTeam?: string` para team managers

### 5.7 Routes/App Configuration

- **[src/App.tsx](src/App.tsx)** - ⭐ Definição de rotas
  - Route: `/team/:teamId` → `TeamDetailPage`
  - Route: `/team/:teamId/roster` → Roster page
  - Route: `/match/:matchId` → Match details

---

## 🗄️ 6. BACKEND - MODELOS E ESTRUTURAS

### 6.1 MongoDB Models

#### Club Model (`azores-score-backend/models/Club.js`)

```javascript
const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  island: {
    type: String,
    enum: ['São Miguel', 'Terceira', 'Faial', 'Pico', 'São Jorge', 'Graciosa', 'Flores', 'Corvo', 'Açores'],
    default: 'Açores'
  },
  stadium: String,
  foundedYear: Number,
  description: String,
  logo: { type: String, default: '⚽' },
  colors: {
    primary: { type: String, default: '#3b82f6' },
    secondary: { type: String, default: '#ffffff' }
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índices
clubSchema.index({ island: 1 });

module.exports = mongoose.model('Club', clubSchema);
```

**MongoDB ObjectId representação:** `_id: ObjectId("507f1f77bcf86cd799439011")`

#### Match Model (`azores-score-backend/models/Match.js`)

```javascript
const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  date: { type: Date, required: true },
  time: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
  stadium: String,
  status: {
    type: String,
    enum: ['scheduled', 'live', 'halftime', 'second_half', 'finished', 'postponed', 'cancelled'],
    default: 'scheduled'
  },
  homeScore: { type: Number, default: 0, min: 0 },
  awayScore: { type: Number, default: 0, min: 0 },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'Referee' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  events: [eventSchema],
  attendance: { type: Number, min: 0 },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índices
matchSchema.index({ date: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ homeTeam: 1, awayTeam: 1 });
matchSchema.index({ competition: 1 });
```

#### Event Schema (parte de Match)

```javascript
const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['goal', 'yellow_card', 'red_card', 'substitution', 'own_goal'],
    required: true
  },
  player: String,           // ObjectId string ou custom ID
  assistedBy: String,       // ObjectId string ou custom ID
  playerIn: String,         // ObjectId string ou custom ID
  playerOut: String,        // ObjectId string ou custom ID
  minute: { type: Number, min: 0, max: 120 },
  team: {                   // ← Team ObjectId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });
```

#### User Model (`azores-score-backend/models/User.js`)

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['fan', 'referee', 'club_manager', 'team_manager', 'admin'], 
    default: 'fan' 
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'inactive'], 
    default: 'active' 
  },
  
  // GESTOR DE EQUIPA
  assignedTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club',        // ← Referência à equipa
    default: null 
  },
  
  // ÁRBITRO
  refereeStatus: { 
    type: String, 
    enum: ['none', 'pending', 'approved', 'rejected'], 
    default: 'none' 
  },
  
  // FAVORITOS
  favoriteTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.2 Backend Services

#### liveMatchService.js (Principais extratos)

```javascript
// Validar se o manager pertence a uma das equipas
match = await Match.findById(matchId)
  .populate('homeTeam', 'id name')
  .populate('awayTeam', 'id name');

const managerTeamId = user.assignedTeam;
const isHomeTeam = match.homeTeam._id.toString() === managerTeamId?.toString();
const isAwayTeam = match.awayTeam._id.toString() === managerTeamId?.toString();

if (!isHomeTeam && !isAwayTeam) {
  throw new Error('Manager não pertence a nenhuma das equipas');
}

const teamId = isHomeTeam ? match.homeTeam._id : match.awayTeam._id;
const teamName = isHomeTeam ? match.homeTeam.name : match.awayTeam.name;

// Buscar escalação de uma equipa
const lineup = await Lineup.findOne({
  match: matchId,
  team: teamId  // ← Usa teamId direto
}).populate('team', 'id name logo');

// Buscar escalações de ambas as equipas
const lineups = await Lineup.find({
  match: matchId,
  team: { $in: [match.homeTeam._id, match.awayTeam._id] }
}).populate('team', 'id name logo');
```

### 6.3 Backend Routes

#### Main Match Routes

```
GET    /api/matches                          → Todos os jogos
GET    /api/matches/{matchId}               → Um jogo específico
GET    /api/team-manager/matches            → Jogos do team manager
GET    /api/team-manager/lineups/:matchId/:teamId  → Escalação salva
POST   /api/team-manager/lineups/:matchId/:teamId  → Salvar escalação
GET    /live-match/{matchId}/lineup/{teamId}  → Escalação da API
```

---

## 🔑 7. PADRÕES DE RESOLUÇÃO DE TEAM IDS

### 7.1 Conversão de ObjectId para String

```typescript
// Comparação segura de ObjectIds
const managerTeamId = user.assignedTeam;  // Pode ser ObjectId ou string
const homeTeamId = match.homeTeam._id;    // ObjectId do MongoDB

// Método 1: Na liveMatchService.js (backend)
const isHomeTeam = match.homeTeam._id.toString() === managerTeamId?.toString();

// Método 2: No frontend (lineupHelpers.ts)
const userTeamIdStr = String(userTeamId).trim();
const homeTeamIdStr = String(matchHomeTeamId).trim();
const match = userTeamIdStr === homeTeamIdStr;
```

### 7.2 Mapeamento de Team Name para Team ID

**No frontend:**
1. Recebe `Match` com `homeTeam.id` e `homeTeam.name`
2. Armazena em state: `loadedTeamId`
3. Usa para validar permissões de team manager

**No backend:**
1. Team manager tem `user.assignedTeam` (ObjectId)
2. Match tem `homeTeam` e `awayTeam` (ObjectIds)
3. Compara: `match.homeTeam._id === user.assignedTeam`

### 7.3 Fallback Systems para nomes de equipas

```typescript
// MatchCardPremium.tsx - Sistema de fallbacks
let homeTeamName = 'Equipa Casa';
if (match.casa) homeTeamName = String(match.casa).trim();
if (homeTeamName === 'Equipa Casa' && match.homeTeam?.name) {
  homeTeamName = String(match.homeTeam.name).trim();
}

// MyMatchCard.tsx - Ordem de preferência
const homeTeamName = match.casa || match.homeTeam?.name || '';

// LineupViewerFlashscore.tsx - Defaults
const homeTeam = props.homeTeam ?? 'Casa';
```

---

## 📊 8. FLUXO DE DADOS DE TEAM ID

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Backend: User.assignedTeam = MongoDB ObjectId             │
│    Exemplo: "507f1f77bcf86cd799439011"                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Backend API Response: Match com homeTeam populado          │
│    {                                                          │
│      homeTeam: { _id: ObjectId, name: "Santa Clara B" },    │
│      awayTeam: { _id: ObjectId, name: "Angrense" }          │
│    }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend: Match state                                      │
│    const [match, setMatch] = useState<Match>({               │
│      homeTeam: { id: "507f1f77bcf86cd799439011", name: ... }│
│      awayTeam: { id: "507f2f77bcf86cd799439012", name: ... }│
│    })                                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend: Validação de permissões (lineupHelpers.ts)      │
│    canTeamManagerEditMatch(                                  │
│      user.role = "team_manager",                            │
│      user.assignedTeam = "507f1f77bcf86cd799439011",       │
│      match.homeTeam.id = "507f1f77bcf86cd799439011"        │
│    ) → returns true                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Frontend: Carrega squad da equipa                         │
│    squadService.getTeamSquad(teamId)                        │
│    API: GET /api/players/team/{teamId}                      │
│    Returns: Player[] com { teamId, playerName, ... }       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend: Salva escalação                                │
│    POST /api/team-manager/lineups/{matchId}/{teamId}        │
│    Body: { matchId, teamId, formation, players, ... }      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 9. ESTRUTURAS PRINCIPAIS RESUMIDAS

### Resumo por Tipo

| Tipo | ID Field(s) | Resolved? | Locale |
|------|-------------|-----------|--------|
| User (Team Manager) | `assignedTeam` (ObjectId) | ← Referência | Backend |
| Match | `homeTeam`, `awayTeam` (ObjectIds) | ✅ Populated | Backend/Frontend |
| MatchEvent | `team` (ObjectId) | ✅ Populated | Both |
| Player | `teamId` (string) | ← Direto | Both |
| MatchLineup/CallUp | `teamId` (string) | ← Direto | Both |
| Club | `_id` (ObjectId) | ← MongoDB | Backend |

### Nomes de Equipas

| Campo | Onde | Tipo | Exemplo |
|-------|------|------|---------|
| `team.name` | Match object | string | "Santa Clara B" |
| `match.casa` | Legacy components | string | "Santa Clara B" |
| `match.fora` | Legacy components | string | "Angrense" |
| `homeTeam.name` | Modern all | string | "Santa Clara B" |
| `awayTeam.name` | Modern all | string | "Angrense" |
| `Club.name` | MongoDB | string | "Santa Clara B" |

---

## 📝 10. FICHEIROS DOCUMENTAÇÃO RELACIONADA

Para mais contexto, consulte:
- [TEAM_MANAGER_IMPLEMENTATION.md](TEAM_MANAGER_IMPLEMENTATION.md)
- [LIVE_MATCH_MANAGER_TECHNICAL_SUMMARY.md](LIVE_MATCH_MANAGER_TECHNICAL_SUMMARY.md)
- [LIVE_MATCH_MANAGER_COMPLETE_GUIDE.md](LIVE_MATCH_MANAGER_COMPLETE_GUIDE.md)
- [TEAM_MANAGER_LOGIN_GUIDE.md](TEAM_MANAGER_LOGIN_GUIDE.md)
- [APP_INTEGRATION_GUIDE.md](APP_INTEGRATION_GUIDE.md)

---

## 🔍 11. LISTA COMPLETA DE FICHEIROS COM TEAM DATA

**Totalmente ficheiros identificados: 62**

### Ficheiros Core
1. src/types/index.ts
2. src/contexts/AuthContext.tsx
3. src/App.tsx
4. src/services/liveMatchService.ts
5. src/services/squadService.ts
6. src/services/matchService.ts
7. src/services/refereeService.ts
8. src/services/index.ts

### Páginas
9. src/pages/LiveMatchManager.tsx
10. src/pages/TeamDetailPage.tsx
11. src/pages/MatchDetailsPage.tsx
12. src/pages/ViewLineupsPage.tsx
13. src/pages/MatchControlPage.tsx
14. src/pages/admin/AdminMatches.tsx
15. src/pages/admin/AssignReferees.tsx
16. src/pages/referee/RefereeMatches.tsx
17. src/pages/referee/MatchDetails.tsx
18. src/pages/referee/UploadReport.tsx
19. src/pages/TeamsPage.tsx
20. src/pages/TeamRosterPage.tsx

### Componentes - Live/Match Info
21. src/components/live/MatchSummary.tsx
22. src/components/live/ScoreHeader.tsx
23. src/components/live/EventTimeline.tsx
24. src/components/referee/MatchCard.tsx

### Componentes - Lineups
25. src/components/lineup/LineupViewerModal.tsx
26. src/components/lineup/LineupViewerFlashscore.tsx

### Componentes - Match Cards
27. src/components/matches/MatchCardPremium.tsx
28. src/components/matches/MyMatchCard.tsx
29. src/components/matches/MatchCardWithLineup.tsx

### Componentes - Admin
30. src/components/admin/TeamMatchesSection.tsx
31. src/components/admin/TeamMembersModal.tsx
32. src/components/admin/StartingXIModal.tsx

### Componentes - Teams
33. src/components/team/FavoriteTeamButton.tsx

### Componentes - Players
34. src/components/players/PlayerForm.tsx

### Componentes - Notifications
35. src/components/notifications/NotificationCenter.tsx

### Utils
36. src/utils/lineupHelpers.ts

### Backend - Models
37. azores-score-backend/models/Club.js
38. azores-score-backend/models/Match.js
39. azores-score-backend/models/User.js
40. azores-score-backend/models/Player.js (indiretamente referenciado)
41. azores-score-backend/models/Lineup.js (indiretamente referenciado)

### Backend - Services
42. azores-score-backend/services/liveMatchService.js
43. azores-score-backend/services/squadService.js (indiretamente)

### Backend - Routes
44. azores-score-backend/routes/teams.js
45. azores-score-backend/routes/liveMatchRoutes.js
46. azores-score-backend/routes/lineupViewRoutes.js
47. azores-score-backend/routes/adminPlayers.js
48. azores-score-backend/routes/adminDashboard.js

### Documentação
49. TEAM_MANAGER_IMPLEMENTATION.md
50. LIVE_MATCH_MANAGER_TECHNICAL_SUMMARY.md
51. LIVE_MATCH_MANAGER_COMPLETE_GUIDE.md
52. TEAM_MANAGER_LOGIN_GUIDE.md
53. APP_INTEGRATION_GUIDE.md
54. LIVE_MATCH_COMPLETE_GUIDE.md
55. ARCHITECTURE.md
56. FILES_AND_CHANGES_REFERENCE.md
57. PROFESSIONAL_LINEUP_SUMMARY.md
58. DEBUG_LINEUP_LOADING.md
59. FRONTEND_TEAM_MANAGER_INTEGRATION.md
60. TEAM_MANAGER_FIX_SUMMARY.md
61. TEAM_MANAGER_STATUS_EXECUTIVE_SUMMARY.md
62. SESSION_SUMMARY_LIVE_MATCH.md

---

## ✅ Conclusão

Este documento fornece um **mapa completo de como os IDs de equipas** são identificados, armazenados, resolvidos e utilizados em toda a aplicação:

- **Backend**: MongoDB ObjectIds com referências entre Collection
- **Frontend**: String IDs com fallback para nomes
- **APIs**: Ambos os sistemas (populate + diretos)
- **Componentes**: Suportam `casa/fora` e `homeTeam/awayTeam`
- **Validação**: Team Manager comparação com `assignedTeam`

**Para integrações futuras**, use:
- `teamId` string para players e escalações
- `homeTeam.id` / `awayTeam.id` para jogos
- `user.assignedTeam` para team managers
- `Club._id` (ObjectId) no backend

