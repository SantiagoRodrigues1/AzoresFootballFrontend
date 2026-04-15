# 🎮 LIVE MATCH MANAGER - GUIA RÁPIDO PARA TEAM MANAGERS

## 🚀 COMEÇAR RAPIDAMENTE

### Passo 1: Login
1. Aceda a AzoresScore
2. Login com credenciais de Team Manager
3. Escolha sua equipa

### Passo 2: Ir para "Meus Jogos"
1. Clique no ícone "Meus Jogos" na navegação inferior
2. Veja lista dos seus jogos

### Passo 3: Abrir Gestor de Jogo
1. Encontre um jogo com status **AO VIVO**
2. Clique no botão **"🎮 Gerir Jogo ao Vivo"**
3. Será redirecionado para o gestor

---

## 📋 INTERFACE DO GESTOR

```
┌─────────────────────────────────────┐
│  🎮 Gestor de Jogo em Direto  [←]   │  ← Header
├─────────────────────────────────────┤
│                                     │
│  [Status: 🔴 DIRETO]                │  ← Badge
│                                     │
│  [Logo]  Equipa Casa  vs  Equipa A  │
│    2         -         1            │  ← Placar
│                    23' (Cronômetro)  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ⚙️ Controlo do Jogo                │
│  [Intervalo] [Terminar]            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📋 Eventos do Jogo                 │
│                                     │
│  23' ⚽ João Silva                  │
│  15' 🟨 Miguel Costa               │
│  5'  🔄 António IN / Rui OUT       │
│                                     │
├─────────────────────────────────────┤
│  [ ⚽ Golo ] [🟨 Cartão]            │
│  [🔄 Sub ] [⏱️ Tempo +]            │  ← Action Buttons
├─────────────────────────────────────┘
```

---

## 🎯 COMO USAR (PASSO A PASSO)

### 1️⃣ REGISTAR UM GOLO

```
1. Clique no botão [ + GOLO ]
   ↓
2. Modal abre com formulário
   ↓
3. Preencha:
   - Minuto: 23
   - Jogador: Selecione da lista
   ↓
4. Clique "Guardar"
   ↓
5. ✅ Evento registado!
   - Placar atualiza automaticamente
   - Aparece na timeline
   - Notificações enviadas
```

### 2️⃣ REGISTAR UM CARTÃO

```
1. Clique no botão [ + CARTÃO ]
   ↓
2. Modal abre
   ↓
3. Preencha:
   - Minuto: 15
   - Jogador: Selecione
   - Tipo: Amarelo ou Vermelho
   ↓
4. Clique "Guardar"
   ↓
5. ✅ Cartão registado!
```

### 3️⃣ REGISTAR UMA SUBSTITUIÇÃO

```
1. Clique no botão [ + SUBSTITUIÇÃO ]
   ↓
2. Modal abre
   ↓
3. Preencha:
   - Jogador a SAIR: Selecione
   - Jogador a ENTRAR: Selecione
   - Minuto: 67
   ↓
4. Clique "Guardar"
   ↓
5. ✅ Substituição registada!
   - Mostra "❌ Rui" (sai)
   - Mostra "✅ António" (entra)
```

### 4️⃣ ADICIONAR TEMPO EXTRA

```
1. Clique no botão [ + TEMPO ]
   ↓
2. Apareça prompt: "Quantos minutos adicionar?"
   ↓
3. Digite: 5 (ou número desejado)
   ↓
4. Clique OK
   ↓
5. ✅ Tempo adicionado!
   - Cronômetro reflete 45+5
```

### 5️⃣ CONTROLAR O JOGO

```
INICIAR JOGO:
  1. Se jogo está "AGENDADO"
  2. Clique [ 🎮 Iniciar Jogo ]
  3. Status muda para "🔴 DIRETO"

INTERVALO:
  1. Se jogo está "🔴 DIRETO"
  2. Clique [ ⏸️ Intervalo ]
  3. Status muda para "⏸️ INTERVALO"

2ª PARTE:
  1. Se jogo está "⏸️ INTERVALO"
  2. Clique [ ▶️ 2ª Parte ]
  3. Status muda para "🔴 2ª PARTE"

TERMINAR JOGO:
  1. Se jogo está "🔴 DIRETO" ou "🔴 2ª PARTE"
  2. Clique [ 🏁 Terminar ]
  3. Confirme: "Tem a certeza?"
  4. Status muda para "🏁 TERMINADO"
  5. Classificações atualizam automaticamente
```

---

## ⏰ CRONÔMETRO

### Como funciona?
- ✅ Atualiza a cada segundo
- ✅ Começa em 0' quando inicia jogo
- ✅ Vai até 45' (1ª parte)
- ✅ Depois 45+X (segundo tempo)
- ✅ Pode adicionar tempo extra

### Exemplos
```
Início:        00'
Durante:       23'
Final 1ª:      45'
Com tempo:     45+2'
Durante 2ª:    67'
Final 2ª:      90+3'
```

---

## 📊 TIMELINE DE EVENTOS

