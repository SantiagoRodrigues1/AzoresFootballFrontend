# ✅ Live Match Testing Checklist

## Fluxo Completo de Teste

### 1️⃣ Team Manager - Guardar Plantel
- [ ] Aceder ao jogo como Team Manager
- [ ] Selecionar 11 titulares
- [ ] Selecionar até 8 suplentes
- [ ] Clicar "Guardar Escalação"
- ✅ Verificar: Mensagem de sucesso aparece
- ✅ Verificar: Interface fica em mode READ-ONLY

### 2️⃣ Modo Visualização (LineupView)
- [ ] Após guardar, deve aparecer a escalação final
- [ ] Mostrar: 11 titulares na formação (4-3-3, 4-4-2, etc.)
- [ ] Mostrar: Banco de suplentes abaixo
- ✅ Verificar: Botão "🎮 GERIR JOGO AO VIVO" está visível

### 3️⃣ Clicar "Gerir Jogo ao Vivo"
- [ ] Clica no botão "🎮 GERIR JOGO AO VIVO"
- ✅ Verificar: Abre o LiveMatchManager SEM ERROS
- ✅ Verificar: Mostra "🎮 Iniciar Jogo" se estiver agendado
- ✅ Verificar: Os titulares + suplentes aparecem nos selects

### 4️⃣ Registar Eventos (após iniciar jogo)
- [ ] Clica "🎮 Iniciar Jogo"
- [ ] Aguarda 2 segundos
- [ ] Aparece o menu de ações:
  - [ ] Botão "⚽ Golo"
  - [ ] Botão "🟨 Cartão Amarelo"
  - [ ] Botão "🟥 Cartão Vermelho"
  - [ ] Botão "🔄 Substituição"

### 5️⃣ Testar Cada Ação

#### Golo
- [ ] Clica "⚽ Golo"
- [ ] Modal abre com:
  - ✅ Campo "Minuto do Jogo" (atual: ~0)
  - ✅ Dropdown "Jogador" com todos os 19 jogadores (11+8)
  - ✅ Botão "Guardar"
- [ ] Seleciona um jogador
- [ ] Clica "Guardar"
- ✅ Verificar: "⚽ Golo registado!" aparece
- ✅ Verificar: Score atualiza (ex: 1-0)
- ✅ Verificar: Timeline mostra o golo

#### Cartão Amarelo
- [ ] Clica "🟨 Cartão Amarelo"
- [ ] Seleciona um jogador diferente
- [ ] Clica "Guardar"
- ✅ Verificar: "🟨 Cartão amarelo registado!" aparece
- ✅ Verificar: Timeline mostra o cartão

#### Substituição
- [ ] Clica "🔄 Substituição"
- [ ] Modal mostra:
  - ✅ Dropdown "Jogador a Sair" com todos os 19
  - ✅ Dropdown "Jogador a Entrar" com todos os 19
- [ ] Seleciona um titular para "Sair"
- [ ] Seleciona um suplente para "Entrar"
- [ ] Clica "Guardar"
- ✅ Verificar: "🔄 Substituição registada!" aparece
- ✅ Verificar: Timeline mostra a substituição

#### Cartão Vermelho
- [ ] Similar ao Cartão Amarelo
- ✅ Verificar: "🟥 Cartão vermelho registado!" aparece

### 6️⃣ Controles do Jogo
- [ ] Botão "⏸️ Intervalo" funciona
- [ ] Botão "▶️ 2ª Parte" aparece após intervalo
- [ ] Botão "⏱️ Tempo Extra" adiciona minutos
- [ ] Botão "🏁 Terminar Jogo" finaliza

### 7️⃣ Verificar Console Logs
```
🔄 [LiveMatchManager] Initial load - matchId: *** lineup exists: true
📋 [LiveMatchManager] Lineup carregado com: { starters: 11, substitutes: 8, total: 19 }
⚽ [LiveMatchManager] Squad construída: 1-Jogador, 2-Jogador, ...
✅ [LiveMatchManager] Players state atualizado com 19 jogadores
🎯 [EventModal] Modal abriu com: { eventType: 'goal', playersAvailable: 19, players: [...] }
```

---

## 🚀 Como Executar

1. Abrir frontend: http://localhost:8001
2. Login como Team Manager
3. Ir a "Meus Jogos"
4. Abrir um jogo
5. Seguir os passos acima

## ❌ Problemas Conhecidos

- Se players aparecer vazio → Verificar console logs
- Se modal não abrir → Pressionar F12, ver network errors
- Se score não atualizar → Recarregar página (Ctrl+R)

---

**Última atualização:** 7 de Abril de 2026
