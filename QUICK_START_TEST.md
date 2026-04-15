# ⚡ Quick Start - Teste da Escalação

## 🚀 Começar em 2 Minutos

### 1. Backend e Frontend já estão em execução?

```bash
# Terminal 1: Backend
cd c:\Users\santiago\Documents\AzoresScore-PAP\azores-score-backend
npm start
# Deve mostrar: ✅ Servidor rodando na porta 3000

# Terminal 2: Frontend
cd c:\Users\santiago\Documents\azores-football-live-main
npm run dev
# Deve mostrar: ✅ VITE v... ready in ... ms
```

## ✅ Teste Rápido (Sem Escalação Salva)

**Tempo: ~30 segundos**

1. **Navegar para jogo ao vivo:**
   - Ir para: `http://localhost:8001/matches`
   - Procurar por um jogo
   - Clicar em "Gerir Jogo em Direto" (ou ícone 🎮)

2. **Abrir DevTools:**
   - Pressionar `F12`
   - Ir para aba **Console**

3. **Abrir evento:**
   - Na página do jogo, clicar em "⚽ Golo"
   - A modal abre
   - Ver no console: logs de loading

4. **Verificar resultado:**
   - Modal tem dropdown com jogadores: ✅ **FUNCIONA!**
   - Console mostra um dos logs:
     - `✅ ESCALAÇÃO SALVA CARREGADA` (se foi salva)
     - `✅ Squad genérico carregado` (fallback 1)
     - `🎲 Mock players created` (fallback 2)

## 📊 Teste Completo (Com Escalação Salva)

**Tempo: ~1-2 minutos**

1. **Criar escalação:**
   - Ir para "Gestor de Equipa" → Escalação/Formação
   - Se não há escalação: clicar "+ Criar Nova Escalação"
   - Selecionar formação (ex: 4-3-3)
   - Adicionar 11 jogadores
   - Clicar "Guardar Escalação"
   - Mensagem: ✅ "Escalação guardada com sucesso"

2. **Ir para jogo ao vivo:**
   - Deve estar na mesma página
   - Clicar em "Gerir Jogo ao Vivo"
   - Ou ir para Matches e selecionar um jogo

3. **Abrir DevTools:**
   - F12 → Console
   - Observar logs de loading

4. **Abrir dois eventos:**
   - Clicar "⚽ Golo"
   - Verificar: dropdown tem nomes dos jogadores reais
   - Console mostra: `✅ ESCALAÇÃO SALVA CARREGADA: 11 jogadores`
   - Fechar modal
   - Clicar "🟨 Cartão Amarelo"
   - Verificar: novamente mostra mesmo 11 jogadores
   - Console mostra: `⏭️ Escalação já carregada para esta equipa, skip` (otimização)

## 🔍 Verificar Logs no Console

### Comandos para copiar direto:

**1. Ver escalações salvas:**
```javascript
// Executar no console do browser
fetch('http://localhost:3000/api/team-manager/lineups/MATCH_ID/TEAM_ID', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('azores_score_token')}` }
})
.then(r => r.json())
.then(d => console.log(d))
```

**2. Ver user autenticado:**
```javascript
JSON.parse(localStorage.getItem('azores_score_user'))
```

**3. Contar escalações no BD:**
```bash
# No terminal backend:
cd c:\Users\santiago\Documents\AzoresScore-PAP\azores-score-backend
node check-lineups.js
```

## ⚠️ Se Não Funcionar

### Problema: Modal abre mas sem jogadores

**Solução:**
1. Executar: `node check-lineups.js` (backend)
   - Se count = 0: Ir para "Gestor de Equipa" e salvar escalação
   - Se count > 0: Error na API, contactar

2. F12 → Network tab
   - Procurar por `/api/team-manager/lineups/...`
   - Response status 200 = existe, 404 = não existe

3. F12 → Console
   - Se vê `⚠️ AVISO: Nenhum jogador disponível` = sem escalação
   - Se vê erro vermelho = problema na loading

### Problema: Modal não abre

**Solução:**
1. F12 → Console → Procurar erros (textos em vermelho)
2. Se há erro na autenticação:
   - localStorage.getItem('azores_score_token') vazio?
   - Fazer Logout e Login novamente

### Problema: Só aparece mock players

**Solução:**
- Normal se tidak ada escalação salva
- Teste com escalação salva (ver "Teste Completo" acima)

## 📈 Verificar Performance

```javascript
// No console do browser
// Quanto tempo leva para carregar os jogadores?

// Abrir Console antes de clicar em "Golo"
// Contar quanto tempo aparecem os logs:
// 📋 Carregando escalação...
// até
// (✅ ou 🎲)

// Normal: < 1 segundo até max 3 segundos
```

## ✔️ Checklist Final

- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 8001
- [ ] Consegue abrir um jogo
- [ ] Consegue abrir modal "⚽ Golo"
- [ ] Modal mostra dropdown com jogadores
- [ ] Console mostra logs de loading
- [ ] Consegue selecionar um jogador
- [ ] Consegue registar o evento
- [ ] Evento aparece no timeline

Se tudo estiver checked, **Parabéns! 🎉 Está funcionando!**

## 📞 Se Precisar de Ajuda

1. Executar `node check-lineups.js` da pasta backend
2. Abrir DevTools (F12)
3. Copiar logs do console
4. Deixar aberto para debug
5. Contactar com screenshot ou descrição do erro

---

**Documentação Relacionada:**
- [GUIA_TESTE_ESCALACAO.md](GUIA_TESTE_ESCALACAO.md) - Guia completo do utilizador
- [DIAGNOSTICO_ESCALACAO.md](DIAGNOSTICO_ESCALACAO.md) - Troubleshooting avançado
- [RELATORIO_IMPLEMENTACAO.md](RELATORIO_IMPLEMENTACAO.md) - Detalhes técnicos