### O que vê?
- Cada evento tem: **[Minuto] [Ícone] [Jogador]**
- Eventos aparecem INSTANTANEAMENTE
- Ordenados do mais recente para o mais antigo
- Cada evento mostra timestamp

### Exemplo
```
45+2' ⏱️ Tempo adicionado
45' 🔄 Rui OUT / António IN
42' 🟨 Miguel Costa
23' ⚽ João Silva (golo)
```

---

## 🎨 STATUS DO JOGO

| Status | O que significa | Ação possível |
|--------|-----------------|---------------|
| 📅 AGENDADO | Antes de começar | Iniciar Jogo |
| 🔴 DIRETO | Jogo em curso | Intervalo, Terminar |
| ⏸️ INTERVALO | Parado no intervalo | 2ª Parte |
| 🔴 2ª PARTE | Segunda metade | Terminar |
| 🏁 TERMINADO | Jogo acabou | Ver resultado |

---

## ⚠️ ERROS COMUNS

### ❌ "Jogo não encontrado"
- ✅ Solução: Fazer refresh e tentar de novo
- ✅ Solução: Verificar se match ID está correto

### ❌ "Selecione um jogador"
- ✅ Solução: Clicar na lista dropdown e escolher
- ✅ Solução: Se lista vazia, squad não carregou

### ❌ "Não posso terminar o jogo agora"
- ✅ Solução: Jogo tem de estar em "DIRETO" ou "2ª PARTE"
- ✅ Solução: Confirme status no topo

### ❌ Modal não abre
- ✅ Solução: Verificar se jogo está "DIRETO" ou "2ª PARTE"
- ✅ Solução: Fazer refresh

### ❌ Placar não atualiza
- ✅ Solução: Esperar 5 segundos (poll automático)
- ✅ Solução: Fazer refresh manual

---

## 💡 DICAS & TRUQUES

### Dica 1: Registar evento rápido
- ✅ Menu já tem o minuto correto
- ✅ Só precisa selecionar jogador
- ✅ Menos de 3 cliques por evento

### Dica 2: Verificar squad
- Se squad não está a carregar, sistema usa lista mock
- Todos os 11 jogadores iniciais estão disponíveis

### Dica 3: Confirmação ao terminar
- Sistema pede confirmação antes de terminar
- Classif. atualiza automaticamente
- Não é reversível!

### Dica 4: Notificações
- Cada evento registado gera notificação
- Fans recebem atualizações em tempo real
- Árbitro vê também

### Dica 5: Troubleshooting
- Algum problema? Fazer refresh da página
- Ainda não funciona? Fazer logout e login de novo
- Contatar suporte se persistir

---

## 🔐 PRIVACIDADE & SEGURANÇA

- ✅ Só YOU (Team Manager) pode ver este ecrã
- ✅ Só YOUR matches aparecem
- ✅ Dados encriptados em trânsito
- ✅ Token JWT expira automaticamente
- ✅ Logout automático em erro 401

---

## 📱 VERSÃO MOBILE

- ✅ Botões grandes e touchscreen-friendly
- ✅ Layout automático adapta-se
- ✅ Sem scroll horizontal
- ✅ Modais preenchem ecrã
- ✅ Otimizado para 4G/5G

### Mobile Tips
1. Usar em modo landscape para melhor view
2. Botões bastante espaçados para finger-tap
3. Modais têm X grande para fechar
4. Não precisa mouse, tudo com touch

---

## 🆘 SUPORTE

### Contactos
- Email: support@azoresscore.pt
- Chat: Em "Mais" → Chat
- Telefone: +351 XXX XXX XXX

### Respostas Rápidas
- **"Não consigo login"** → Verificar credenciais, forgot password
- **"Jogo não aparece"** → Verificar se sou team manager daquela equipa
- **"Evento não grava"** → Tentar de novo em 5 segundos
- **"Timeline vazia"** → Nenhum evento registado ainda, começar um

---

## 📚 DOCUMENTAÇÃO EXTRA

- **APP_INTEGRATION_GUIDE.md** - Guia geral da app
- **LIVE_MATCH_MANAGER_COMPLETE_GUIDE.md** - Documentação completa
- **REFEREE_SYSTEM_IMPLEMENTATION_GUIDE.md** - Como árbitro vê

---

## 🎯 CHECKLIST DE PRIMEIRO USO

- [ ] Fazer login
- [ ] Ir para "Meus Jogos"
- [ ] Encontrar jogo "AO VIVO"
- [ ] Clicar "Gerir Jogo ao Vivo"
- [ ] Registar 1 golo
- [ ] Registar 1 cartão
- [ ] Registar 1 substituição
- [ ] Adicionar tempo extra
- [ ] Ir ao intervalo
- [ ] Voltar 2ª parte
- [ ] Terminar jogo
- [ ] Ver resultado

---

## ✅ TUDO PRONTO?

Você está agora completamente preparado para usar o **Live Match Manager**!

```
    🎮
   /|\
   / \
   
    ⚽
   
  VAI LÁ!
  BOA SORTE!
```

**Data**: Abril 2026
**Versão**: 1.0
**Status**: ✅ PRONTO

