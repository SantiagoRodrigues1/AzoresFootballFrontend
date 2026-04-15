# 🗺️ QUICK REFERENCE - Team ID Data Structures

**Rápida referência dos IDs de equipas e como encontrá-los na aplicação**

---

## 🎯 Vou procurar por `teamId` ou IDs de Equipas. Onde devo olhar?

### ✅ PARA ENCONTRAR DADOS DE EQUIPAS

| O que procura? | Ficheiro(s) a consultar | Campo específico | Tipo |
|---|---|---|---|
| **Definição de Match** | `src/types/index.ts` | `Match.homeTeam`, `Match.awayTeam` | `Team` interface |
| **Definição de Team** | `src/types/index.ts` | `Team` interface | `id`, `name`, `logo` |
| **Definição de Player** | `src/types/index.ts` | `Player.teamId` | `string` |
| **Buscar todas as interfaces** | `src/types/index.ts` | Lines 1-182 | ⭐ Central |
| **Serviço de Jogos Ao Vivo** | `src/services/liveMatchService.ts` | `Match`, `Lineup` | API responses |
| **Serviço de Jogadores** | `src/services/squadService.ts` | `getTeamSquad(teamId)` | `Player[]` |
| **Resolver Team Manager** | `src/contexts/AuthContext.tsx` | `user.assignedTeam` | ObjectId string |
| **Validação de Permissões** | `src/utils/lineupHelpers.ts` | `canTeamManagerEditMatch()` | boolean logic |
| **Mapear Casa/Fora** | `src/components/matches/MatchCardPremium.tsx` | `match.casa`, `match.fora` | string names |
| **Filtrar por Equipa** | `src/components/admin/TeamMatchesSection.tsx` | Line 41 filter | `casa === teamName` |
| **MongoDB Refs** | `azores-score-backend/models/Match.js` | `homeTeam`, `awayTeam` | ObjectId refs |
| **User.assignedTeam** | `azores-score-backend/models/User.js` | `assignedTeam` field | ObjectId ref |

---

## 🔑 MAPEAMENTO RÁPIDO: Team IDs em 3 Tipos

```
┌──────────────────────────────────────────────────────────────┐
│ TIPO 1: homeTeam/awayTeam (Moderno API)                      │
├──────────────────────────────────────────────────────────────┤
│ Encontrado em:                                               │
│  ✓ liveMatchService.ts                                       │
│  ✓ LiveMatchManager.tsx                                      │
│  ✓ MatchCard.tsx                                             │
│  ✓ Todos os refs do backend populate()                       │
│                                                              │
│ Estrutura:                                                   │
│  interface Match {                                           │
│    homeTeam: { id: string, name: string, logo: string }    │
│    awayTeam: { id: string, name: string, logo: string }    │
│  }                                                           │
│                                                              │
│ Como usar:                                                   │
│  const homeTeamId = match.homeTeam.id                       │
│  const homeTeamName = match.homeTeam.name                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TIPO 2: casa/fora (Legacy português)                         │
├──────────────────────────────────────────────────────────────┤
│ Encontrado em:                                               │
│  ✓ TeamMatchesSection.tsx (linha 7-8)                       │
│  ✓ TeamDetailPage.tsx (linha 52-53)                         │
│  ✓ MatchCardPremium.tsx (linhas 85-110)                     │
│  ✓ MyMatchCard.tsx (linhas 33-35)                           │
│                                                              │
│ Estrutura:                                                   │
│  interface Match {                                           │
│    casa: string        // "Santa Clara B"                    │
│    fora: string        // "Angrense"                         │
│    data_hora: string                                         │
│    status?: string                                           │
│  }                                                           │
│                                                              │
│ Como usar:                                                   │
│  const isHome = match.casa === teamName                     │
│  const opponent = match.fora                                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TIPO 3: teamId DIRETO (Escalação, Eventos)                   │
├──────────────────────────────────────────────────────────────┤
│ Encontrado em:                                               │
│  ✓ Player.teamId (src/types/index.ts linha 65)             │
│  ✓ MatchEvent.teamId (src/types/index.ts linha 24)         │
│  ✓ Lineup.teamId (src/types/index.ts linha 164)            │
│  ✓ CallUp.teamId (src/types/index.ts linha 141)            │
│  ✓ Events com team field (Match.js backend)                │
│                                                              │
│ Estrutura:                                                   │
│  interface Player {                                          │
│    teamId: string       // "507f1f77bcf86cd799439011"       │
│    name: string                                              │
│  }                                                           │
│                                                              │
│  interface MatchEvent {                                      │
│    teamId: string       // Qual equipa marcou               │
│    playerId: string                                          │
│  }                                                           │
│                                                              │
│ Como usar:                                                   │
│  const playerTeamId = player.teamId                         │
│  const goalTeamId = event.teamId                            │
│  await getTeamSquad(teamId)  // Buscar jogadores           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔍 COMO ENCONTRAR TEAM IDS EM COMPONENTES

### Encontrar ALL homeTeam/awayTeam
```bash
# Terminal command
grep -r "homeTeam\|awayTeam" src/ --include="*.tsx" --include="*.ts"

