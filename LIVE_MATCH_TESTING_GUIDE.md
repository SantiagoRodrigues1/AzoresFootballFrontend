# 🎮 Live Match Manager - Guia Completo de Testes

## Visão Geral do Sistema

O **Live Match Manager** é um sistema completo para gerenciar eventos de jogos em direto. Um Team Manager pode registar eventos como golos, cartões e substituições em tempo real durante um jogo.

---

## 📋 COMPONENTES CRIADOS

### Backend (Node.js + Express + MongoDB)

#### 1. **Serviço de Negócio** - `services/liveMatchService.js`
Implementa toda a lógica de negócio:
- `startMatch()` - Inicia um jogo
- `addMatchEvent()` - Adiciona eventos (golos, cartões, substituições)
- `updateMatchStatus()` - Altera status do jogo (live, halftime, second_half, finished)
- `finishMatch()` - Termina jogo e atualiza classificações automaticamente
- `validateManagerPermission()` - Valida permissões do manager
- `_updateTeamStanding()` - Helper para atualizar classificações

#### 2. **Controller** - `controllers/liveMatchController.js`
Endpoints HTTP:
- `POST /live-match/:matchId/start` - Iniciar jogo
- `POST /live-match/:matchId/event` - Adicionar evento
- `POST /live-match/:matchId/status` - Atualizar status
- `POST /live-match/:matchId/finish` - Terminar jogo
- `POST /live-match/:matchId/added-time` - Adicionar tempo
- `GET /live-match/:matchId` - Ver detalhes do jogo

#### 3. **Rotas** - `routes/liveMatchRoutes.js`
Configura proteção com autenticação JWT e role-based access control (RBAC).

#### 4. **Integração** - `server.js`
Registada rota: `app.use('/api/live-match', liveMatchRoutes);`

---

### Frontend (React + TypeScript + Vite)

#### 1. **Página Principal** - `pages/LiveMatchManager.tsx`
- Timer do jogo em temps real
- Gerenciamento de eventos
- Integração com componentes
- Polling automático a cada 5 segundos

#### 2. **Componentes**:

**ScoreHeader.tsx**
- Placar ao vivo (home 1 - 0 away)
- Timer piscante
- Badge de status (DIRETO, INTERVALO, 2ª PARTE, TERMINADO)
- Logos das equipas

**EventTimeline.tsx**
- Lista de eventos ordenada por minuto (mais recente acima)
- Ícones: ⚽ 🟨 🟥 🔄
- Detalhes de cada evento
- Nomes dos jogadores (marcadores, cartões, substituições)

**ActionButtons.tsx**
- 4 botões grandes na parte inferior
- ⚽ Golo | 🟨 Cartão | 🔄 Substituição | ⏱️ Tempo +
- Fixed positioning para acesso rápido
- Mobile-first design

**EventModal.tsx**
- Modal para registar eventos
- Inputs: Minuto, Jogador(es)
- Validação de dados
- Estados de loading

**MatchStatusControls.tsx**
- Botões para controlar status
- 🎮 Iniciar | ⏸️ Intervalo | ▶️ 2ª Parte | 🏁 Terminar

#### 3. **Serviço API** - `services/liveMatchService.ts`
Cliente TypeScript com axios:
- `startMatch(matchId)` 
- `addEvent(matchId, event)`
- `updateStatus(matchId, status)`
- `finishMatch(matchId, league, season)`
- `addAddedTime(matchId, minutes)`
- `getMatchDetails(matchId)`

JWT auto-injeção no Authorization header.

---

## 🧪 TESTES MANUAIS

### 1. **Acesso à Página**

```
URL: http://localhost:8082/live-match/{matchId}
```

Substitua `{matchId}` com um ID real de um jogo no BD.

### 2. **Fluxo Básico**

1. ✅ Página carrega com detalhes do jogo
2. ✅ Status inicial: "Agendado" ou "Scheduled"
3. ✅ Tempo em 00'
4. ✅ Botões de ação desativados (cinzentos)

### 3. **Iniciar Jogo**

