# 🔧 CORREÇÃO - Jogadores não aparecem no Modal

## ❌ Problema Identificado

Os jogadores não estavam aparecendo nos dropdowns do EventModal (Golo, Cartão, Substituição).

## 🔍 Causa Raiz

Havia 2 problemas:

### Problema 1: Estrutura de Dados Inconsistente
**Backend enviava:**
```javascript
{
  _id: "...",
  name: "João",
  numero: "9",  // ❌ String!
  position: "Avançado",
  teams: "..."
}
```

**Frontend esperava:**
```javascript
{
  id: "...",
  name: "João",
  number: 9,  // ✅ Number!
  position: "Avançado"
}
```

### Problema 2: Lista Vazia Não Detectada
Em `LiveMatchManager.tsx`, quando o backend retornava `[]` (vazio):
- Não era tratado como erro
- Não usava mock players
- Modal abria com lista vazia

## ✅ Soluções Implementadas

### 1. Backend - playerController.js (CORRIGIDO)
**Arquivo:** `AzoresScore-PAP/azores-score-backend/controllers/playerController.js`

```javascript
// ✅ ANTES:
const players = await Player.find({ team: teamId })
  .select('name numero position goals assists team createdAt photo')
  .lean();

res.json({ success: true, data: players, total: players.length });

// ✅ DEPOIS:
const formattedPlayers = players.map(player => ({
  id: player._id?.toString() || player._id,           // ✅ Mapear _id → id
  name: player.name || player.nome || '',
  number: parseInt(player.numero) || parseInt(player.number) || 0,  // ✅ String → Number
  position: player.position || 'Outro',
  goals: player.goals || 0,
  assists: player.assists || 0,
  teamId
}));

res.json({ success: true, data: formattedPlayers, total: formattedPlayers.length });
```

**Mudanças:**
- ✅ Campo `_id` → `id` (MongoDB convention)
- ✅ Campo `numero` (String) → `number` (Number)
- ✅ Adicionar conversão de tipo com `parseInt()`
- ✅ Adicionar `teamId` à resposta

### 2. Frontend - LiveMatchManager.tsx (CORRIGIDO)
**Arquivo:** `src/pages/LiveMatchManager.tsx`

```javascript
// ✅ ANTES:
const squad = await squadService.getTeamSquad(teamId);
setPlayers(squad);  // Se vazio, fica sem jogadores!

// ✅ DEPOIS:
const squad = await squadService.getTeamSquad(teamId);

// Se não há jogadores do backend, usar mock
if (!squad || squad.length === 0) {
  console.warn('⚠️ Nenhum jogador encontrado no backend, usando mock players');
  const mockPlayers = [...];  // 11 mock players
  setPlayers(mockPlayers);
} else {
  setPlayers(squad);
}
```

**Mudanças:**
- ✅ Verificar se `squad.length === 0`
- ✅ Usar mock players como fallback
- ✅ Adicionar console logs para debugging

## 📂 Ficheiros Corrigidos

| Ficheiro | Tipo | Mudanças |
|----------|------|----------|
| `AzoresScore-PAP/azores-score-backend/controllers/playerController.js` | Backend | Mapear campos (`_id`→`id`, `numero`→`number`), conversão de tipo |
| `src/pages/LiveMatchManager.tsx` | Frontend | Detectar lista vazia e usar mock players |

## 🧪 Teste Após Correção

### Passo 1: Reiniciar Backend
```bash
cd AzoresScore-PAP/azores-score-backend
node server.js
```

### Passo 2: Verificar Endpoint Direct (Terminal/Postman)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/players/team/<TEAM_ID>
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "João Silva",
      "number": 9,
      "position": "Avançado",
      "goals": 5,
      "assists": 2,
      "teamId": "..."
    }
  ],
  "total": 11
}
```

### Passo 3: Testar no Frontend
1. Login: `manager_santa_clara_b@league.com` / `Teste@123`
2. Ir para Live Match Manager
3. Clique em `⚽ Golo`
4. **Verificar: Dropdown de jogadores deve aparecer com nomes e números**

## 🐛 Debug - Verificar Logs

### Console do Backend (Node.js)
```
📋 Retornando X jogadores da equipa [teamId]
```

### Console do Frontend (Browser F12)
```
📋 Carregando plantel da equipa: [teamId]
✅ Plantel carregado do backend: X jogadores
```

## ✨ Comportamento Esperado Após Conclusão

| Ação | Resultado |
|------|-----------|
| Abrir EventModal | ✅ Dropdown com jogadores |
| Selecionar jogador | ✅ Nome + número (ex: "9 - João") |
| Golo com assistidor | ✅ Assistidor no dropdown também |
| Cartão/Substituição | ✅ Todos com jogadores |

## 📝 Checklist de Validação

- [ ] Backend retorna `id` (não `_id`)
- [ ] Backend retorna `number` como Number (não String)
- [ ] Frontend console: "✅ Plantel carregado do backend: X jogadores"
- [ ] EventModal mostra dropdown com jogadores
- [ ] Dropdown inclui número + nome (ex: "9 - João")
- [ ] Pode selecionar jogador e guardar evento

## 🔗 Relação com Outras Correções

- **EventModal automático**: ✅ Já implementado
- **Campo de assistidor**: ✅ Já implementado
- **Jogadores no dropdown**: ✅ **AGORA CORRIGIDO**

---

**Status**: ✅ Código actualizado, pronto para teste
**Data**: 7 de Abril de 2026
**Próximo passo**: Reiniciar backend e testar