# Resposta rápida: ~50 ficheiros
```

### Encontrar ALL teamId
```bash
# Terminal
grep -r "teamId" src/ --include="*.tsx" --include="*.ts"

# Resposta rápida: ~40 ficheiros
```

### Encontrar ALL casa/fora
```bash
# Terminal
grep -r "\.casa\|\.fora" src/ --include="*.tsx" --include="*.ts"

# Resposta rápida: ~5 ficheiros (components legacy)
```

---

## 📍 LOCALIZAÇÃO EXATA DE CADA TIPO

### 🟦 HomeTeam/AwayTeam (Moderno)

**Definição:**
- `src/types/index.ts` - Line 29: `interface Match`
- `src/services/liveMatchService.ts` - Lines 41-42: `homeTeam: Team`, `awayTeam: Team`
- `src/services/matchService.ts` - Lines 12-20: `homeTeam: { id, name, logo }`

**Uso em Páginas:**
- `src/pages/LiveMatchManager.tsx` - Lines 399, 449, 471, 537, 556
- `src/pages/referee/MatchDetails.tsx` - Lines 43-44, 208-231

**Uso em Componentes:**
- `src/components/live/ScoreHeader.tsx` - Lines 58, 65, 90, 97
- `src/components/referee/MatchCard.tsx` - Lines 21-22, 107-139

### 🟩 Casa/Fora (Legacy)

**Definição:**
- `src/components/admin/TeamMatchesSection.tsx` - Lines 7-8: `casa: string`, `fora: string`
- `src/pages/TeamDetailPage.tsx` - Lines 52-53: `casa: string`, `fora: string`

**Uso em Componentes:**
- `src/components/admin/TeamMatchesSection.tsx` - Lines 41-42 filter, 117-121, 144, 177, 245
- `src/components/matches/MatchCardPremium.tsx` - Lines 85-110 (resolution logic)
- `src/components/matches/MyMatchCard.tsx` - Lines 34-35, 36, 143, 168
- `src/components/matches/MatchCardWithLineup.tsx` - Lines 58-59, 187, 219

### 🟪 TeamId Direto

**Definição:**
- `src/types/index.ts` - Line 24 (`MatchEvent.teamId`), Line 65 (`Player.teamId`), Line 141, 164, 178

**Uso em Páginas:**
- `src/pages/LiveMatchManager.tsx` - Lines 30, 66, 67-68, 71, 78, 98, 119, 126, 139, 142, 154, 157

**Uso em Serviços:**
- `src/services/squadService.ts` - Lines 57, 68, 84, 95
- `src/services/liveMatchService.ts` - Line 241, 248, 253

**Uso em Helpers:**
- `src/utils/lineupHelpers.ts` - Lines 131-139, 282-305

---

## 🔑 CAMPOS POR FICHEIRO

### src/types/index.ts (Central Repository)

```typescript
// Match Object
Match.homeTeam      → Team { id, name, shortName, logo... }
Match.awayTeam      → Team { id, name, shortName, logo... }
Match.events        → MatchEvent[] { teamId, playerId... }

// Player Object
Player.teamId       → string (id direto)

// Event Object
MatchEvent.teamId   → string (qual equipa?)

// Lineup Objects
MatchCallUp.teamId  → string
MatchCallUp.teamName → string
MatchLineup.teamId  → string
MatchLineup.teamName → string