1. Clique em "⚙️ Controlo do Jogo"
2. Clique em "🎮 Iniciar Jogo"
3. **Expectativa:**
   - Status muda para "🔴 DIRETO"
   - Timer começa a contar (1', 2', 3'...)
   - Botões de ação ficam ativos (coloridos)

### 4. **Adicionar Golo**

1. Clique no botão "⚽ Golo"
2. Modal abre
3. Campos: Minuto (pré-preenchido), Jogador (dropdown)
4. Selecione um jogador
5. Clique "Guardar"
6. **Expectativa:**
   - ✅ Timeline atualiza com evento "⚽ Golo"
   - ✅ Placar incrementa (1-0)
   - ✅ Nome do jogador marcador aparece
   - ✅ Mensagem de sucesso

### 5. **Adicionar Cartão**

1. Clique no botão "🟨 Cartão"
2. Modal abre
3. Selecione um jogador
4. Clique "Guardar"
5. **Expectativa:**
   - Timeline mostra "🟨 Cartão Amarelo"
   - Nome do jogador aparece

### 6. **Adicionar Substituição**

1. Clique "🔄 Substituição"
2. Modal com 2 dropdowns:
   - "Jogador a Sair"
   - "Jogador a Entrar"
3. Selecione ambos (podem ser diferentes)
4. Clique "Guardar"
5. **Expectativa:**
   - Timeline mostra "🔄 Substituição"
   - ❌ Jogador sai (vermelho)
   - ✅ Jogador entra (verde)

### 7. **Intervalo**

1. Clique "⏸️ Intervalo"
2. **Expectativa:**
   - Status muda para "INTERVALO"
   - Botão muda para "▶️ 2ª Parte"
   - Timer para em 45'

### 8. **Segunda Parte**

1. Clique "▶️ 2ª Parte"
2. **Expectativa:**
   - Status muda para "🔴 2ª PARTE"
   - Timer continua (46', 47'...)

### 9. **Tempo Adicional**

1. Clique "⏱️ Tempo +"
2. Dialog pergunta: "Quantos minutos adicionar?"
3. Digite: 5
4. **Expectativa:**
   - Tempo adicional aparece no header
   - No minuto 45, mostra "45+5"

### 10. **Terminar Jogo**

1. Clique "🏁 Terminar"
2. Confirmação: "Tem a certeza que quer terminar o jogo?"
3. Clique "OK"
4. **Expectativa:**
   - ✅ Status muda para "🏁 TERMINADO"
   - ✅ Classificações atualizam automáticamente
   - ✅ Timeline congelada
   - ✅ Botões desativados
   - ✅ Redirecionado para /matches em 2 segundos

---

## 🔌 TESTES COM API (CURL)

### 1. **Iniciar Jogo**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/start \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Jogo iniciado com sucesso",
  "data": {
    "id": "...",
    "status": "live",
    "homeScore": 0,
    "awayScore": 0
  }
}
```

### 2. **Adicionar Golo**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/event \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "goal",
    "minute": 25,
    "playerId": "player-1"
  }'
```

### 3. **Adicionar Cartão Amarelo**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/event \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "yellow_card",
    "minute": 30,
    "playerId": "player-2"
  }'
```

### 4. **Adicionar Substituição**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/event \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "substitution",
    "minute": 60,
    "playerOutId": "player-3",
    "playerInId": "player-4"
  }'
```

### 5. **Atualizar Status**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/status \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "halftime"
  }'
```

### 6. **Terminar Jogo**

```bash
curl -X POST http://localhost:3000/api/live-match/{matchId}/finish \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "league": "Campeonato dos Açores",
    "season": "2025/2026"
  }'
```

---

## 📊 VERIFICAÇÃO DE STANDINGS

Após terminar um jogo, as classificações devem ser atualizadas:

```bash
curl http://localhost:3000/api/standings \
  -H "Authorization: Bearer {TOKEN}"
```

Ou no MongoDB:

```bash
db.standings.find({ league: "Campeonato dos Açores", season: "2025/2026" })
```

Devem aparecer:
- `played`: incrementado
- `goalsFor`: incrementado
- `goalsAgainst`: incrementado
- `points`: +3 (vitória), +1 (empate), 0 (derrota)

---

## 🐛 TROUBLESHOOTING

### Problema: Modal não abre
**Solução:** Verifique browser console (F12) para erros JavaScript.

### Problema: Eventos não salvam
**Solução:** 
- Verifique token JWT está válido
- Confirme manager pertence à equipa do jogo
- Verifique console do backend para logs

### Problema: Timer não conta
**Solução:** Verifique se status do jogo é "live" ou "second_half".

### Problema: Classificações não atualizam
**Solução:** 
- Confirme que finishMatch foi chamado
- Verifique logs do backend: "✅ Classificações atualizadas"
- Confirme liga e temporada estão corretos

---

## ✅ CHECKLIST DE QUALIDADE

- [x] Sem erros TypeScript
- [x] Sem erros de compilação compilação
- [x] Mobile responsivo (testar em 640px, 1024px)
- [x] Sem duplicate React keys
- [x] JWT injetado automaticamente
- [x] Validação de permissões (manager só vê seu jogo)
- [x] Estados de loading
- [x] Mensagens de erro
- [x] Transações MongoDB (rollback se erro)
- [x] Clean code, comments
- [x] Production-ready

---

## 🚀 PRÓXIMOS PASSOS (Opcional)

1. **Socket.io**: Real-time updates para múltiplos managers
2. **Squads**: Buscar jogadores reais do BD
3. **Analytics**: Estatísticas de jogadores
4. **Video Integration**: Links de vídeos dos golos
5. **Notifications**: Notificar adeptos de eventos
