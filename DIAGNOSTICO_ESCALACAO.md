# Diagnóstico Completo: Escalação não carrega no LiveMatchManager

## 1. Fluxo Esperado

```
1. User faz login como team_manager
   └─ Backend retorna { success: true, data: { user: { ..., assignedTeam: "club_id" }, token: "..." } }
   └─ Frontend armazena user no localStorage
   
2. User vai para Gestor de Equipa
   └─ Cria uma escalação (11 jogadores)
   └─ Clica "Guardar Escalação"
   └─ POST /api/team-manager/lineups é chamado
   └─ Backend salva no MongoDB collection "lineups"
   
3. User clica "Gerir Jogo ao Vivo"
   └─ LiveMatchManager carrega
   └─ Match é carregado (GET /api/matches/{matchId})
   
4. LiveMatchManager tenta carregar escalação
   └─ Extrai user.assignedTeam
   └─ GET /api/team-manager/lineups/{matchId}/{assignedTeam}
   └─ Se 200: Carrega starters da escalação
   └─ Se 404: Fallback para squad genérico
   └─ Se squad vazio: Cria 11 mock players

5. EventModal abre
   └─ players array preenchido com pelo menos 11 jogadores
   └─ Permite selecionar jogador para golo/cartão/substituição
```

## 2. Possíveis Problemas

### Problema A: Escalação Nunca Foi Salva
**Sintomas:**
- EventModal abre mas sem jogadores
- Console mostra: "Escalação não encontrada: 404"

**Solução:**
- Ir para Gestor de Equipa
- Criar uma escalação (11 jogadores)
- Clicar "Guardar Escalação"
- Depois voltar ao LiveMatchManager

### Problema B: User SEM assignedTeam
**Sintomas:**
- Console mostra: "⚠️ Match ou team do utilizador não disponível"
- players.length === 0

**Diagnóstico:**
```
if (!user?.assignedTeam) return; // <-- isso acontece!
```

**Causa Possível:**
- User não é team_manager (role é diferente)
- User é team_manager mas sem equipa atribuída
- Backend não retorna assignedTeam no login

**Solução:**
- Verificar em DevTools: `localStorage.getItem('azores_score_user')`
- Procurar por `assignedTeam` na resposta
- Se não existe, contactar admin para ser atribuída equipa

### Problema C: Token Não Está Sendo Passado
**Sintomas:**
- GET /api/team-manager/lineups retorna 401

**Diagnóstico:**
```
Authorization header não está sendo enviado
```

**Solução:**
- Verificar se token existe em localStorage
- Verificar Network tab se Authorization header está presente

### Problema D: Token Expirado
**Sintomas:**
- GET /api/team-manager/lineups retorna 401
- Mas user.assignedTeam existe

**Solução:**
- Fazer logout e login novamente

## 3. Teste Passo a Passo

### No Browser (F12 DevTools)

**Step 1: Verificar Autenticação**
```javascript
// No console
localStorage.getItem('azores_score_user')
// Deve retornar algo como:
// {"id":"...","email":"...","role":"team_manager","assignedTeam":"club_xyz"}
```

**Step 2: Verificar Token**
```javascript
localStorage.getItem('azores_score_token')
// Deve retornar um token JWT (muito longo)
```

**Step 3: Checar Network Requests**
- Abrir aba Network
- Navegar para LiveMatchManager
- Procurar por request a `/api/matches/{matchId}`:
  - Deve retornar 200 com dados do jogo
  
- Procurar por request a `/api/team-manager/lineups/{matchId}/{teamId}`:
  - Se retorna 200: Escalação existe, verificar response body
  - Se retorna 404: Escalação não salva ainda
  - Se retorna 401: Token inválido ou não enviado

**Step 4: Abrir EventModal**
- Clicar em "⚽ Golo"
- Checar console para logs:
  - Se vir "ESCALAÇÃO SALVA CARREGADA" → funcionou!
  - Se vir "Squad genérico carregado" → falback para squad
  - Se vir "criando 11 jogadores mock" → falback final

## 4. Verificação de Dados no Backend

### Verificar se há escalações salvas
```bash
# Terminal no PC:
cd c:\Users\santiago\Documents\AzoresScore-PAP\azores-score-backend
node check-lineups.js
```

Isto mostrará quantas escalações estão no MongoDB.

## 5. Código de Verificação Local

Se todos os fallbacks falharem, o código DEVE criar 11 mock players:

```typescript
// Em LiveMatchManager.tsx, linhas ~127-133
const mockPlayers: Player[] = Array.from({ length: 11 }, (_, i) => ({
  id: `player-${i + 1}`,
  name: `Jogador ${i + 1}`,
  number: i + 1,
  teamId
}));
setPlayers(mockPlayers);
```

Se isto não funcionar, o problema é mais profundo na renderização do componente.

## 6. Passos para Resolver Definitivamente

1. ✅ Verificar se tem escalação salva (Backend)
2. ✅ Verificar se user tem assignedTeam (Frontend)
3. ✅ Verificar se token é válido (Frontend)
4. ✅ Abrir Network tab e ver requests
5. ✅ Se tudo falhar: Fallback para 11 mock players

Se os mock players não aparecem, adicione console.log no componente para debug.
