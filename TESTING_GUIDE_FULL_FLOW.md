# ✅ **GUIA DE TESTE - Carregamento de Titulares e Suplentes**

## 🎯 Objetivo
Verificar que quando um Team Manager gerencia um jogo ao vivo, os **11 titulares + suplentes** que ele escolheu aparecem nos modals para aplicar ações (golo, cartão, substituição).

---

## 📝 Credenciais de Teste

```
Email: manager_santa_clara_b@league.com
Password: Teste@123
Equipa: Santa Clara B
```

---

## 🔍 Passo 1️⃣ - Login

1. Abrir http://localhost:8001
2. Fazer login com credenciais acima
3. Ir a **"Meus Jogos"** no menu

---

## 🔍 Passo 2️⃣ - Escolher um Jogo

1. Ver a lista de jogos da Santa Clara B
2. Selecionar um jogo (ex: "Santa Clara B vs ...")
3. Clica no jogo para abrir

---

## 🔍 Passo 3️⃣ - Guardar Escalação

1. Página deve abrir em modo **EDITAR**
2. Ver a formação (ex: 4-3-3)
3. Clicar no campo para escolher os 11 titulares
4. Escolher 11 jogadores
5. Escolher até 8 suplentes
6. Clicar **"💾 GUARDAR ESCALAÇÃO"**

**Verificar:**
```
✅ Mensagem "✅ Escalação guardada com sucesso!" aparece
✅ Console mostra: "✅ Escalação guardada com sucesso:"
```

---

## 🔍 Passo 4️⃣ - Modo Visualização

1. Após guardar, interface muda para **LEITURA**
2. Ver os mesmos 11 titulares na formação
3. Ver os suplentes no "Banco de Suplentes"
4. Ver o botão **"🎮 GERIR JOGO AO VIVO"**

**Abrir Console (F12 → Console) e procurar:**
```
✅ [MatchControlPage] Lineup carregado do backend: {
  formation: "4-3-3",
  starters: 11,
  substitutes: [número de suplentes]
}
```

---

## 🔍 Passo 5️⃣ - Clicar "Gerir Jogo ao Vivo"

1. Clica no botão **"🎮 GERIR JOGO AO VIVO"**
2. Aguarda 2-3 segundos
3. Página muda para modo LIVE

**No Console procurar:**
```
🎥 [MatchControlPage] Rendering LiveMatchManager with lineup: {
  hasLineup: true,
  formation: "4-3-3",
  starters: 11,
  substitutes: [número]
}

📦 [LiveMatchManager] Lineup prop received: {
  formation: "4-3-3",
  starters: 11,
  substitutes: [número],
  starters_detail: [...]
}

⚽ [LiveMatchManager] Squad construída com: 19 jogadores
✅ [LiveMatchManager] Players state atualizado com 19 jogadores
```

---

## 🔍 Passo 6️⃣ - Iniciar Jogo

1. Se jogo estiver **AGENDADO** → Ver botão **"🎮 INICIAR JOGO"**
2. Se jogo já estiver **LIVE** → Pular para passo 7

Clica **"🎮 INICIAR JOGO"**

---

## 🔍 Passo 7️⃣ - Testar Ações

### Ação 1: GOLO
1. Clica **"⚽ GOLO"**
2. Modal abre
3. **VERIFICAR:** Dropdown "Jogador" mostra todos os 11+suplentes

**No Console:**
```
🎯 [EventModal] Modal abriu com: {
  eventType: 'goal',
  playersAvailable: 19  ← DEVE SER 19!!
  players: [...]
}
```

4. Seleciona um jogador
5. Clica "Guardar"
6. **VERIFICAR:** Mensagem "⚽ Golo registado!" aparece
7. **VERIFICAR:** Score atualiza (ex: 1-0)

---

### Ação 2: CARTÃO AMARELO
1. Clica **"🟨 CARTÃO AMARELO"**
2. Modal abre
3. **VERIFICAR:** Dropdown "Jogador" mostra todos os 19
4. Seleciona um jogador diferente
5. Clica "Guardar"
6. **VERIFICAR:** "🟨 Cartão amarelo registado!" aparece

---

### Ação 3: SUBSTITUIÇÃO (CRITICAL!)
1. Clica **"🔄 SUBSTITUIÇÃO"**
2. Modal abre
3. **VERIFICAR CRUCIAL:**
   - Dropdown "Jogador a Sair" mostra todos os 19
   - Dropdown "Jogador a Entrar" mostra todos os 19
4. Seleciona:
   - "Jogador a Sair" → Um titular
   - "Jogador a Entrar" → Um suplente
5. Clica "Guardar"
6. **VERIFICAR:** "🔄 Substituição registada!" aparece

---

## ✅ Sucesso!

Se tudo está correto:
- ✅ Console mostra todos os logs com números corretos (11, 8, 19)
- ✅ Todos os dropdowns mostram 19 jogadores
- ✅ Ações funcionam sem erros

---

## ❌ Se Algo Não Funciona

### Problema: Console mostra `starters: 0` ou `substitutes: 0`
**Solução:** Backend não guardou corretamente
1. Recarregar página (Ctrl+R)
2. Tentar guardar de novo

### Problema: Dropdown vazio no modal
**Solução:** Players não carregaram
1. Pressionar Ctrl+Shift+R (hard refresh)
2. Verificar console para `⚽ Squad construída com: 0`
3. Reportar logs

### Problema: Erro "Cannot populate" ou 500 no backend
**Solução:** Backend issue
1. Verificar se back está rodando: `npm start` em `azores-score-backend`
2. Recarregar página

---

## 📋 Checklist de Validação

- [ ] Login bem-sucedido
- [ ] Escalação guardada com 11 titulares + suplentes
- [ ] Modo visualização mostra 11 em campo
- [ ] Botão "Gerir Jogo" aparece
- [ ] LiveMatchManager abre sem erros
- [ ] Console mostra todos os logs com números corretos
- [ ] Golo modal mostra 19 jogadores
- [ ] Cartão modal mostra 19 jogadores
- [ ] Substituição modal mostra 19 jogadores em ambos dropdowns
- [ ] Golo registado com sucesso
- [ ] Cartão registado com sucesso
- [ ] Substituição registada com sucesso

---

**Se TUDO estiver CHECK, o sistema está funcionando perfeitamente!** ✅
