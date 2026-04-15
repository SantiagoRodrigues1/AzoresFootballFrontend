/**
 * 🎯 IMPLEMENTAÇÃO COMPLETA - SISTEMA DE ÁRBITROS & ADMIN
 * 
 * Data: Abril 2026
 * Stack: React + Ionic + TypeScript + Node.js/Express + JWT
 * Status: ✅ PRONTO PARA TESTES
 */

# 📋 RESUMO DE IMPLEMENTAÇÃO

## ✅ O QUE FOI IMPLEMENTADO

### 1️⃣ ESTRUTURA DE PASTAS (Criada)
```
src/
 ├── guards/
 │    ├── RefereeRoute.tsx    ✅ Protege rotas do árbitro
 │    ├── AdminRoute.tsx      ✅ Protege rotas do admin
 │    └── index.ts            ✅ Exportações centralizadas
 │
 ├── services/
 │    ├── refereeService.ts   ✅ API calls para árbitros
 │    ├── matchService.ts     ✅ API calls para jogos
 │    └── index.ts            ✅ Exportações centralizadas
 │
 ├── pages/
 │    ├── referee/
 │    │    ├── RefereeDashboard.tsx    ✅ Dashboard do árbitro
 │    │    ├── RefereeMatches.tsx      ✅ Lista de jogos do árbitro
 │    │    ├── MatchDetails.tsx        ✅ Detalhes de um jogo
 │    │    ├── UploadReport.tsx        ✅ Upload de relatório pós-jogo
 │    │    └── *.css                   ✅ Estilos para cada página
 │    │
 │    └── admin/
 │         ├── AdminMatches.tsx        ✅ Gestão de todos os jogos
 │         ├── AssignReferees.tsx      ✅ Seleção de árbitros (CORE)
 │         └── *.css                   ✅ Estilos para cada página
 │
 └── components/referee/
      ├── MatchCard.tsx       ✅ Card reutilizável de jogo
      ├── RefereeCard.tsx     ✅ Card reutilizável de árbitro
      ├── StatsCard.tsx       ✅ Card reutilizável de estatísticas
      └── RefereeCard.tsx     ✅ Seleção visual de árbitros
```

### 2️⃣ GUARDS DE ROTA PROFISSIONAIS ✅

**RefereeRoute.tsx**
- ✅ Verifica autenticação (token)
- ✅ Valida role = "referee"
- ✅ Valida status de aprovação ("approved")
- ✅ Redireciona para "/ref/pending-approval" se pendente
- ✅ Redireciona para "/ref/signup" se não aprovado

**AdminRoute.tsx**
- ✅ Verifica autenticação (token)
- ✅ Valida role = "admin"
- ✅ Redireciona para "/" se não autenticado

### 3️⃣ SERVICES COMPLETOS ✅

**refereeService.ts**
- ✅ getApprovedReferees()       - Get árbitros aprovados
- ✅ getAllReferees()            - Get todos os árbitros (admin)
- ✅ getRefereeById()            - Get árbitro específico
- ✅ getRefereeDashboard()       - Get estatísticas do dashboard
- ✅ uploadMatchReport()         - Upload PDF + comentário
- ✅ confirmRefereeAttendance()  - Confirmar presença
- ✅ markRefereeUnavailable()    - Marcar como indisponível

**matchService.ts**
- ✅ getAllMatches()             - Get todos os jogos
- ✅ getRefereeMatches()         - Get jogos do árbitro
- ✅ getMatchById()              - Get jogo específico
- ✅ assignRefereesToMatch()     - Atribuir árbitros (PUT)
- ✅ getMatchesWithoutReferees() - Get jogos sem árbitros
- ✅ getMatchesByStatus()        - Filtrar por status

### 4️⃣ COMPONENTES REUTILIZÁVEIS ✅

**MatchCard.tsx**
- ✅ Lista de jogos com informações
- ✅ Mostra equipas, placar, local, data
- ✅ Badges de status
- ✅ Botão "Ver Detalhes"
- ✅ Responsive design

**RefereeCard.tsx**
- ✅ Informações do árbitro
- ✅ Seleção visual (checkmark/circle)
- ✅ Tipo de seleção (Main, Asst1, Asst2, 4th)
- ✅ Estados disabled
- ✅ Avatar com fallback

**StatsCard.tsx**
- ✅ Mostra estatísticas com ícone
- ✅ Valor principal + trending opcional
- ✅ 4 cores diferentes (primary, success, danger, warning)
- ✅ Clicável com navigate

### 5️⃣ PÁGINAS DO ÁRBITRO ✅

