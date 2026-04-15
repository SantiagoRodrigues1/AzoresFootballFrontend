# 🎯 FLUXO CORRETO - ESCALAÇÃO E GESTÃO AO VIVO

## Objetivo
Corrigir o fluxo de seleção, armazenamento e gestão ao vivo da escalação para que funcione de forma contínua e sem inconsistências.

---

## 🔄 Fluxo Esperado (Passo a Passo)

### **FASE 1: SELECIONAR ESCALAÇÃO**
```
User clica em "Ver Jogo" na lista de jogos
                    ↓
MatchControlPage carrega (fase = 'edit')
                    ↓
Backend verifica: há escalação anterior?
  ├─ SIM → Carrega escalação anterior (fase = 'edit')
  └─ NÃO → Começa vazio (fase = 'edit')
                    ↓
MatchLineupPage aparece com:
  ✅ Formulário de seleção (11 titulares + suplentes)
  ✅ Campo para guardar (botão "Guardar 11 Titulares")
  ✅ Se há escalação anterior: mostra "✓ Escalação anterior carregada"
```

### **FASE 2: GUARDAR ESCALAÇÃO**
```
User seleciona 11 titulares + suplentes + botão "Guardar"
                    ↓
MatchLineupPage valida:
  ├─ São 11 titulares? SIM ✅
  ├─ FormationData é válida? SIM ✅
  └─ Todos os campos estão preenchidos? SIM ✅
                    ↓
Backend saves na database
                    ↓
Success! onLineupSaved() é chamado
                    ↓
MatchControlPage recebe callback:
  • setLineup(savedLineup)
  • setHasLineup(true) 
  • setPhase('view')
                    ↓
💾 SUCCESS MESSAGE aparece:
  "✅ Escalação guardada com sucesso!"
  (Desaparece depois de 3-4 segundos)
```

### **FASE 3: VISUALIZAR ESCALAÇÃO (Read-Only)**
```
LineupView aparece com:
  ✅ Escalação visual no balneário (4-3-3, 4-4-2, etc)
  ✅ 11 jogadores titulares no campo
  ✅ Banco de suplentes no lado
  ✅ 2 botões APENAS:
      1️⃣  "📝 Editar 11" (se quiser mudar)
      2️⃣  "🎮 GERIR JOGO AO VIVO DA MINHA EQUIPA" (para começar a registar eventos)
  ❌ NENHUM AVISO ou mensagem de erro
  ❌ NENHUM campo editável
```

### **FASE 4: EDITAR ESCALAÇÃO (Opcional)**
```
User clica em "📝 Editar 11"
                    ↓
setPhase('edit')
                    ↓
MatchLineupPage aparece NOVAMENTE com a escalação anterior carregada
                    ↓
User pode mudar seleção e clicar "Guardar" novamente
```

### **FASE 5: GERIR JOGO AO VIVO**
```
User clica em "🎮 GERIR JOGO AO VIVO DA MINHA EQUIPA"
                    ↓
setPhase('live')
                    ↓
LiveMatchManager aparece com:
  ✅ Todos os 11 titulares + suplentes carregados
  ✅ Buttons para registar eventos (⚽ Golo, 🟨 Cartões, 🔄 Substituição)
  ✅ Minuto automático
  ✅ Campo de assistidor para golos
  ✅ Cronómetro marcando os minutos
```

---

## 🛠️ Problemas Atuais

### **Problema 1: hasLineup Incorreto**
- Após guardar em MatchLineupPage
- MatchControlPage recebe `onLineupSaved()`
- Mas `hasLineup` pode ser ainda `false` 
- Resultado: LineupView não aparece corretamente

### **Problema 2: Avisos não Desaparecem**
- Success messages ficam visíveis demasiado tempo
- Error messages aparecem em sítios errados
- Não há feedback claro após guardar

### **Problema 3: Transição de Fases Confusa**
- Não há separação clara entre "edit" → "view" → "live"
- Às vezes fica em "edit" quando devia estar em "view"

---

## ✅ Processo de Correção

### **Ficheiro 1: MatchControlPage.tsx**
Corrigir:
1. ✅ Garantir que `hasLineup` é atualizado quando `handleLineupSaved()` é chamado
2. ✅ Remover o `skipInitialLoad` que pode estar a causar problemas
3. ✅ Garantir transição clara: edit → view → live
4. ✅ Consolidar os diferentes UseEffects que estão em conflito

### **Ficheiro 2: LineupView.tsx**
Adicionar:
1. ✅ Título claro: "Escalação Guardada ✓"
2. ✅ 2 botões APENAS: Editar + Gerir Jogo ao Vivo
3. ✅ Remover qualquer aviso ou mensagem de erro
4. ✅ Estilo clean (sem elementos de "edição")

### **Ficheiro 3: MatchLineupPage.tsx**
Corrigir:
1. ✅ Success message deve desaparecer após 3 segundos automaticamente
2. ✅ Após guardar, deve chamar `onLineupSaved()` IMEDIATAMENTE (não com delay)
3. ✅ Consolidar avisos em um só local

---

## 📋 Checklist de Validação Final

- [ ] Após guardar em MatchLineupPage, LineupView aparece com escalação
- [ ] LineupView mostra "Escalação Guardada ✓"
- [ ] Aparecem 2 botões: "Editar 11" + "Gerir Jogo ao Vivo"
- [ ] Nenhum aviso ou erro é visível no LineupView
- [ ] Ao clicar "Editar 11", volta ao formulário (fase edit)
- [ ] Ao clicar "Gerir Jogo ao Vivo", aparece LiveMatchManager com os jogadores
- [ ] LiveMatchManager tem os 11 titulares + suplentes carregados
- [ ] Pode registar eventos sem problemas
- [ ] Minuto automático funciona
- [ ] Assistidor aparece apenas para golos

---

**Status**: 🔴 A CORRIGIR
**Prioridade**: ALTA
**Tempo estimado**: 30-45 minutos
