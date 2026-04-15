/**
 * 🎯 GUIA RÁPIDO DE TESTES - SISTEMA DE ÁRBITROS
 * 
 * Siga as instruções abaixo para testar a implementação
 */

# ⚡ GUIA DE TESTES RÁPIDO

## 📋 PRÉ-REQUISITOS

1. Backend e Frontend já a correr
2. Base de dados com dados de exemplo
3. Usuários criados com roles corretos

## 🧪 TESTE 1: Árbitro - Dashboard

**Scenario**: Árbitro aprovado vê seu dashboard

```
1. Login com email de árbitro (role=referee, refereeStatus=approved)
2. Navegar para /referee/dashboard
3. Verificar:
   - ✅ Nome do árbitro no greeting
   - ✅ Status "Aprovado" visível
   - ✅ 3 StatsCard com números
   - ✅ Próximos jogos em MatchCard
   - ✅ Botões "Meus Jogos" e "Definições"
```

**Esperado**: Dashboard carrega com dados e é responsivo

---

## 🧪 TESTE 2: Árbitro - Listar Jogos

**Scenario**: Árbitro vê seus jogos com filtro

```
1. No dashboard, clicar "Meus Jogos"
2. Navegar para /referee/matches
3. Verificar:
   - ✅ Abas: Próximos (N) | Terminados (M)
   - ✅ Lista de MatchCard com filtro ativo
   - ✅ Cada card mostra: equipas, logo, data, local
   - ✅ Botão "Ver Detalhes" em cada jogo
4. Mudar filtro para "Terminados"
5. Verificar que lista muda
```

**Esperado**: Filtragem funciona e MatchCard é exibido corretamente

---

## 🧪 TESTE 3: Árbitro - Ver Detalhes do Jogo

**Scenario**: Árbitro vê detalhes completos + equipa de arbitragem

```
1. Em /referee/matches, clicar "Ver Detalhes"
2. Navegar para /referee/matches/:matchId
3. Verificar:
   - ✅ Informações do jogo (equipas, local, data)
   - ✅ Placar (se terminado)
   - ✅ Secção "Equipa de Arbitragem" com 4 árbitros
   - ✅ Botão "Confirmar Presença" (se futuro)
   - ✅ Botão "Marcar Indisponível" (se futuro)
4. Se jogo terminado:
   - ✅ Botão "Enviar Relatório" em vez de confirmar
```

**Esperado**: Todos os dados exibidos corretamente

---

## 🧪 TESTE 4: Árbitro - Confirmar Presença

**Scenario**: Árbitro confirma presença num futuro jogo

```
1. Em MatchDetails de um jogo futuro
2. Clicar "Confirmar Presença"
3. Verificar:
   - ✅ AlertDialog aparece com confirmação
   - ✅ 2 botões: "Cancelar" e "Confirmar"
4. Clicar "Confirmar"
5. Verificar:
   - ✅ Toast verde "✅ Presença confirmada"
   - ✅ Página recarrega (ou estado muda)
   - ✅ Botão desaparece/fica desabilitado
```

**Esperado**: POST /matches/:matchId/confirm-attendance enviado com sucesso

---

## 🧪 TESTE 5: Árbitro - Upload de Relatório

**Scenario**: Árbitro faz upload de PDF após jogo terminado

```
1. Em MatchDetails de um jogo terminado
2. Clicar "Enviar Relatório"
3. Navegar para /referee/matches/:matchId/upload-report
4. Verificar:
   - ✅ Card com info do jogo
   - ✅ Upload area com "Selecionar Ficheiro"

5. Clicar "Selecionar Ficheiro"
6. Escolher ficheiro PDF válido (< 5MB)
7. Verificar:
   - ✅ Ficheiro aparece em "Ficheiro Selecionado"
   - ✅ Nome e tamanho mostrados
   - ✅ Botão "Remover" aparece

8. Adicionar comentário opcional

9. Clicar "Enviar Relatório"
10. Verificar:
    - ✅ AlertDialog pedindo confirmação
11. Confirmar
12. Verificar:
    - ✅ Spinner "Enviando relatório..."
    - ✅ Toast verde "✅ Relatório enviado com sucesso!"
    - ✅ Redirect para /referee/matches/:matchId
```