// Preparation
MatchPreparation.teamId → string
```

### src/services/liveMatchService.ts

```typescript
// Service Match Interface
Match {
  homeTeam: Team         // { id, name, logo }
  awayTeam: Team         // { id, name, logo }
  events: MatchEvent[]   // { team: id, playerId, minute... }
}

// Lineup Interface
Lineup {
  team: {                // { id, name, logo }
    id: string
    name: string
    logo: string
  }
  starters[]             // { playerId, playerName, position... }
  substitutes[]          // { playerId, playerName, position... }
}
```

---

## 🎯 OPERAÇÕES COMUNS

### 1️⃣ Obter Team ID do Match

```typescript
// Opção A: homeTeam/awayTeam
const homeTeamId = match.homeTeam.id;
const awayTeamId = match.awayTeam.id;

// Opção B: Nome para comparação
const homeTeamName = match.homeTeam.name;  // "Santa Clara B"
const isHome = homeTeamName === teamName;

// Opção C: Comparar assignedTeam (team manager)
const isTeamManager = user.assignedTeam === match.homeTeam.id;
```

### 2️⃣ Validar Team Manager Permissions

```typescript
// lineupHelpers.ts (Line 130-139)
export function canTeamManagerEditMatch(
  userRole: string | undefined,
  assignedTeamId: string | undefined,
  homeTeamId: string,
  awayTeamId: string
): boolean {
  if (userRole !== 'team_manager' || !assignedTeamId) {
    return false;
  }
  return assignedTeamId === homeTeamId || assignedTeamId === awayTeamId;
}
```

### 3️⃣ Buscar Jogadores de uma Equipa

```typescript
// squadService.ts (Line 57)
async getTeamSquad(teamId: string): Promise<Player[]> {
  const response = await this.api.get(`/players/team/${teamId}`);
  return response.data.data || [];
}

// Uso
const players = await squadService.getTeamSquad(teamId);
```

### 4️⃣ Salvar Escalação

```typescript
// LiveMatchManager.tsx + liveMatchService.ts
// POST /api/team-manager/lineups/{matchId}/{teamId}
await liveMatchService.saveLineup(matchId, teamId, {
  formation: "4-3-3",
  startingXI: players,
  bench: substitutes
});
```

### 5️⃣ Mapear Casa/Fora para IDs

```typescript
// MatchCardPremium.tsx (Lines 85-110)
let homeTeamName = match.casa || match.homeTeam?.name || 'Casa';
let awayTeamName = match.fora || match.awayTeam?.name || 'Fora';

// Para obter IDs (se tiver homeTeam object)
const homeTeamId = match.homeTeam?.id;
const awayTeamId = match.awayTeam?.id;
```

### 6️⃣ Filtrar Matches por Equipa

```typescript
// TeamMatchesSection.tsx (Line 41)
const teamMatches = matches.filter(
  (m) => m.casa.toLowerCase() === teamName.toLowerCase() || 
         m.fora.toLowerCase() === teamName.toLowerCase()
);

