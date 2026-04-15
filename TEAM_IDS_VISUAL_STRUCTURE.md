# 🔗 TEAM IDS: VISUAL DATA STRUCTURE MAP

Representação visual de todas as estruturas de dados com Team IDs

---

## 🏗️ HIERARQUIA DE DADOS

```
┌──────────────────────────────────────────────────────────────────┐
│                          APLICAÇÃO                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ USER CONTEXT (AuthContext.tsx)                          │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ User {                                              │ │   │
│  │ │   id: string                                        │ │   │
│  │ │   email: string                                     │ │   │
│  │ │   role: 'team_manager' | 'admin' | 'fan'          │ │   │
│  │ │   assignedTeam: string  ← TEAM ID FOR MANAGER     │ │   │
│  │ │   favoriteTeams: string[]                          │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ MATCH STATE (types/index.ts)                            │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Match {                                             │ │   │
│  │ │   id: string                                        │ │   │
│  │ │   homeTeam: Team  ← TEAM OBJ WITH ID             │ │   │
│  │ │   awayTeam: Team  ← TEAM OBJ WITH ID             │ │   │
│  │ │   homeScore: number                                │ │   │
│  │ │   awayScore: number                                │ │   │
│  │ │   events: MatchEvent[]                             │ │   │
│  │ │   status: string                                   │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Team {                                              │ │   │
│  │ │   id: string              ← TEAM ID (ObjectId str) │ │   │
│  │ │   name: string            ← "Santa Clara B"        │ │   │
│  │ │   shortName: string                                │ │   │
│  │ │   logo: string                                     │ │   │
│  │ │   island: string                                   │ │   │
│  │ │   stadium: string                                  │ │   │
│  │ │   colors: { primary, secondary }                   │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ MatchEvent {                                        │ │   │
│  │ │   id: string                                        │ │   │
│  │ │   type: 'goal' | 'card' | 'substitution'          │ │   │
│  │ │   teamId: string          ← TEAM ID DIRETO        │ │   │
│  │ │   playerId: string                                 │ │   │
│  │ │   minute: number                                   │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Player {                                            │ │   │
│  │ │   id: string                                        │ │   │
│  │ │   name: string                                      │ │   │
│  │ │   number: number                                    │ │   │
│  │ │   position: string                                  │ │   │
│  │ │   teamId: string          ← TEAM ID DIRETO        │ │   │
│  │ │   stats: {...}                                     │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ MatchLineup {                                       │ │   │
│  │ │   id: string                                        │ │   │
│  │ │   matchId: string                                   │ │   │
│  │ │   teamId: string          ← TEAM ID DIRETO        │ │   │
│  │ │   teamName: string        ← "Santa Clara B"       │ │   │
│  │ │   formation: string       ← "4-3-3"               │ │   │
│  │ │   startingXI: LineupPlayer[]                        │ │   │
│  │ │   bench: LineupPlayer[]                            │ │   │
│  │ │   status: 'draft' | 'submitted' | 'locked'        │ │   │
│  │ │ }                                                   │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE RESOLUÇÃO DE TEAM IDs

```
User com Match
        ↓
═══════════════════════════════════════════════════════════════
Step 1: Backend retorna Match com homeTeam/awayTeam populado
═══════════════════════════════════════════════════════════════
        ↓
Match (JSON):
{
  "id": "match_123",
  "homeTeam": {
    "id": "507f1f77bcf86cd799439011",        ← ObjectId string
    "name": "Santa Clara B",
    "logo": "https://..."
  },
  "awayTeam": {
    "id": "507f2f77bcf86cd799439012",        ← ObjectId string
    "name": "Angrense",
    "logo": "https://..."
  },
  "events": [
    {
      "id": "evt_1",
      "type": "goal",
      "team": "507f1f77bcf86cd799439011",    ← Team ObjectId
      "playerId": "507f3f77bcf86cd799439013",
      "minute": 45
    }
  ]
}
        ↓
═══════════════════════════════════════════════════════════════
Step 2: Frontend recebe e tipifica como Match interface
═══════════════════════════════════════════════════════════════
        ↓
const match: Match = {
  homeTeam: { id: "507f1f77bcf86cd799439011", ... },
  awayTeam: { id: "507f2f77bcf86cd799439012", ... },
  // ... rest of data
}
        ↓