**RefereeDashboard.tsx** 🎯
- ✅ Saudação personalizada com nome
- ✅ Estatísticas: Total jogos, Este mês, Relatórios
- ✅ Próximos 3 jogos com MatchCard
- ✅ Ações rápidas (Meus Jogos, Definições)
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Logout button

**RefereeMatches.tsx** 📋
- ✅ Filtro: Próximos / Terminados
- ✅ Lista de jogos com MatchCard
- ✅ Navegação para MatchDetails
- ✅ Pull-to-refresh
- ✅ Empty states

**MatchDetails.tsx** 📖
- ✅ Informações completas do jogo
- ✅ Equipas com logos
- ✅ Data e local formatados
- ✅ Equipa de arbitragem (4 árbitros)
- ✅ Botão "Confirmar Presença"
- ✅ Botão "Marcar Indisponível"
- ✅ Botão "Enviar Relatório" (se terminado)
- ✅ AlertDialog de confirmação

**UploadReport.tsx** 📄
- ✅ Upload de ficheiro PDF (com validação)
- ✅ Comentário opcional (500 chars)
- ✅ Validação: máximo 5MB
- ✅ Pré-visualização do ficheiro selecionado
- ✅ AlertDialog de confirmação antes de enviar
- ✅ Loading spinner durante upload
- ✅ Toast de sucesso/erro

### 6️⃣ PÁGINAS DO ADMIN 🛡️

**AdminMatches.tsx** 📊
- ✅ Estatísticas: Total, Com árbitros, Sem árbitros
- ✅ Filtro: Todos / Com árbitros / Sem árbitros
- ✅ Lista de todos os jogos
- ✅ Status badge (Com ✓ / Sem ✗)
- ✅ Mostra árbitros já atribuídos
- ✅ Botão "Selecionar Árbitros" / "Alterar Árbitros"
- ✅ Pull-to-refresh

**AssignReferees.tsx** 🎯 (CORE - A MAIS IMPORTANTE)
- ✅ Abas para cada posição:
  - 🎯 Árbitro Principal
  - ⚪ Assistente 1
  - ⚪ Assistente 2
  - 🟡 4º Árbitro

- ✅ Status de seleção visual:
  - Cards com status (selected/empty)
  - Progress bar (0-4 árbitros)
  - Contador visual

- ✅ Busca de árbitros:
  - Search bar com filtro em tempo real
  - Remove árbitros já selecionados noutras posições
  - RefereeCard com seleção visual

- ✅ RefereeCard mostra:
  - Avatar com fallback
  - Nome e email
  - Categoria e federação
  - Badges de seleção
  - Botão selecionar

- ✅ Validações:
  - Bloqueia guardar se houver menos de 4 árbitros
  - Impede seleção do mesmo árbitro em múltiplas posições
  - AlertDialog de confirmação antes de guardar

- ✅ Lógica de atribuição:
  - GET /users?role=referee&status=approved
  - PUT /matches/:id/referees com { main, assistant1, assistant2, fourthReferee }
  - Toast de sucesso com redirect

### 7️⃣ ROTAS INTEGRADAS ✅

**Árbitro (Protegidas com RefereeRoute)**
```
/referee/dashboard                  → RefereeDashboard
/referee/matches                    → RefereeMatches
/referee/matches/:matchId           → MatchDetails
/referee/matches/:matchId/upload-report → UploadReport
```

**Admin (Protegidas com AdminRoute)**
```
/admin/matches                      → AdminMatches
/admin/matches/:matchId/assign-referees → AssignReferees
```

### 8️⃣ FUNCIONALIDADES PROFISSIONAIS ✅

- ✅ **Loading States**: IonLoading com mensagens personalizadas
- ✅ **Empty States**: Ícones e mensagens descritivas
- ✅ **Toast Notifications**: Sucesso/erro com cores
- ✅ **Pull-to-Refresh**: Para recarregar dados
- ✅ **Confirmação**: AlertDialogs antes de ações críticas
- ✅ **Validação de Ficheiros**: Tipo, tamanho
- ✅ **Filtros**: Por status, por busca
- ✅ **Search**: Com debounce em tempo real
- ✅ **Responsive**: Funciona em mobile/tablet/desktop
- ✅ **Comentários no Código**: Explicações claras
- ✅ **Estilos Profissionais**: CSS moderno com Ionic components
- ✅ **Segurança**: Guards de rota + validação de role

---

## 🔌 ENDPOINTS ESPERADOS DO BACKEND

