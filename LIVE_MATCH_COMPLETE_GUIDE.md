# 🎮 Guia Completo: Escalação → Jogo ao Vivo (Live Match Management)

## Overview
Sistema completo que permite ao **Team Manager**:
1. ✅ **Guardar Escalação** (Lineup) antes do jogo
2. ✅ **Recarregar Escalação** automaticamente ao voltar
3. ✅ **Gerir Jogo ao Vivo** com eventos em tempo real

---

## 📋 Architecture Implemented

### Backend (Node.js + Express + MongoDB)
```
/azores-score-backend/
├── models/
│   ├── Match.js       ✅ (eventos, scores, status)
│   ├── Lineup.js      ✅ (formação, 11 jogadores, substitutos)
│   └── Standing.js    ✅ (classificações actualizadas ao final)
├── controllers/
│   └── liveMatchController.js ✅
├── routes/
│   ├── liveMatchRoutes.js    ✅ (endpoints do jogo ao vivo)
│   └── lineupRoutes.js       ✅ (save + load escalação)
└── services/
    └── liveMatchService.js   ✅ (lógica de negócio)
```

### Frontend (React + TypeScript)
```
/azores-football-live-main/
├── services/
│   └── liveMatchService.ts   ✅ (API client)
├── pages/
│   ├── MatchLineupPage.tsx    ✅ (guardar escalação + recarregar)
│   └── LiveMatchManager.tsx   ✅ (gerir eventos ao vivo)
├── components/
│   ├── matches/
│   │   └── MyMatchCard.tsx    ✅ (botões: Escalação | Jogo ao Vivo)
│   └── live/
│       ├── ScoreHeader.tsx     ✅ (placar em directo)
│       ├── EventTimeline.tsx   ✅ (timeline de eventos)
│       ├── ActionButtons.tsx   ✅ (botões de acção)
│       ├── EventModal.tsx      ✅ (modal para registar eventos)
│       └── MatchStatusControls.tsx ✅ (controlar status do jogo)
```

---

## 🚀 Complete User Flow

### **FASE 1: Team Manager - Antes do Jogo (Escalação)**

#### Passo 1: Visualizar Meus Jogos
```
1. Team Manager acede a: http://localhost:8001/my-matches
2. Vê lista de jogos agendados (status = "scheduled")
3. Para cada jogo, vê 2 opções:
   - ✅ Gerir Escalação (para jogos agendados)
   - ✅ Gerir Jogo ao Vivo (para jogos ao vivo)
```

#### Passo 2: Guardar Escalação
```
1. Clica em "Gerir Escalação"
2. Navega para: /match-lineup/:matchId
3. Selecciona:
   - ✅ Formação (4-3-3, 4-4-2, 5-3-2, etc)
   - ✅ 11 jogadores iniciais
   - ✅ Substitutos
   - ✅ Capitão e Vice-Capitão
4. Clica em "GUARDAR ESCALAÇÃO"
5. ✅ Mensagem de sucesso com:
   - Formação guardada
   - Número de jogadores (11/11)
   - Timestamp
6. Redireciona para /my-matches
```

#### Passo 3: Recarregar Escalação (NOVO!)
```
Cenário 1: Team manager volta à página
- Recarrega: /match-lineup/:matchId
- ✅ Escalação anterior é AUTOMATICAMENTE carregada
- Mostra mensagem: "✅ Escalação anterior carregada (4-3-3, 11 jogadores)"
- Pode continuar editando

Cenário 2: Browser fecha/recarrega
- Mesma coisa: dados recarregam automaticamente do MongoDB
- Escalação persiste 100%
```

---

### **FASE 2: Team Manager - Durante o Jogo (Live Match)**

#### Passo 1: Jogo Inicia (Status = "live")
```
Admin (ou sistema automático) altera status do jogo para "live"
Team Manager vê mudança imediata em /my-matches:
- Botão anterior "Gerir Escalação" desaparece
- ✅ NOVO botão "🎮 Gerir Jogo ao Vivo" (vermelho) aparece
```

#### Passo 2: Abrir Live Match Manager
```
1. Team Manager clica: "🎮 Gerir Jogo ao Vivo"
2. Navega para: /live-match/:matchId
3. Vê interface Flashscore-style com:

   TOP (Score Header):
   ┌─────────────────────────────┐
   │ Pico AC        2 - 1        Vitória │
   │ 45'            ⏱️ LIVE       │
   │ Intervalo                    │
   └─────────────────────────────┘

   MIDDLE (Event Timeline):
   ⚽ 12' - Golo - João Silva
   🟨 28' - Amarelo - Pedro Santos
   🔄 35' - Substituição - Rui sai, André entra

   BOTTOM (Action Buttons):
   [ ⚽ Golo ]   [ 🟨 Cartão ]   [ 🔄 Subst. ]   [ ⏱️ +Tempo ]
   [ ⏸ Intervalo ]   [ ▶️ 2ª Parte ]   [ 🏁 Terminar ]
```

