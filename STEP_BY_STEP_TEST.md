# 🧪 Teste Passo-a-Passo: Team Manager Access Fix

## ✅ Pre-Teste (3 minutos)

### Verificar Servidores

**Terminal 1 - Backend:**
```bash
cd c:\Users\santiago\Documents\AzoresScore-PAP\azores-score-backend
node server.js
```
✅ Esperado:
```
🚀 Servidor a correr em http://localhost:3000
✅ MongoDB conectado via Mongoose!
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\santiago\Documents\azores-football-live-main
npm run dev
```
✅ Esperado:
```
  VITE v5.4.19  ready in 377 ms
  ➜  Local:   http://localhost:8080/
```

### Verificar Conectividade

```powershell
# Teste rápido se backend está respondendo
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```
✅ Esperado: Resposta com status 200

---

## 🎬 Teste Principal (5 minutos)

### 1️⃣ Abrir Browser
```
http://localhost:8080
```

### 2️⃣ Login como Team Manager
**Email:** `manager_angrense_new@league.com`  
**Password:** `temp123`

✅ **Esperado:**
- ✓ Página carrega
- ✓ Login bem-sucedido
- ✓ Redirecionado para homepage
- ✓ No menu inferior: "Minhas Escalações" tab visível

❌ **Se não funcionar:**
- Verifique se backend está rodando
- Verifique console do browser (F12) para erros
- Verifique credenciais (copie/cole para evitar typos)

---

### 3️⃣ Navegar para "Minhas Escalações"
```
Click no tab "Minhas Escalações" (ou "My Matches")
```

✅ **Esperado:**
- ✓ Página carrega
- ✓ Mostra jogos da equipa Angrense
- ✓ Pode estar vazio se não há jogos

❌ **Se erro "Acesso negado":**
- Backend não registou a nova rota
- Reinice backend: `Ctrl+C` e `node server.js` de novo
- Aguarde 3 segundos
- Recarregue página (F5)

---

### 4️⃣ Clicar num Jogo
```
Se há jogo na lista:
  Click no botão "Gerir Escalação" ou no card do jogo
Se não há jogo:
  Skip para resultado esperado
```

✅ **Esperado:**
- ✓ Página MatchLineupPage carrega
- ✓ Vê "✏️ Editar Escalação" no topo
- ✓ Vê "Preparação do Jogo" painel
- ✓ Vê campo de formação
- ✓ Vê pitch de futebol vazio

❌ **Se erro "Acesso negado. Apenas administradores...":**
- ✓✓ PROBLEMA NÃO FOI CORRIGIDO ✓✓
- Contactar para debug
- Adicione screenshot do erro

---

### 5️⃣ Teste de Lineup (Opcional)
Se conseguiu aceder ao MatchLineupPage:

```
1. Click botão "✨ Gerar Escalação Sugerida"
   ✅ Esperado: Preenche 11 jogadores
   
2. Selecione capitão no dropdown "👑 CAPITÃO"
   ✅ Esperado: Seleciona jogador
   
3. Click "Guardar Escalação"
   ✅ Esperado: Mostra sucesso, redireciona
```

---

## 🔄 Teste Adicional (Outro Team Manager)

### Repetir com Outra Equipa
```
Login diferente:
manager_velhense_new@league.com / temp123
```

✅ **Esperado:**
- Mesmo sucesso que com Angrense
- Redirecionado para "Minhas Escalações"
- Vê apenas jogos onde Velhense está envolvida

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /api/team-manager/matches"
**Causa:** Servidor não carregou a nova rota  
**Solução:**
1. Feche backend (Ctrl+C)
2. Aguarde 2 segundos
3. Execute: `node server.js`
4. Aguarde: "✅ MongoDB conectado via Mongoose!"
5. Recarregue página (F5)

### Erro: "Token inválido ou expirado"
**Causa:** Token JWT expirou  
**Sol ução:**
1. Saia (logout)
2. Limpe cookies: Ctrl+Shift+Delete
3. Faça login novamente

### Erro: "Utilizador não autenticado"
**Causa:** Token não foi enviado  
**Solução:**
1. Verifique se header Authorization está sendo enviado
2. Abra DevTools (F12) → Network tab
3. Veja requisição para `/api/team-manager/matches`
4. Procure header: `Authorization: Bearer eyJ...`

### Erro: "Acesso negado. Pode apenas aceder aos jogos da sua equipa."
**Causa:** Team manager tentou aceder a jogo de outra equipa  
**Solução:**
Isto é ESPERADO! Segurança de permissões funcionando!
- Só pode aceder a jogos onde a sua equipa está envolvida
- Tente com outro match_id de um jogo onde Angrense está

---

## ✅ Success Checklist

Complete todo este checklist:

- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend rodando em http://localhost:8080
- [ ] Login bem-sucedido como team_manager
- [ ] Tab "Minhas Escalações" visível
- [ ] Pode navegar para "Minhas Escalações"
- [ ] Se há jogos, pode clicar num jogo
- [ ] MatchLineupPage carrega SEM erro "Apenas administradores"
- [ ] "✏️ Editar Escalação" header visível
- [ ] Pode testar com segundo team manager

**Se TODOS os pontos têm ✅ = SUCESSO COMPLETO!**

---

## 📊 Resultado Esperado

### Antes (❌ Bloqueado)
```
Login: manager_angrense_new@league.com
Nav para: Minhas Escalações
Click jogo: ❌ ERRO
"Acesso negado. Apenas administradores podem aceder este recurso."
```

### Depois (✅ Corrigido)
```
Login: manager_angrense_new@league.com
Nav para: Minhas Escalações
Click jogo: ✅ SUCESSO
Carrega MatchLineupPage
"✏️ Editar Escalação" visível
Pode editar lineup, selecionar capitão, guardar
```

---

## 🎯 Conclusão

Se chegou aqui e todos os testes passaram:
✅ **O problema foi COMPLETAMENTE RESOLVIDO**

Pode agora usar o sistema normalmente:
- Team managers conseguem gerir escalações
- Sem erros de permissão
- Com segurança (só veem seus jogos)
- Com todas as funcionalidades profissionais

---

**Status: ✅ SISTEMA FUNCIONANDO**