═══════════════════════════════════════════════════════════════
Step 3: Validar Team Manager permissions
═══════════════════════════════════════════════════════════════
        ↓
const isTeamManager = canTeamManagerEditMatch(
  user.role,                                  // "team_manager"
  user.assignedTeam,                         // "507f1f77bcf86cd799439011"
  match.homeTeam.id,                         // "507f1f77bcf86cd799439011"
  match.awayTeam.id                          // "507f2f77bcf86cd799439012"
);

// Compara:
// user.assignedTeam ("507f1f77...") === match.homeTeam.id ("507f1f77...")
// ✅ MATCH → Can edit!
        ↓
═══════════════════════════════════════════════════════════════
Step 4: Carregar Squad da equipa
═══════════════════════════════════════════════════════════════
        ↓
const squad = await squadService.getTeamSquad(
  match.homeTeam.id  // ou user.assignedTeam
);

// API request:
// GET /api/players/team/507f1f77bcf86cd799439011
        ↓
Squad (JSON):
[
  {
    "id": "player_1",
    "name": "João Silva",
    "number": 1,
    "position": "Goalkeeper",
    "teamId": "507f1f77bcf86cd799439011"    ← Teams ID direto
  },
  {
    "id": "player_2",
    "name": "Carlos Gomes",
    "number": 4,
    "position": "Defender",
    "teamId": "507f1f77bcf86cd799439011"
  }
]
        ↓
═══════════════════════════════════════════════════════════════
Step 5: Salvar Escalação com Team ID
═══════════════════════════════════════════════════════════════
        ↓
await liveMatchService.saveLineup(
  matchId,           // match_123
  teamId,            // "507f1f77bcf86cd799439011"
  lineup             // { formation, startingXI, bench }
);

// API request:
// POST /api/team-manager/lineups/match_123/507f1f77bcf86cd799439011
// Body: { formation: "4-3-3", startingXI: [...], bench: [...] }
        ↓
Escalação Salva ✅
```

---

## 🎯 MAPEAMENTO DE FICHEIROS POR TIPO DE OPERAÇÃO

```
┌───────────────────────────────────────────────────────────────┐
│ OPERAÇÃO: Ler Match e extrair Team IDs                        │
├───────────────────────────────────────────────────────────────┤
│ 1. Definição do tipo Match                                    │
│    → src/types/index.ts (line 29)                             │
│                                                               │
│ 2. Serviço para obter Match                                   │
│    → src/services/liveMatchService.ts                         │
│    - getMatchDetails(matchId)                                 │
│    - Retorna com homeTeam/awayTeam resolvidos                 │
│                                                               │
│ 3. Component que usa                                          │
│    → src/pages/LiveMatchManager.tsx                           │
│    - const [match, setMatch] = useState()                     │
│    - access: match.homeTeam.id, match.awayTeam.id            │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ OPERAÇÃO: Validar Team Manager pode editar                    │
├───────────────────────────────────────────────────────────────┤
│ 1. User context                                               │
│    → src/contexts/AuthContext.tsx                             │
│    - user.assignedTeam (Team ObjectId como string)            │
│                                                               │
│ 2. Comparação logic                                           │
│    → src/utils/lineupHelpers.ts (line 130)                    │
│    - canTeamManagerEditMatch()                                │
│    - Compara assignedTeam com homeTeam.id / awayTeam.id       │
│                                                               │
│ 3. Component que usa                                          │
│    → src/pages/LiveMatchManager.tsx                           │
│    - if (!canTeamManagerEditMatch(...)) return                │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ OPERAÇÃO: Carregar Squad de uma equipa                        │
├───────────────────────────────────────────────────────────────┤
│ 1. Service method                                             │
│    → src/services/squadService.ts (line 57)                   │
│    - getTeamSquad(teamId)                                     │
│    - GET /api/players/team/{teamId}                           │
│                                                               │
│ 2. Player interface com teamId                                │
│    → src/types/index.ts (line 65)                             │
│    - Player.teamId (string)                                   │
│                                                               │
│ 3. Component que usa                                          │
│    → src/pages/LiveMatchManager.tsx (line 139)                │
│    - const squad = await squadService.getTeamSquad(teamId)    │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ OPERAÇÃO: Salvar/Carregar Escalação                           │
├───────────────────────────────────────────────────────────────┤
│ 1. Escalação interface com teamId                             │
│    → src/types/index.ts (line 164)                            │
│    - MatchLineup.teamId (string)                              │
│    - MatchLineup.teamName (string)                            │
│                                                               │
│ 2. Service methods                                            │
│    → src/services/liveMatchService.ts                         │
│    - getLineup(matchId, teamId)                               │
│    - GET /api/team-manager/lineups/{id}/{teamId}              │
│                                                               │
│ 3. Component que usa                                          │
│    → src/pages/LiveMatchManager.tsx (line 78)                 │
│    - const lineup = await liveMatchService.getLineup(...)     │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 COMPARAÇÃO: Casa/Fora vs HomeTeam/AwayTeam