#### Passo 3: Registar Eventos
```
Exemplo 1 - Registar Golo:
1. Clica: [ ⚽ Golo ]
2. Modal abre:
   - Tipo: "Goal"
   - Minuto: 45 (auto-preenchido)
   - Jogador: Selecciona João Silva
   - Guardar
3. ✅ Score atualiza automaticamente: 2 - 1
4. ✅ Timeline mostra novo evento
5. Socket.io emite evento em tempo real (opcional)

Exemplo 2 - Registar Cartão:
1. Clica: [ 🟨 Cartão ]
2. Modal abre:
   - Tipo: "Yellow Card"
   - Minuto: 28
   - Jogador: Pedro Santos
   - Guardar
3. ✅ Evento aparece na timeline

Exemplo 3 - Registar Substituição:
1. Clica: [ 🔄 Subst. ]
2. Modal abre:
   - Tipo: "Substitution"
   - Minuto: 35
   - Jogador SAI: Rui Ferreira
   - Jogador ENTRA: André Teixeira
   - Guardar
3. ✅ Evento registado
```

#### Passo 4: Controlar Status do Jogo
```
1. Clica: [ ⏸ Intervalo ] → Status = "halftime"
2. Clica: [ ▶️ 2ª Parte ] → Status = "second_half"
3. Clica: [ 🏁 Terminar ] → Status = "finished"

Quando termina:
✅ Sistema actualiza automaticamente:
  - Classificação da equipa de casa
  - Classificação da equipa visitante
  - vitória = +3 pontos
  - empate = +1 ponto
  - derrota = 0 pontos
  - Golos marcados/sofridos
```

#### Passo 5: Regressar ao Jogo
```
Em tempo real:
- Frontend refresca dados a cada 5 segundos
- Novo botão [ 🔄 Recarregar ] para actualização manual
- Socket.io (opcional) para actualizações instantâneas
```

---

## 📡 API Endpoints

### Escalação (Lineup)
```
POST /api/team-manager/lineups
├─ matchId: string
├─ formation: "4-3-3" | "4-4-2" | etc
├─ starters: [{playerId, position, isCaptain, isViceCaptain}]
├─ substitutes: [{playerId, position}]
└─ Response: 201 + escalação guardada

GET /api/team-manager/lineups/:matchId/:teamId
└─ Response: 200 + escalação anterior (ou 404 se não existir)
```

### Jogo ao Vivo (Live Match)
```
POST /api/live-match/:matchId/start
└─ Response: 200 + match with status="live"

POST /api/live-match/:matchId/event
├─ type: "goal" | "yellow_card" | "red_card" | "substitution"
├─ minute: number
├─ playerId?: ObjectId (para goal/card)
├─ playerInId?: ObjectId (para subst)
├─ playerOutId?: ObjectId (para subst)
└─ Response: 201 + match updated + score

POST /api/live-match/:matchId/status
├─ status: "live" | "halftime" | "second_half" | "finished"
└─ Response: 200 + match updated

POST /api/live-match/:matchId/finish
├─ league: string
├─ season: string
└─ Response: 200 + match updated + standings

POST /api/live-match/:matchId/added-time
├─ minutes: number
└─ Response: 200 + match updated

GET /api/live-match/:matchId
└─ Response: 200 + match details with all events
```

---

## 🧪 Testing Steps (Verificar Tudo Funciona)

### 1️⃣ Verificar Servidores
```bash
# Backend rodando na porta 3000
curl http://localhost:3000/api/live-match/test

# Frontend rodando na porta 8001
http://localhost:8001
```

### 2️⃣ Testar Escalação
```
1. Fazer Login como Team Manager
2. Ir para /my-matches
3. Clicar em "Gerir Escalação" para jogo agendado
4. Seleccionar:
   - Formação: 4-3-3
   - 11 jogadores
   - Capitão
5. Guardar
6. ✅ Ver mensagem de sucesso
7. Recarregar página (F5)
8. ✅ Dados devem estar PRÉ-CARREGADOS
```

### 3️⃣ Testar Live Match Manager
```
Operação Prévia: Alterar status do jogo para "live"

1. Fazer Login como Team Manager
2. Ir para /my-matches
3. Para um jogo com status="live":
   - Deve aparecer botão "🎮 Gerir Jogo ao Vivo" (vermelho)
   - Botão "Gerir Escalação" deve desaparecer
4. Clica no botão
5. Deve navegar para /live-match/:matchId
6. Deve ver:
   - ✅ Score Header com placar
   - ✅ Timeline vazia (sem eventos ainda)
   - ✅ Botões de acção
7. Testar cada acção:
   - [ ⚽ Golo ] → Modal abre, pode seleccionar jogador
   - [ 🟨 Cartão ] → Modal para cartão
   - [ 🔄 Subst. ] → Modal para substituição
   - [ ⏱️ +Tempo ] → Adiciona tempo extra
8. Depois de adicionar evento:
   - ✅ Score atualiza automaticamente (se golo)
   - ✅ Evento aparece na timeline
   - ✅ Mensagem de sucesso
9. Testar mudanças de status:
   - [ ⏸ Intervalo ]
   - [ ▶️ 2ª Parte ]
   - [ 🏁 Terminar ]
10. Ao terminar:
    - ✅ Redireciona para /matches
    - ✅ Classificações devem estar actualizadas
```