**Esperado**: POST /matches/:matchId/report com FormData enviado

---

## 🧪 TESTE 6: Admin - Listar Jogos

**Scenario**: Admin vê todos os jogos com status de árbitros

```
1. Login com email de admin (role=admin)
2. Navegar para /admin/matches
3. Verificar:
   - ✅ Stats: Total, Com Árbitros, Sem Árbitros
   - ✅ Abas: Todos | Com ✓ | Sem ✗
   - ✅ Lista de todos os jogos em AdminMatchCard

4. Cada card mostra:
   - ✅ Equipas
   - ✅ Competição
   - ✅ Data e hora
   - ✅ Local
   - ✅ Badge: "Com Árbitros" (verde) ou "Sem Árbitros" (vermelho)
   - ✅ Se tem árbitros, mostra lista com nomes

5. Mudar filtro:
   - ✅ "Com ✓" só mostra com árbitros
   - ✅ "Sem ✗" só mostra sem árbitros
```

**Esperado**: Filtragem funciona, AdminMatchCard mostra informações corretas

---

## 🧪 TESTE 7: Admin - Selecionar Árbitros (CORE)

**Scenario**: Admin atribui árbitros a um jogo (TESTE MAIS IMPORTANTE)

```
1. Em /admin/matches, clicar "Selecionar Árbitros" num jogo
2. Navegar para /admin/matches/:matchId/assign-referees
3. Verificar layout:
   - ✅ Card com info do jogo
   - ✅ Card "Status de Seleção" com 4 boxes:
     * 🎯 Principal: "Por escolher"
     * ⚪ Assistente 1: "Por escolher"
     * ⚪ Assistente 2: "Por escolher"
     * 🟡 4º Árbitro: "Por escolher"
   
   - ✅ Progress bar vazia (0/4)
   - ✅ Abas segmentadas para 4 posições
   - ✅ Cada aba com badge ○ (vazio)
   - ✅ Search bar
   - ✅ Botão "Guardar Atribuição" DESABILITADO

#### PASSO 1: Selecionar Árbitro Principal

4. Clicar aba "🎯 Principal"
5. Verificar:
   - ✅ Lista de RefereeCard com árbitros
   - ✅ Cada card mostra: avatar, name, email, categoria
   - ✅ Ícone circle (vazio)

6. Clicar em um RefereeCard
7. Verificar:
   - ✅ Card fica com border verde
   - ✅ Ícone muda para checkmark verde
   - ✅ Status box atualiza com nome do árbitro
   - ✅ Progress bar move para 1/4
   - ✅ Badge da aba "Principal" muda para ✓

#### PASSO 2: Selecionar Assistentes

8. Clicar aba "⚪ Assistente 1"
9. Verificar:
   - ✅ Árbitro anterior não aparece na lista (já selecionado)
   - ✅ Search bar vazio

10. Clicar em outro RefereeCard
11. Verificar:
    - ✅ 2º árbitro selecionado
    - ✅ Status box atualiza "Assistente 1"
    - ✅ Progress bar → 2/4
    - ✅ Badge da aba → ✓

12. Repetir para "Assistente 2" e "4º Árbitro"
13. Após cada seleção, verificar:
    - ✅ Progress bar incrementa
    - ✅ Badges das abas atualizam
    - ✅ Status boxes mostram nomes

#### PASSO 3: Guardar Atribuição

14. Quando 4/4 completo:
    - ✅ Botão "Guardar Atribuição" HABILITADO

15. Clicar "Guardar Atribuição"
16. Verificar:
    - ✅ AlertDialog com resumo dos 4 árbitros:
      * 🎯 Principal: [Nome]
      * ⚪ Assistente 1: [Nome]
      * ⚪ Assistente 2: [Nome]
      * 🟡 4º Árbitro: [Nome]
    
    - ✅ 2 botões: "Cancelar" e "Confirmar"

17. Clicar "Confirmar"
18. Verificar:
    - ✅ Spinner "Enviando..."
    - ✅ Toast verde "✅ Árbitros atribuídos com sucesso!"
    - ✅ Redirect para /admin/matches
    - ✅ Na AdminMatchCard, now shows "Com Árbitros" com nomes

#### Teste de Cancelamento

19. Abrir outro jogo
20. Clicar "Selecionar/Alterar Árbitros"
21. Selecionar 3 árbitros (deixar 1 vazio)
22. Verificar:
    - ✅ Botão "Guardar Atribuição" DESABILITADO

23. Buscar por um nome específico no search
24. Verificar:
    - ✅ Lista filtra em tempo real
    - ✅ Apenas árbitro com aquele nome aparece

#### Teste de Guard de Rota

25. Fazer logout
26. Tentar aceder /admin/matches
27. Verificar:
    - ✅ Redireciona para /auth
    - ✅ Loading "Verificando acesso admin..."

28. Login como árbitro (role=referee)
29. Tentar /admin/matches
30. Verificar:
    - ✅ Redireciona para /
    - ✅ Acesso negado (guard bloqueia)
```