```
┌─────────────────────────────────────────────────────────────┐
│ LEGACY SYSTEM (casa/fora) - Português                        │
├──────────────────────────┬──────────────────────────────────┤
│ Campo            │ Tipo     │ Exemplo                       │
├──────────────────────────┼──────────────────────────────────┤
│ match.casa       │ string   │ "Santa Clara B"               │
│ match.fora       │ string   │ "Angrense"                    │
│ match.data_hora  │ string   │ "2026-04-09T15:30:00Z"        │
│ match.resultado  │ string?  │ "1-1"                         │
│ match.estadio    │ string?  │ "Estádio do Remo"             │
│ match.status     │ string?  │ "scheduled" | "live" | ...    │
└──────────────────────────┴──────────────────────────────────┘

Encontrado em:
├─ TeamMatchesSection.tsx (admin)
├─ TeamDetailPage.tsx (team view)
├─ MatchCardPremium.tsx (card display)
├─ MyMatchCard.tsx (team card)
└─ MatchCardWithLineup.tsx (lineup card)

Problema: NÃO tem Team IDs, só nomes strings
Solução: Fazer lookup nos teams[] para obter IDs, ou
         usar fallback para homeTeam/awayTeam se disponível


┌─────────────────────────────────────────────────────────────┐
│ MODERN SYSTEM (homeTeam/awayTeam) - Inglês                   │
├──────────────────────────┬──────────────────────────────────┤
│ Campo            │ Tipo     │ Exemplo                       │
├──────────────────────────┼──────────────────────────────────┤
│ match.homeTeam   │ Team obj │ { id: "507f...", name: ... } │
│ match.awayTeam   │ Team obj │ { id: "507f...", name: ... } │
│ match.homeScore  │ number   │ 1                             │
│ match.awayScore  │ number   │ 1                             │
│ match.status     │ string   │ "live"                        │
│ match.date       │ Date     │ 2026-04-09T15:30:00Z          │
│ match.venue      │ string   │ "Estádio do Remo"             │
│ match.events     │ Event[]  │ [{ teamId, playerId, ... }]   │
└──────────────────────────┴──────────────────────────────────┘

Encontrado em:
├─ liveMatchService.ts (service)
├─ matchService.ts (service)
├─ LiveMatchManager.tsx (team manager page)
├─ MatchCard.tsx (referee card)
├─ MatchDetails.tsx (referee detail)
└─ Todos os componentes novos

Vantagem: TEM Team IDs resolvidos
Desvantagem: homeTeam/awayTeam pode ser null se não populated


RESOLUÇÃO NA PRÁTICA:
// Quando temos ambos
const homeTeamName = match.casa || match.homeTeam?.name || 'Casa';
const homeTeamId = match.homeTeam?.id;

// Quando temos só casa/fora
const homeTeamName = match.casa;  // "Santa Clara B"
const homeTeam = teams.find(t => t.name === homeTeamName);
const homeTeamId = homeTeam?.id;
```

---

## 🔑 COMPARAÇÃO: Team ID Sources

