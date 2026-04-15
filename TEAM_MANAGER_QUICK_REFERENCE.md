# Team Manager Quick Reference 🎮

## Fluxo Completo (Do Jogo Agendado até Fim)

### ESTADO 1: AGENDADO (Scheduled)
```
┌─────────────────────────────────┐
│  🎮 Os Meus Jogos                │
├─────────────────────────────────┤
│                                  │
│  Pico AC  📅 5 Abr  🕐 15:00    │
│  vs                              │
│  Esperança de Picos              │
│                                  │
│  ┌──────────────────────────────┐│
│  │ Gerir Escalação      →       ││
│  └──────────────────────────────┘│
│                                  │
│  Status: [AGENDADO]              │
└─────────────────────────────────┘
```

**Acções Disponíveis:**
- ✯ Clicar "Gerir Escalação"
- ✯ Seleccionar 11 jogadores
- ✯ Escolher capitão e vice
- ✯ Guardar

---

### ESTADO 2: ESCALAÇÃO GUARDADA
```
┌─────────────────────────────────┐
│  ✅ Escalação Guardada          │
├─────────────────────────────────┤
│                                  │
│  Formação: 4-3-3                │
│  Jogadores: 11/11               │
│  Timestamp: 14:35               │
│                                  │
│  ✨ Dados persistem ao voltar   │
│     (Recarrega automático)      │
│                                  │
└─────────────────────────────────┘
```

**O que acontece:**
- ✯ Dados guardados em MongoDB
- ✯ Ao recarregar a página: Tudo carrega automaticamente
- ✯ Pode continuar editando até ao jogo começar
- ✯ Timer mostra tempo até kickoff

---

### ESTADO 3: JOGO AO VIVO (Live)
```
┌──────────────────────────────────┐
│  🎮 Os Meus Jogos                 │
├──────────────────────────────────┤
│                                   │
│  Pico AC  🔴 AO VIVO  Esperança  │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ 🎮 Gerir Jogo ao Vivo   →  │ │
│  │ (vermelho, piscando)        │ │
│  └─────────────────────────────┘ │
│                                   │
│  Status: [🔴 LIVE]               │
└──────────────────────────────────┘
```

**Acções Disponíveis:**
- ✯ Clicar "Gerir Jogo ao Vivo"

---

### ESTADO 4: LIVE MATCH MANAGER
```
┌──────────────────────────────────┐
│  🎮 Gestor de Jogo em Directo    │
├──────────────────────────────────┤
│                                   │
│  ┌────────────────────────────┐  │
│  │ Pico AC      2 - 1    45'  │  │
│  │ vs Esperança  🔴 LIVE     │  │
│  └────────────────────────────┘  │
│                                   │
│  ⚽ 12' - Golo - João Silva       │
│  🟨 28' - Amarelo - Pedro        │
│  🔄 35' - Subst - Rui sai        │
│                                   │
│  ┌────────────────────────────┐  │
│  │ [⚽] [🟨] [🔄] [⏱️]         │  │
│  │ [⏸] [▶️] [🏁]              │  │
│  └────────────────────────────┘  │
│                                   │
└──────────────────────────────────┘
```

**Botões de Acção (Clique = +1 evento no máximo 3 passos):**

1. **⚽ Golo**
   - Minuto: Auto-preenchido
   - Seleccionar: Jogador que marcou
   - Resultado: Score +1 automático

2. **🟨 Cartão Amarelo**
   - Minuto: Auto-preenchido
   - Seleccionar: Jogador
   - Resultado: Evento na timeline

3. **🔄 Substituição**
   - Minuto: Auto-preenchido
   - Seleccionar: Quem sai + Quem entra
   - Resultado: "Nú sai, Novo entra" no placar

4. **⏸ Intervalo**
   - Clique: Pausa o cronómetro
   - Status: Muda para "Intervalo"

5. **▶️ 2ª Parte**
   - Clique: Retoma o jogo
   - Status: Muda para "2ª Parte"

6. **🏁 Terminar Jogo**
   - Clique: Jogo termina
   - Automático: Classificações actualizadas (+3 vitória, +1 empate)

7. **⏱️ Tempo Extra**
   - Prompt: Quantos minutos?
   - Resultado: Tempo adicionado

---

### ESTADO 5: JOGO TERMINADO
```
┌──────────────────────────────────┐
│  🏁 Jogo Terminado               │
├──────────────────────────────────┤
│                                   │
│  Pico AC        3 - 2            │
│  vs Esperança   (2-1 @ 45')       │
│                                   │
│  Status: [TERMINADO]             │
│                                   │
│  Classificação Actualizada! ✅    │
│  +3 pontos (Vitória)             │
│  Golos: 3-2                       │
│                                   │
│  Redireciona para /matches        │
└──────────────────────────────────┘
```

**Automático:**
- ✯ Classificação atualizada
- ✯ Pontos: +3 (vitória) / +1 (empate) / 0 (derrota)
- ✯ Golos marcados/sofridos registados

---

## 📱 Atalhos Rápidos

| Ação | Duração | Passos |
|------|---------|--------|
| Gerir Escalação | 5-10 min | 3 passos |
| Guardar Escalação | 1 seg | 1 clique |
| Recarregar Escalação | Automático | 0 passos! |
| Registar Golo | 30 seg | 3 passos |
| Registar Cartão | 30 seg | 3 passos |
| Registar Substituição | 45 seg | 4 passos |
| Terminar Jogo + Classificações | 10 seg | 2 passos |

---

## 🔐 Segurança

- ✅ Só team managers da equipa podem editar
- ✅ Token JWT valida acesso em cada endpoint
- ✅ Dados guardados com encriptação
- ✅ Auditoria de quem guardou escalação

---

## 🚨 Mensagens de Feedback

### ✅ Sucesso (Verde)
```
✅ Escalação guardada com sucesso!
   Formação: 4-3-3 | Jogadores: 11/11 | 14:35

✅ Evento registado com sucesso!

✅ Jogo terminado e classificações atualizadas!
```

### ⚠️ Aviso (Amarelo)
```
⚠️ Faltam jogadores! Precisa de 11.

⚠️ Capitão não definido.

⚠️ Formação não está completa.
```

### ❌ Erro (Vermelho)
```
❌ Não autorizado para este jogo.

❌ Jogador não encontrado.

❌ Erro ao guardar. Tente novamente.
```

---

## 📞 Suporte

### Se Escalação Não Carregar:
1. Recarregar página (F5)
2. Verificar se está logged in
3. Contactar Admin

### Se Jogo Não Mudar para "AO VIVO":
1. Admin deve alterar status
2. Recarregar página (F5)
3. Botão deve aparecer

### Se Score Não Actualizar:
1. Aguardar 5 segundos (refresco automático)
2. Ou clicar [ 🔄 Recarregar ]
3. Verificar console (F12) para erros

---

## 🎯 Checklist Pré-Jogo

- [ ] Escalação guardada
- [ ] 11 jogadores seleccionados
- [ ] Capitão definido
- [ ] Formação correcta
- [ ] Substitutos definidos (opcional mas recomendado)
- [ ] ✅ Tudo pronto? Jogo pode começar!

---

**Versão:** 1.0  
**Data:** Abril 2026  
**Pronto para:** PRODUÇÃO ✨
