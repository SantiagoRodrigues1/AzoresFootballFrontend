# 🚀 GUIA RÁPIDO DE TESTE - MINUTO AUTOMÁTICO + ASSISTIDOR

## ⚡ Passos Rápidos (2 minutos)

### 1. Verificar Servidores Rodando
```
Backend:  http://localhost:3000 ✅
Frontend: http://localhost:8002 ✅
```

### 2. Login
```
Email:    manager_santa_clara_b@league.com
Password: Teste@123
```

### 3. Abrir Live Match Manager
- Menu: Team Manager → Live Match Manager
- Selecionar um jogo em "LIVE"
- Clique em "Gerir Jogo"

### 4. Teste #1: Registar um Golo COM Assistência ⚽

1. Clique no botão **"⚽ Golo"**
2. Verifique que:
   - ✅ Campo "Minuto" mostra o tempo automaticamente (ex: "45'")
   - ✅ Campo "Minuto" tem cor VERDE e diz "(Automático)"
   - ✅ Campo "Minuto" **NÃO é editável** (é só display)
3. Selecione:
   - **Jogador**: Selecione um atacante (ex: João - #9)
   - **Quem Assistiu?** ← **Este é o campo NOVO!** Selecione um meio (ex: Pedro - #3)
4. Clique "Guardar"
5. Verifique:
   - ✅ Golo aparece em "Eventos do Jogo"
   - ✅ Mostra "João (9) com assistência"
   - ✅ Minuto está correto (automático)
   - ✅ Backend console mostra: `⚽ Assistência: [ID]`

### 5. Teste #2: Registar um Golo SEM Assistência

1. Clique em **"⚽ Golo"** novamente
2. Deixar "Quem Assistiu?" **em branco**
3. Clique "Guardar"
4. Verifique:
   - ✅ Golo aparece sem "com assistência"
   - ✅ Funciona sem erro

### 6. Teste #3: Cartão Amarelo (NEM Minuto NEM Assistidor Input) 🟨

1. Clique em **"🟨 Cartão Amarelo"**
2. Verifique que:
   - ✅ Minuto automático está lá
   - ✅ Campo "Quem Assistiu?" **NÃO aparece**
3. Selecione um jogador e guarde
4. Verifique:
   - ✅ Evento registado correctamente
   - ✅ Sem campo de assistidor

### 7. Teste #4: Substituição 🔄

1. Clique em **"🔄 Substituição"**
2. Verifique que:
   - ✅ Minuto automático está lá
   - ✅ Campo "Quem Assistiu?" **NÃO aparece**
3. Selecione:
   - Jogador a Sair: um defesa
   - Jogador a Entrar: um médio
4. Clique "Guardar"
5. Verifique:
   - ✅ Substituição registada

---

## 🎯 Checklist de Validação

| Teste | Esperado | Resultado |
|-------|----------|-----------|
| Minuto em golo | ✅ Auto, verde, não editável | [ ] ✅ / [ ] ❌ |
| Assistidor em golo | ✅ Dropdown com jogadores | [ ] ✅ / [ ] ❌ |
| Assistidor sem golo | ✅ Não aparece | [ ] ✅ / [ ] ❌ |
| Golo COM assist | ✅ Guardado com assist | [ ] ✅ / [ ] ❌ |
| Golo SEM assist | ✅ Guardado sem assist | [ ] ✅ / [ ] ❌ |
| Cartão | ✅ Sem assist field | [ ] ✅ / [ ] ❌ |
| Substituição | ✅ Sem assist field | [ ] ✅ / [ ] ❌ |

---

## 🐛 Se Algo Não Funcionar

### Problema: Minuto não é automático
```
Solução:
1. Abrir console (F12)
2. Verificar: "🎯 [EventModal] Modal abriu com: minutoJogo: X"
3. Se não aparecer, recarregar página
4. Se ainda não, reiniciar frontend:
   npm run dev
```

### Problema: Campo "Quem Assistiu?" não aparece para golos
```
Solução:
1. Abrir console (F12)
2. Ver qual eventType está sendo usado
3. Verificar no código: eventType === 'goal'
4. Se em dúvida, recarregar página
```

### Problema: Assistência não é guardada no backend
```
Solução:
1. Abrir console do Backend (terminal)
2. Procurar por: "⚽ Assistência:"
3. Se não aparecer:
   - Frontend: Adicionar console.log em handleSubmit
   - Backend: Verificar que assistId vem no payload
```

---

## 📱 Dados de Teste

**Time: Santa Clara B**

| Jogador | Número | Posição |
|---------|--------|---------|
| João | 9 | Avançado |
| Pedro | 3 | Médio |
| Carlos | 1 | Guarda-redes |
| Ana | 4 | Defesa |
| Marta | 5 | Médio |

---

## 🎬 Fluxo Completo (3 min)

```
1. Login ✅
2. Ir para Match Manager → Live Match 
3. Entrar em jogo 
4. Clique ⚽ → Registar golo com assist → Guardar
5. Clique 🟨 → Registar cartão → Guardar
6. Clique ⚽ → Registar golo SEM assist → Guardar
7. Verificar eventos aparecem na lista
```

---

## ✨ Resultado Esperado

**Após completar todos os testes, deves ver:**

1. ✅ Minuto SEMPRE automático (verde, não editável)
2. ✅ Campo "Quem Assistiu?" só aparece para golos
3. ✅ Golos com assist: "João (9) com assistência de Pedro (3)"
4. ✅ Golos sem assist: "João (9)"
5. ✅ Cartões e substituições: sem campo de assistidor
6. ✅ Sem erros no console (frontend ou backend)

---

**Status**: Pronto para teste 🚀
**Duração estimada**: 5-10 minutos
**Próxima ação**: Executar testes e relatar resultados