```
┌──────────────────────────────────┬──────────────────┬─────────────┐
│ Source                           │ Type             │ Where       │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ Match.homeTeam.id                │ string (Object   │ API         │
│                                  │ Id)              │ responses   │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ Player.teamId                    │ string (Object   │ API         │
│                                  │ Id)              │ responses   │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ MatchEvent.team / teamId         │ string (Object   │ Match.      │
│                                  │ Id)              │ events      │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ User.assignedTeam                │ string (Object   │ Auth        │
│                                  │ Id)              │ context     │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ Lineup.teamId                    │ string (Object   │ Lineup      │
│                                  │ Id)              │ object      │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ Club._id (MongoDB)               │ ObjectId         │ Backend     │
├──────────────────────────────────┼──────────────────┼─────────────┤
│ Match Casa/Fora name             │ string (name)    │ Legacy API  │
│ (não é ID!)                      │                  │ responses   │
└──────────────────────────────────┴──────────────────┴─────────────┘
```

---

## 🔐 VALIDAÇÃO DE PERMISSÕES

```
┌──────────────────────────────────────────────────────────────┐
│ TEAM MANAGER PERMISSION CHECK                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Input:                                                      │
│  ├─ user.role = "team_manager"                             │
│  ├─ user.assignedTeam = "507f1f77bcf86cd799439011"        │
│  ├─ match.homeTeam.id = "507f1f77bcf86cd799439011"        │
│  └─ match.awayTeam.id = "507f2f77bcf86cd799439012"        │
│                                                              │
│  Lógica (lineupHelpers.ts):                                 │
│  ├─ É team_manager? ✓                                       │
│  ├─ Tem assignedTeam? ✓                                     │
│  └─ assignedTeam === homeTeam.id OR awayTeam.id? ✓         │
│     "507f1f77..." === "507f1f77..." ✓                      │
│                                                              │
│  Output: ALLOW ✅                                            │
│  └─ manager_santa_clara_b@league.com pode editar            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ FAN/ADMIN PERMISSION CHECK                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Input:                                                      │
│  ├─ user.role = "fan"                                       │
│  ├─ user.assignedTeam = null                                │
│  ├─ match.homeTeam.id = "507f1f77bcf86cd799439011"        │
│  └─ match.awayTeam.id = "507f2f77bcf86cd799439012"        │
│                                                              │
│  Lógica (lineupHelpers.ts):                                 │
│  ├─ É team_manager? ✗ FAIL                                  │
│                                                              │
│  Output: DENY ❌                                             │
│  └─ Can only view, not edit                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 API PAYLOAD SAMPLES

### GET /api/matches/{matchId} Response

```json
{
  "_id": "match_507f1f77bcf86cd799439011",
  "homeTeam": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Santa Clara B",
    "logo": "https://...",
    "island": "São Miguel",
    "stadium": "Estádio do Remo"
  },
  "awayTeam": {
    "_id": "507f2f77bcf86cd799439012",
    "name": "Angrense",
    "logo": "https://...",
    "island": "São Miguel",
    "stadium": "Estádio Eng. Neves"
  },
  "homeScore": 1,
  "awayScore": 1,
  "status": "finished",
  "date": "2026-04-09T15:30:00Z",
  "competition": "Regional League 2025-26",
  "venue": "Estádio do Remo",
  "events": [
    {
      "_id": "evt_1",
      "type": "goal",
      "team": "507f1f77bcf86cd799439011",  ← teamId
      "player": "player_123",
      "assistedBy": "player_456",
      "minute": 45
    },
    {
      "_id": "evt_2",
      "type": "goal",
      "team": "507f2f77bcf86cd799439012",  ← different team
      "player": "player_789",
      "minute": 67
    }
  ]
}
```

### GET /api/players/team/{teamId} Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "player_1",
      "name": "João Silva",
      "number": 1,
      "position": "Goalkeeper",
      "teamId": "507f1f77bcf86cd799439011",  ← teamId
      "stats": {
        "goals": 0,
        "assists": 0,
        "yellowCards": 0,
        "redCards": 0,
        "minutesPlayed": 900
      }
    },
    {
      "_id": "player_2",
      "name": "Carlos Gomes",
      "number": 4,
      "position": "Defender",
      "teamId": "507f1f77bcf86cd799439011",  ← same teamId
      "stats": {
        "goals": 1,
        "assists": 0,
        "yellowCards": 2,
        "redCards": 0,
        "minutesPlayed": 850
      }
    }
  ]
}
```

### GET /api/team-manager/lineups/{matchId}/{teamId} Response

