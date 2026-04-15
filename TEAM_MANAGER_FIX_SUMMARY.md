# ✅ CORRIGIDO: Erro de Permissão "Apenas Administradores"

## 🎯 Problema Reportado
```
{
  success: false, 
  message: "Acesso negado. Apenas administradores podem aceder este recurso."
}
```
**Quando**: Clicando num jogo da sua equipa como Team Manager  
**Causa**: O endpoint `/api/admin/matches/{id}` estava bloqueado para team managers

---

## ✅ Solução Implementada

### 1. Novo Endpoint para Team Managers
Criei um novo router específico para team managers com acesso controlado:
- **Ficheiro**: `azores-score-backend/routes/teamManagerRoutes.js`
- **Endpoints**: 
  - `GET /api/team-manager/matches` - Lista jogos da sua equipa
  - `GET /api/team-manager/matches/{id}` - Acesso a um jogo específico

### 2. Validação de Permissões
O novo router valida:
- ✅ Verifica se o utilizador está autenticado (`verifyToken`)
- ✅ Verifica se é team_manager ou admin (`verifyRole`)
- ✅ Para team managers: verifica se a equipa está envolvida no jogo
- ✅ Para admins: acesso total

### 3. Identificação da Equipa
Usa o email do team manager para identificar a equipa:
```
manager_angrense_new@league.com → Equipa: Angrense
manager_velhense_new@league.com → Equipa: Velhense
... etc
```

### 4. Atualização do Frontend
O arquivo `MatchLineupPage.tsx` foi atualizado para usar o novo endpoint:
```typescript
// ANTES (bloqueado para team managers):
/api/admin/matches/{matchId}

// DEPOIS (permitido para team managers):
/api/team-manager/matches/{matchId}
```

---

## 🧪 Teste Realizado

```powershell
✅ Login: manager_angrense_new@league.com / temp123
✅ GET /api/team-manager/matches → Sucesso! Encontrados 1 jogos
✅ GET /api/team-manager/matches/{id} → Sucesso! Acesso ao jogo
✅ Nenhum erro "Apenas administradores"
```

---

## 🚀 Como Testar

### Opção 1: Web (Recomendado)
1. Abrir: **http://localhost:8080**
2. Login: `manager_angrense_new@league.com` / `temp123`
3. Clicar em "Minhas Escalações"
4. Clicar num jogo
5. ✅ Deve aparecer o LineupPage (não erro)
6. ✅ Deve aparecer "✏️ Editar Escalação"

### Opção 2: cURL / PowerShell (Teste API)
```powershell
# 1. Login
$login = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST -Headers @{'Content-Type'='application/json'} `
  -Body '{"email":"manager_angrense_new@league.com","password":"temp123"}' `
  -UseBasicParsing
$token = ($login.Content | ConvertFrom-Json).token

# 2. Listar jogos
$matches = Invoke-WebRequest -Uri "http://localhost:3000/api/team-manager/matches" `
  -Method GET -Headers @{'Authorization'="Bearer $token"} -UseBasicParsing
$matches.Content | ConvertFrom-Json

# 3. Acesso a um jogo (substituir ID)
$match = Invoke-WebRequest -Uri "http://localhost:3000/api/team-manager/matches/{matchId}" `
  -Method GET -Headers @{'Authorization'="Bearer $token"} -UseBasicParsing
$match.Content | ConvertFrom-Json
```

---

## 📊 Ficheiros Modificados

### Backend
1. ✅ **`azores-score-backend/routes/teamManagerRoutes.js`** (NOVO)
   - Novo router com endpoints para team managers
   - Validação de permissões por equipa
   - ~130 linhas

2. ✅ **`azores-score-backend/server.js`** (MODIFICADO)
   - Adicionado import: `const teamManagerRoutes = require('./routes/teamManagerRoutes');`
   - Registado router: `app.use('/api/team-manager', teamManagerRoutes);`

### Frontend
3. ✅ **`azores-football-live-main/src/pages/MatchLineupPage.tsx`** (MODIFICADO)
   - Linha ~119: Alterado endpoint baseado na role do utilizador
   - `isAdmin` → `/api/admin/matches/{id}`
   - `team_manager` → `/api/team-manager/matches/{id}`

---

## 🔒 Segurança

✅ **Team Manager**
- Pode aceder APENAS aos seus próprios jogos
- Identificado via email (manager_[team]_new@league.com)
- Validação bilateral (frontend + backend)

✅ **Admin**
- Pode aceder a TODOS os jogos
- Sem restrições
- Mantém rota original `/api/admin/matches/{id}`

✅ **Outros Utilizadores**
- NÃO podem aceder (401 Unauthorized)
- NÃO conseguem aceder a `/api/team-manager` (não tem role)

---

## 🆗 Validação Completa

### Testes Realizados ✅
- [x] Login como team manager funciona
- [x] Endpoint `/api/team-manager/matches` retorna jogos
- [x] Endpoint GET `/api/team-manager/matches/{id}` funciona
- [x] Sem erro "Apenas administradores"
- [x] Build frontend sem erros
- [x] Both servers running successfully

### Testes Pendentes (Você)
- [ ] Login no http://localhost:8080
- [ ] Navegar para "Minhas Escalações"
- [ ] Clicar num jogo
- [ ] Ver se LineupPage carrega (não erro)
- [ ] Teste com múltiplos team managers

---

## 📞 Próximos Passos

Agora pode testar normalmente:
1. **Frontend**: http://localhost:8080
2. **Credenciais Team Manager**: 
   - `manager_angrense_new@league.com` / `temp123`
   - `manager_velhense_new@league.com` / `temp123`
   - ... (todas as 10 equipas)
3. **Esperado**: 
   - ✅ Ver "Minhas Escalações"
   - ✅ Clicar no jogo
   - ✅ Ver LineupPage
   - ✅ SEM erro "Apenas administradores"

---

## 🎊 Sumário da Correção

| Aspecto | Status |
|--------|--------|
| **Novo Endpoint** | ✅ Criado |
| **Validação** | ✅ Implementada |
| **Frontend Atualizado** | ✅ Sim |
| **Build Validado** | ✅ Sem erros |
| **Teste Básico** | ✅ Passou |
| **Servidores** | ✅ Running |
| **Pronto para Teste** | ✅ SIM |

---

**Status: ✅ CORRIGIDO E PRONTO PARA TESTAR**

O erro "Acesso negado. Apenas administradores podem aceder este recurso." foi completamente resolvido!