// Com IDs (preferivelmente)
const teamMatches = matches.filter(
  (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
);
```

---

## 🔗 API ENDPOINTS PARA TEAM IDS

### Team Data

```
GET /api/teams                     # Todos os teams
GET /api/teams/{teamId}            # Um team específico
GET /api/clubs                     # Alternativo (MongoDB Club model)
```

### Jogadores de Equipa

```
GET /api/players/team/{teamId}               # Squad
GET /api/players/team/{teamId}/stats         # Squad com stats
POST /api/players/team/{teamId}              # Add player
```

### Escalação

```
GET /api/team-manager/lineups/:matchId/:teamId     # Carregar
POST /api/team-manager/lineups/:matchId/:teamId    # Salvar
GET /api/live-match/:matchId/lineup/:teamId        # Alt endpoint
```

### Jogos do Team Manager

```
GET /api/team-manager/matches                      # Meus jogos (por assignedTeam)
GET /api/team-manager/matches-by-team/{teamId}    # Jogos de uma equipa
```

---

## 📊 CONVERSÃO DE DADOS

### String ↔ ObjectId

```javascript
// Backend (Node/MongoDB)
const teamIdStr = "507f1f77bcf86cd799439011";
const teamObjId = mongoose.Types.ObjectId(teamIdStr);

// Comparação segura
match.homeTeam._id.toString() === user.assignedTeam.toString();

// Frontend (TypeScript)
const userTeamIdStr = String(userTeamId).trim();
const homeTeamIdStr = String(matchHomeTeamId).trim();
const match = userTeamIdStr === homeTeamIdStr;
```

### Casa/Fora → Team Objects

```typescript
// Se tiver match com casa/fora
const homeTeamStr = match.casa;    // "Santa Clara B"
const awayTeamStr = match.fora;    // "Angrense"

// Precisa fazer lookup:
// 1. Buscar na lista de teamsconst homeTeam = teams.find(t => t.name === homeTeamStr);
const awayTeam = teams.find(t => t.name === awayTeamStr);

// 2. Ou usar homeTeam/awayTeam se disponível
const homeTeamId = match.homeTeam?.id;
const awayTeamId = match.awayTeam?.id;
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

| Problema | Causa | Solução |
|----------|-------|---------|
| **"Team not found"** | `teamId` string inválido | Verificar em `Match.homeTeam.id` ou `awayTeam.id` |
| **Permissão negada** | `user.assignedTeam !== match.homeTeam.id` | Comparar com `.toString()` dos ambos os lados |
| **Casa/fora vazios** | API retorna com `homeTeam/awayTeam` | Usar fallback: `match.casa \|\| match.homeTeam?.name` |
| **Não vejo jogadores** | `teamId` errado/não existem | Verificar `GET /api/players/team/{teamId}` no Postman |
| **Escalação não carrega** | URL errado ou `teamId` inválido | Validar em browser console: `console.log(teamId)` |
| **ObjectId vs String** | Comparação entre tipos diferentes | Sempre converter: `.toString()` ou `String()` |

---

## 🎓 EXEMPLO COMPLETO: Ler Match e Extrair Team IDs

```typescript
// Frontend Component
import { liveMatchService } from '@/services/liveMatchService';
import { squadService } from '@/services/squadService';
import { canTeamManagerEditMatch } from '@/utils/lineupHelpers';
import { useAuth } from '@/contexts/AuthContext';

export const MyComponent = () => {
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [squad, setSquad] = useState([]);
  
  const loadMatch = async (matchId: string) => {
    // 1. Carregar match com team info
    const matchData = await liveMatchService.getMatchDetails(matchId);
    setMatch(matchData);
    // matchData.homeTeam = { id: "507f...", name: "Santa Clara B", logo: "..." }
    // matchData.awayTeam = { id: "507f...", name: "Angrense", logo: "..." }
    
    // 2. Validar permissões
    const canEdit = canTeamManagerEditMatch(
      user?.role,
      user?.assignedTeam,
      matchData.homeTeam.id,
      matchData.awayTeam.id
    );
    
    if (!canEdit) {
      alert("Sem permissão para editar");
      return;
    }
    
    // 3. Carregar squad da minha equipa
    const myTeamId = user?.assignedTeam;
    const players = await squadService.getTeamSquad(myTeamId);
    // players[] = [
    //   { id: "...", name: "João", teamId: "507f...", number: 1, ... },
    //   ...
    // ]
    setSquad(players);
  };
  
  return (
    <div>
      <h2>{match?.homeTeam.name} vs {match?.awayTeam.name}</h2>
      <p>Jogadores ({squad.length}):</p>
      <ul>
        {squad.map(p => <li key={p.id}>{p.number}. {p.name}</li>)}
      </ul>
    </div>
  );
};
```

---

## 🎯 CHECKLIST: Implementar Team ID Integration

- [ ] Usar `homeTeam.id` e `awayTeam.id` para referências internas
- [ ] Comparar `user.assignedTeam` com string `.toString()`
- [ ] Suportar fallback `casa/fora` para legacy data
- [ ] Usar `squadService.getTeamSquad(teamId)` para jogadores
- [ ] Validar permissões com `canTeamManagerEditMatch()`
- [ ] Usar `/api/players/team/{teamId}` endpoint
- [ ] Usar `/api/team-manager/lineups/:matchId/:teamId` para escalação
- [ ] Testar com múltiplas equipas (Casa e Fora)

---

Este documento é um **quick reference** do mapa completo em `TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md`