### Para Árbitros (refereeService)
```
GET /api/users?role=referee&status=approved
  → Retorna array de árbitros aprovados

GET /api/referee/dashboard
  → Retorna { totalMatches, matchesThisMonth, reportsSubmitted, upcomingMatches }

GET /api/referee/:refereeId/matches
  → Retorna array de jogos atribuídos ao árbitro

GET /api/matches/:matchId
  → Retorna detalhes do jogo

POST /api/matches/:matchId/confirm-attendance
  → Confirma presença do árbitro

POST /api/matches/:matchId/unavailable
  → Marca árbitro como indisponível

POST /api/matches/:matchId/report
  → Upload de PDF (FormData com "report" e "comment")
```

### Para Admin (matchService)
```
GET /api/matches
  → Retorna todos os jogos

PUT /api/matches/:matchId/referees
  → Atribui árbitros { main, assistant1, assistant2, fourthReferee }

GET /api/matches?referees=missing
  → Retorna jogos sem árbitros

GET /api/matches?status=scheduled
  → Filtra por status
```

---

## 🚀 COMO USAR

### 1️⃣ Para Árbitro Acessar Dashboard:
1. Fazer login com email/password
2. Sistema valida role="referee" e refereeStatus="approved"
3. Navegar para `/referee/dashboard`
4. RefereeRoute permite acesso ✅

### 2️⃣ Para ver Meus Jogos:
1. No dashboard, clicar "Meus Jogos" ou usar `/referee/matches`
2. Selecionar filtro: Próximos / Terminados
3. Clicar em um jogo para ver MatchDetails

### 3️⃣ Para Confirmar Presença:
1. Abrir MatchDetails de um jogo futuro
2. Clicar "Confirmar Presença"
3. Confirmar em AlertDialog
4. Toast de sucesso

### 4️⃣ Para Upload de Relatório:
1. Abrir MatchDetails de um jogo terminado
2. Clicar "Enviar Relatório"
3. Selecionar ficheiro PDF (máx 5MB)
4. Adicionar comentário opcional
5. Confirmar
6. Aguardar upload e sucesso

### 5️⃣ Para Admin Gerir Jogos:
1. Fazer login com role="admin"
2. Navegar para `/admin/matches`
3. Clicar "Selecionar Árbitros" num jogo
4. Abrir AssignReferees

### 6️⃣ Para Admin Atribuir Árbitros (CORE):
1. Na página AssignReferees:
   - Ver abas para cada posição
   - Ver status de seleção (4/4 árbitros criados)
   - Ver progress bar

2. Para cada posição (Main → Asst1 → Asst2 → 4th):
   - Usar search bar para filtrar
   - Clicar em RefereeCard para selecionar
   - Ver checkmark quando selecionado

3. Quando tem 4 árbitros:
   - Botão "Guardar Atribuição" fica habilitado
   - Clicar para confirmar
   - AlertDialog mostra resumo
   - Confirmação envia PUT e redireciona

---

## 💡 NOTAS IMPORTANTES

### Variáveis de Ambiente Necessárias
```
VITE_API_URL=http://localhost:3000/api
```

### Tipos esperados do User Context
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'fan' | 'referee' | 'admin' | ...
  refereeStatus?: 'pending' | 'approved' | 'rejected'
  avatar?: string;
}
```

### StatusBadge Colors
- scheduled → warning (amarelo)
- live → danger (vermelho)
- finished → success (verde)
- postponed → medium (cinzento)

### Responsive Grid
- Mobile: 1 coluna
- Tablet (md): 2-3 colunas
- Desktop: 4 colunas

---

## ✨ DIFERENCIAIS IMPLEMENTADOS

1. **Componentes Reutilizáveis**: MatchCard, RefereeCard, StatsCard
2. **Services Centralizados**: Fácil manutenção e testes
3. **Guards de Rota Profissionais**: Validação múltipla mas clara
4. **Feedback do Utilizador**: Toast, Loading, Empty states
5. **Validação Completa**: Ficheiros, seleções, permissões
6. **UI Moderna**: Ionic components + CSS profissional
7. **Código Documentado**: Comentários em cada ficheiro
8. **Structure Clara**: Fácil expandir com novas funcionalidades

---

## 🧪 PRÓXIMAS ETAPAS PARA TESTES

1. Verificar endpoints do backend
2. Testar fluxo completo árbitro-admin
3. Validar upload de ficheiros
4. Testar filtros e búsca
5. Verificar responsive em móvel
6. Testar guards de rota com diferentes roles

---

**Status: ✅ PRONTO PARA INTEGRAÇÃO E TESTES**
**Data: Abril 2026**
**Desenvolvido por: Senior Fullstack Developer AI**