**Esperado**: Fluxo completo de seleção e atribuição funciona perfeitamente

---

## 🧪 TESTE 8: Guards de Rota

**Scenario**: Verificar acesso controlado por role

```
#### Guard: RefereeRoute

1. Sem login:
   - Tentar /referee/dashboard
   - ✅ Redireciona para /auth

2. Login como "fan":
   - Tentar /referee/dashboard
   - ✅ Redireciona para /
   - ✅ Mensagem "Acesso negado: Role necessária 'referee'"

3. Login como "referee" + refereeStatus="pending":
   - Tentar /referee/dashboard
   - ✅ Redireciona para /referee/pending-approval
   - ✅ Mensagem "Árbitro aguardando aprovação"

4. Login como "referee" + refereeStatus="rejected":
   - Tentar /referee/dashboard
   - ✅ Redireciona para /referee/signup
   - ✅ Mensagem "Árbitro rejeitado"

5. Login como "referee" + refereeStatus="approved":
   - Tentar /referee/dashboard
   - ✅ ACESSO PERMITIDO ✓
   - Dashboard carrega normalmente

#### Guard: AdminRoute

1. Sem login:
   - Tentar /admin/matches
   - ✅ Redireciona para /auth

2. Login como "referee":
   - Tentar /admin/matches
   - ✅ Redireciona para /
   - ✅ Mensagem "Acesso negado: Role necessária 'admin'"

3. Login como "admin":
   - Tentar /admin/matches
   - ✅ ACESSO PERMITIDO ✓
   - AdminMatches carrega normalmente
```

**Esperado**: Guards protegem rotas corretamente

---

## ✅ VALIDAÇÃO FINAL

- [ ] RefereeDashboard carrega e mostra dados
- [ ] RefereeMatches filtra por status
- [ ] MatchDetails mostra equipa completa
- [ ] Confirmar presença funciona
- [ ] Upload de relatório valida ficheiro
- [ ] AdminMatches filtra jogos
- [ ] AssignReferees permite seleção de 4 árbitros
- [ ] Progress bar e status boxes atualizam
- [ ] Guardar atribuição envia PUT correto
- [ ] Guards de rota protegem endpoints
- [ ] UI é responsiva em móvel/tablet/desktop
- [ ] Toast/Loading/Empty states funcionam

---

## 🐛 DEBUG

Se algo não funcionar:

1. **Verificar Console**: F12 → Console para erro JavaScript
2. **Verificar Network**: F12 → Network para verificar calls API
3. **Verificar Backend**: Logs do servidor para erros de endpoint
4. **Verificar LocalStorage**: Aplicação guarda token/user em localStorage
5. **Verificar .env**: VITE_API_URL deve estar configurado

---

**Status: ✅ PRONTO PARA TESTES**