---

## 🔧 Database Schema Verification

### Match Document
```javascript
{
  _id: ObjectId,
  homeTeam: ObjectId,           // ref: Club
  awayTeam: ObjectId,           // ref: Club
  date: Date,
  status: "scheduled|live|halftime|second_half|finished",
  homeScore: 2,
  awayScore: 1,
  events: [
    {
      type: "goal|yellow_card|red_card|substitution",
      minute: 45,
      player: ObjectId,         // ref: Player
      team: ObjectId,           // ref: Club
      timestamp: Date
    }
  ],
  addedTime: 5,
  createdAt: Date,
  updatedAt: Date
}
```

### Lineup Document
```javascript
{
  _id: ObjectId,
  match: ObjectId,              // ref: Match
  team: ObjectId,               // ref: Club
  formation: "4-3-3",
  starters: [
    {
      playerId: ObjectId,
      playerName: "João Silva",
      playerNumber: 1,
      position: "goalkeeper|defender|midfielder|forward",
      isCaptain: true,
      isViceCaptain: false
    }
  ],
  substitutes: [
    {
      playerId: ObjectId,
      playerName: "Ricardo Alves",
      playerNumber: 12,
      position: "goalkeeper",
      benchNumber: 1
    }
  ],
  createdBy: ObjectId,          // ref: User (Team Manager)
  status: "draft|submitted|approved|locked",
  createdAt: Date,
  updatedAt: Date
}
```

### Standing Document
```javascript
{
  _id: ObjectId,
  league: "Campeonato dos Açores",
  season: "2025/2026",
  team: "Pico AC",
  position: 1,
  played: 10,
  won: 8,
  drawn: 1,
  lost: 1,
  goalsFor: 24,
  goalsAgainst: 8,
  goalDifference: 16,
  points: 25,
  lastUpdated: Date
}
```

---

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/azores-score
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env / vite.config.ts)
```
VITE_API_URL=http://localhost:3000/api
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🐛 Troubleshooting

### Problema: "Escalação não carrega"
**Solução:**
1. Verificar se GET endpoint existe: `GET /api/team-manager/lineups/:matchId/:teamId`
2. Verificar se Lineup foi guardada no MongoDB: `db.lineups.find()`
3. Verificar token JWT na auth header
4. Verificar assignedTeam do user

### Problema: "Jogo só mostra botão 'Escalação', não 'Jogo ao Vivo'"
**Solução:**
1. Admin deve alterar status do jogo para "live"
2. Página deve recarregar para ver nova interface
3. Verificar se status = "live" no Match document

### Problema: "Score não actualiza ao registar golo"
**Solução:**
1. Verificar evento foi criado no Match.events
2. Aguardar 5 segundos para refresco (ou clicar reload)
3. Verificar console do browser para erros

### Problema: "Classificações não actualizam ao terminar jogo"
**Solução:**
1. Verificar SE/COMO finishMatch foi chamado
2. Verificar Standing document foi criado/actualizado
3. Verificar league e season foram passados correctamente

---

## 📊 Frontend State Management

### LiveMatchManager.tsx
```typescript
const [match, setMatch] = useState<Match>()      // Dados completos do jogo
const [elapsedMinutes, setElapsedMinutes] = useState(0)  // Cronómetro
const [events, setEvents] = useState<Event[]>()  // Lista de eventos
const [status, setStatus] = useState('scheduled') // Estado actual
const [saving, setSaving] = useState(false)      // Loading state
const [error, setError] = useState('')           // Erros
const [success, setSuccess] = useState('')       // Sucesso
```

### MatchLineupPage.tsx
```typescript
const [selectedPlayers, setSelectedPlayers] = useState<LineupPlayer[]>()  // 11 titulares
const [substitutes, setSubstitutes] = useState<CallUpPlayer[]>()         // Banco
const [formation, setFormation] = useState<FormationName>('4-3-3')        // Formação
const [captain, setCaptain] = useState<string | null>()                   // Capitão
const [viceCaptain, setViceCaptain] = useState<string | null>()           // Vice
const [successMessage, setSuccessMessage] = useState<string | null>()     // Feedback
```

---

## 📈 Performance Notes

- ✅ Refresco de dados a cada 5 segundos (configurable)
- ✅ Modo de polling (sem Socket.io)
- ✅ Socket.io event emitted mas não essential
- ✅ Mensagens de loading/erro para feedback visual

---

## 🎯 Next Steps (Futuro)

- [ ] Implementar Socket.io para actualizações em tempo real
- [ ] Adicionar notificações Push para eventos importantes
- [ ] Criar relatório detalhado do jogo
- [ ] Implementar replay de eventos
- [ ] Stats detalhadas dos jogadores

---

**Data**: April 3, 2026  
**Status**: ✅ COMPLETE AND TESTING READY  
**Last Updated**: Abril 2026