```json
{
  "success": true,
  "data": {
    "_id": "lineup_1",
    "match": "match_507f1f77bcf86cd799439011",
    "team": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Santa Clara B",
      "logo": "https://..."
    },
    "formation": "4-3-3",
    "starters": [
      {
        "playerId": "player_1",
        "playerName": "João Silva",
        "playerNumber": 1,
        "position": "Goalkeeper"
      },
      {
        "playerId": "player_2",
        "playerName": "Carlos Gomes",
        "playerNumber": 4,
        "position": "Defender"
      },
      ...
    ],
    "substitutes": [
      {
        "playerId": "player_20",
        "playerName": "Miguel Santos",
        "playerNumber": 20,
        "position": "Midfielder",
        "benchNumber": 1
      },
      ...
    ],
    "status": "submitted",
    "createdAt": "2026-04-09T10:00:00Z",
    "submittedAt": "2026-04-09T14:00:00Z",
    "submittedBy": "user_123"
  }
}
```

---

## 🛠️ DEBUGGING: Como Verificar Team IDs

### 1. Browser Development Tools

```javascript
// Console.log na aplicação
console.log('Current user:', user);
// User {
//   id: "...",
//   role: "team_manager",
//   assignedTeam: "507f1f77bcf86cd799439011"
// }

console.log('Current match:', match);
// Match {
//   homeTeam: { id: "507f1f77bcf86cd799439011", name: "Santa Clara B" },
//   awayTeam: { id: "507f2f77bcf86cd799439012", name: "Angrense" }
// }

console.log('Can edit?', 
  user.assignedTeam === match.homeTeam.id ||
  user.assignedTeam === match.awayTeam.id
);
// true ✓
```

### 2. Network Tab - API Calls

```
Postman / Network Tab:

GET /api/matches/match_123
Response: homeTeam._id, awayTeam._id visible

GET /api/players/team/507f1f77bcf86cd799439011
Response: array with player.teamId matches param

GET /api/team-manager/lineups/match_123/507f1f77bcf86cd799439011
Response: team._id matches URL param
```

### 3. Component State Inspection

```
React DevTools:
├─ LiveMatchManager
│  ├─ match (state)
│  │  ├─ homeTeam: { id: "507f1f77...", name: "Santa Clara B" }
│  │  ├─ awayTeam: { id: "507f2f77...", name: "Angrense" }
│  │  └─ events: [...]
│  ├─ players (state)
│  │  └─ [{ teamId: "507f1f77...", name: "João", ... }, ...]
│  └─ loadedTeamId (state)
│     └─ "507f1f77..."
└─ AuthContext
   └─ user: { assignedTeam: "507f1f77...", role: "team_manager" }
```

### 4. Backend Logs

```
Backend Console:
[liveMatchService.js]
🔍 Validação de equipa:
   Home Team: 507f1f77bcf86cd799439011, Match: true
   Away Team: 507f2f77bcf86cd799439012, Match: false
   Manager assignedTeam: 507f1f77bcf86cd799439011
✅ Manager autorizado para Santa Clara B
```

---

## 📋 TABELA RÁPIDA: Onde Encontrar Cada Campo

| Campo | Ficheiro | Linha | Tipo |
|-------|----------|-------|------|
| `Match.homeTeam.id` | types/index.ts | 29-35 | Team interface |
| `Match.awayTeam.id` | types/index.ts | 29-35 | Team interface |
| `Team.id` | types/index.ts | 45-53 | string |
| `Player.teamId` | types/index.ts | 60-70 | string |
| `MatchEvent.teamId` | types/index.ts | 18-27 | string |
| `MatchLineup.teamId` | types/index.ts | 161-174 | string |
| `MatchCallUp.teamId` | types/index.ts | 138-146 | string |
| `User.assignedTeam` | AuthContext.tsx | varies | string (ObjectId) |
| `match.casa` | TeamMatchesSection.tsx | 7 | string (name) |
| `match.fora` | TeamMatchesSection.tsx | 8 | string (name) |
| `homeTeam._id` | Match.js (backend) | 43-48 | MongoDB ObjectId |
| `awayTeam._id` | Match.js (backend) | 43-48 | MongoDB ObjectId |
| `Club._id` | Club.js (backend) | varies | MongoDB ObjectId |
| `User.assignedTeam` | User.js (backend) | varies | MongoDB ObjectId ref |

---

**Este documento é referência visual para o mapa completo em `TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md`**

