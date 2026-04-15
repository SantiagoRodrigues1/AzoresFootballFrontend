# 🔍 **DEBUG CHECKLIST - Carregamento de Lineup**

## Passos para Diagnosticar

### 1️⃣ Abrir DevTools (F12)
1. Pressionar **F12** ou clique direito → "Inspecionar"
2. Ir à aba **"Console"**
3. Limpar logs com `clear()`

### 2️⃣ Guardar um Plantel
1. Ir a "Meus Jogos"
2. Abrir um jogo
3. Selecionar 11 titulares + suplentes
4. Clicar "💾 Guardar Escalação"

**Procurar nos logs:**
```
✅ Escalação guardada com sucesso!
```

### 3️⃣ Clicar "🎮 GERIR JOGO AO VIVO"

**Procurar nos logs by order:**

#### Log 1 - MatchControlPage carrega lineup:
```
📊 [MatchControlPage] Lineup carregado do backend: {
  formation: "4-3-3",
  starters: 11,
  substitutes: 8,
  status: "draft"
}
```
☑️ Se aparecer com `starters: 11` e `substitutes: 8` = ✅ OK

#### Log 2 - MatchControlPage renderiza LiveMatchManager:
```
🎥 [MatchControlPage] Rendering LiveMatchManager with lineup: {
  hasLineup: true,
  formation: "4-3-3",
  starters: 11,
  substitutes: 8
}
```
☑️ Se os números forem 11 e 8 = ✅ OK

#### Log 3 - LiveMatchManager receives lineup prop:
```
📦 [LiveMatchManager] Lineup prop received: {
  formation: "4-3-3",
  starters: 11,
  substitutes: 8,
  starters_detail: [
    { id: "...", name: "Jogador 1", number: 1 },
    { id: "...", name: "Jogador 2", number: 2 },
    ...
  ]
}
```
☑️ Se mostrar 11 starters + 8 substitutes = ✅ OK

#### Log 4 - Squad carregada:
```
⚽ [LiveMatchManager] Squad construída com: 19 jogadores
   Squad: 1-Jogador1, 2-Jogador2, 3-Jogador3, ...
```
☑️ Se aparecer 19 jogadores = ✅ OK

#### Log 5 - Players state atualizado:
```
✅ [LiveMatchManager] Players state atualizado com 19 jogadores
```
☑️ Deve aparecer = ✅ OK

### 4️⃣ Testar Modal de Evento

1. Clicar "🎮 Iniciar Jogo" (se agendado)
2. Depois clicar "⚽ Golo"

**Procurar nos logs:**
```
🎯 [EventModal] Modal abriu com: {
  eventType: 'goal',
  playersAvailable: 19,
  players: [array com 19 jogadores]
}
```

☑️ Se `playersAvailable: 19` = ✅ SUCESSO! Todos os jogadores aparecem!

---

## 🚨 Se Não Aparecer Nada

### Problema 1: Log não aparece
- Frontend pode estar com cache
- **Solução:** Pressionar `Ctrl+Shift+R` (hard refresh)
- Fechar browser completamente e reabrir

### Problema 2: Log diz `starters: 0` ou `substitutes: 0`
- Backend não guardou corretamente
- **Solução:** Verificar endpoint `/api/team-manager/lineups/${matchId}/${teamId}` no Postman

### Problema 3: LiveMatchManager não recebe lineup
- MatchControlPage pode não estar a passar corretamente
- **Solução:** Clicar com MOUSE do lado do botão "Gerir Jogo ao Vivo", não usar keyboard

---

## 📝 Reportar Problema

Se vires um dos cenários abaixo, por favor reporta:

1. **Que logs aparecem** (ou não aparecem)
2. **Qual o número de starters/substitutes em cada log**
3. **Se o modal de evento aparece vazio ou com dados**

Exemplo de reporte:
```
- Log 1 ✅ 11 starters, 8 substitutes
- Log 2 ✅ 11 starters, 8 substitutes
- Log 3 ❌ Não aparece!!
- Modal: Vazio (0 jogadores)
```

---

**TL;DR - Quick Test:**
1. F12 → Console
2. Guardar escalação → procurer "✅ Escalação guardada"
3. Clicar "Gerir Jogo" → procurar "⚽ Squad construída com: 19"
4. Iniciar jogo → clicar "⚽ Golo" → procurar "playersAvailable: 19"

Se vires "19" em todos, está tudo OK! ✅
