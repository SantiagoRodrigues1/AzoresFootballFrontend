# 🏗️ ARQUITETURA - Painel Admin Integrado

## Diagrama de Fluxo - Do Login ao Painel Admin

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        App.tsx (Routes)                          │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  Route /auth → AuthPage (Login)                                 │  │
│  │  Route /     → AppLayout {HomePage}                             │  │
│  │  Route /more → AppLayout {MorePage} ← Admin vê menu aqui       │  │
│  │  Route /admin-panel → AppLayout {AdminPanelPage} ← NOVO        │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 AuthContext (State Management)                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  user.name      (ex: "Admin User")                             │   │
│  │  user.email     (ex: "admin@azores-score.com")                │   │
│  │  user.role      (ex: "admin")  ← VERIFICAÇÃO CRÍTICA          │   │
│  │  user.status    (ex: "active")                                │   │
│  │  token          (JWT - salva em localStorage)                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                MorePage.tsx (Menu/Navigation)                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  IF user.role === 'admin' THEN:                               │   │
│  │    ┌─────────────────────────────────────────┐                │   │
│  │    │ ⚙️ ADMINISTRAÇÃO (seção especial)      │                │   │
│  │    ├─────────────────────────────────────────┤                │   │
│  │    │ 📊 Gerir Admin    → navigate('/admin-panel')            │   │
│  │    │ 👥 Utilizadores  → navigate('/admin-panel?tab=users')  │   │
│  │    │ ⚽ Clubes        → navigate('/admin-panel?tab=clubs')  │   │
│  │    │ 🏆 Competições  → navigate('/admin-panel?tab=comp')   │   │
│  │    └─────────────────────────────────────────┘                │   │
│  │                                                                 │   │
│  │  Outros MenuItems (para todos os users):                       │   │
│  │    👤 Perfil, ⭐ Favoritos, 🔔 Notificações, etc              │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │             AdminPanelPage.tsx (Dashboard Principal) ✨ NOVO     │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  1. Verificação:                                               │  │
│  │     └─ IF user?.role !== 'admin' → navigate('/') STOP         │  │
│  │                                                                  │  │
│  │  2. Carregamento de Dados:                                     │  │
│  │     └─ GET /api/admin/dashboard                               │  │
│  │        Headers: Authorization: Bearer ${token}                │  │
│  │        Retorna: { users, clubs, players, matches, refs, comps}│  │
│  │                                                                  │  │
│  │  3. UI Components:                                             │  │
│  │     ┌────────────────────────────────────────┐                │  │
│  │     │ Header: "⚙️ Painel Administrativo"    │                │  │
│  │     │ Bem-vindo, ${user.name}               │                │  │
│  │     └────────────────────────────────────────┘                │  │
│  │                                                                  │  │
│  │     ┌────────────────────────────────────────┐                │  │
│  │     │ [📊│👥│⚽│🎮│🟨│🏆] Abas Navigation   │                │  │
│  │     └────────────────────────────────────────┘                │  │
│  │                                                                  │  │
│  │     StatCards (Grid 2x3):                                      │  │
│  │     ┌─────────────┐ ┌─────────────┐                           │  │
│  │     │👥 50 Users  │ │⚽ 20 Clubs  │                           │  │
│  │     └─────────────┘ └─────────────┘                           │  │
│  │     ┌─────────────┐ ┌─────────────┐                           │  │
│  │     │👤 250 Players│ │🎮 150 Matches│                         │  │
│  │     └─────────────┘ └─────────────┘                           │  │
│  │     ┌─────────────┐ ┌─────────────┐                           │  │
│  │     │🟨 15 Refs   │ │🏆 5 Comps  │                           │  │
│  │     └─────────────┘ └─────────────┘                           │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↓
                         (API Calls com JWT)
                                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               Middleware (auth.js)                              │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  1. verifyToken (JWT Validation)                               │  │
│  │     └─ Valida token do header Authorization                   │  │
│  │     └─ Se válido → next() | Se inválido → 401 Unauthorized   │  │
│  │                                                                  │  │
│  │  2. verifyAdmin (Role Check)                                   │  │
│  │     └─ Verifica se user.role === 'admin'                      │  │
│  │     └─ Se admin → next() | Se não → 403 Forbidden            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   AdminRoutes (/api/admin/*)                    │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  GET  /api/admin/dashboard           (Dashboard Stats)        │  │
│  │       └─ Retorna: users, clubs, players, matches, etc         │  │
│  │                                                                  │  │
│  │  GET  /api/admin/users               (List Users)             │  │
│  │  POST /api/admin/users               (Create User)            │  │
│  │  PATCH/DELETE /api/admin/users/:id   (Update/Delete)          │  │
│  │                                                                  │  │
│  │  GET  /api/admin/clubs               (List Clubs)             │  │
│  │  POST /api/admin/clubs               (Create Club)            │  │
│  │  PATCH/DELETE /api/admin/clubs/:id   (Update/Delete)          │  │
│  │                                                                  │  │
│  │  ... (+ 30+ endpoints para Match, Referee, Competition)       │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Controllers (adminXxxController.js)                │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  adminDashboardController.getDashboardStats()                  │  │
│  │    └─ Queries MongoDB                                          │  │
│  │    └─ Conta users, clubs, players, matches, etc               │  │
│  │    └─ Retorna JSON com estatísticas                           │  │
│  │                                                                  │  │
│  │  adminUserController.getAllUsers()                            │  │
│  │  adminClubController.getAllClubs()                            │  │
│  │  ... (etc)                                                      │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Models (Mongoose)                          │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  User.js (id, name, email, role, status, updatedAt)           │  │
│  │  Club.js (id, name, island, stadium, colors)                  │  │
│  │  Player.js (id, name, club, position, stats)                  │  │
│  │  Match.js (id, homeTeam, awayTeam, score, events, status)     │  │
│  │  Referee.js (id, name, email, status, stats)                  │  │
│  │  Competition.js (id, name, type, teams, standings)            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Database (MongoDB)                         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  Collections:                                                   │  │
│  │  ├─ users (50+ documentos com role="admin", role="user", etc) │  │
│  │  ├─ clubs (20 documentos)                                     │  │
│  │  ├─ players (250+ documentos)                                 │  │
│  │  ├─ matches (150+ documentos com eventos)                     │  │
│  │  ├─ referees (15 documentos)                                  │  │
│  │  └─ competitions (5 documentos)                               │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow Diagram

```
User Login (admin@azores-score.com / admin123)
         ↓
    AuthPage (/auth)
         ↓
   Backend /api/auth/login
         ↓
   Verifica credenciais em MongoDB
         ↓
   Valida password com bcryptjs
         ↓
   Gera JWT Token (includes role: 'admin')
         ↓
   Retorna token ao Frontend
         ↓
   Frontend salva in localStorage.token
         ↓
   Frontend salva user data in localStorage.user
         ↓
   Redireciona para HomePage
         ↓
   User clica em "Mais"
         ↓
   MorePage.tsx renderiza
         ↓
   Verifica: user?.role === 'admin' ✅
         ↓
   Mostra seção "⚙️ ADMINISTRAÇÃO"
         ↓
   User clica "📊 Gerir Admin"
         ↓
   Navigate para /admin-panel
         ↓
   AdminPanelPage.tsx carrega
         ↓
   Verifica: user?.role === 'admin' ✅
         ↓
   Se role não é admin → redirect para '/'
   Se role é admin → continua
         ↓
   Faz GET /api/admin/dashboard
   Headers: Authorization: Bearer ${token}
         ↓
   Backend recebe request
         ↓
   Middleware: verifyToken() → Valida JWT ✅
         ↓
   Middleware: verifyAdmin() → Verifica role ✅
         ↓
   Controller: getDashboardStats()
         ↓
   Queries MongoDB
         ↓
   Retorna JSON com stats
         ↓
   Frontend renderiza AdminPanelPage
   com 6 StatCards e dados
         ↓
   ✅ DASHBOARD COMPLETO
```

---

## Component Hierarchy

```
App.tsx
├── <Routes>
│   ├── /auth
│   │   └── <AuthPage />
│   ├── /
│   │   └── <AppLayout>
│   │       └── <HomePage />
│   ├── /more
│   │   └── <AppLayout>
│   │       └── <MorePage />
│   │           ├── UserCard (if authenticated)
│   │           ├── {conditional adminItems} (if role=admin)
│   │           ├── FavoriteTeams
│   │           └── MainMenu
│   │
│   └── /admin-panel ✨ NOVO
│       └── <AppLayout>
│           └── <AdminPanelPage /> ✨ NOVO
│               ├── Header
│               ├── Tabs Navigation
│               │   ├── Dashboard (default)
│               │   ├── Users (placeholder)
│               │   ├── Clubs (placeholder)
│               │   ├── Matches (placeholder)
│               │   ├── Referees (placeholder)
│               │   └── Competitions (placeholder)
│               ├── StatCards (Grid)
│               │   └── StatCard x6
│               └── Details Boxes
└── <AuthProvider>
    └── <AuthContext>
        ├── user (name, email, role, status)
        ├── token
        ├── isAuthenticated
        └── login/logout functions
```

---

## Data Flow - AdminPanelPage Update Cycle

```
AdminPanelPage.tsx mounts
         ↓
useEffect runs (on mount)
         ↓
axios.get('/api/admin/dashboard', {
  headers: { Authorization: `Bearer ${token}` }
})
         ↓
[FRONTEND]              [BACKEND]              [DATABASE]
  Request        →         API Handler       →    MongoDB
  (JWT token)              (middleware)          (queries)
                                ↓
                          verifyToken()
                          (JWT válido?)
                                ↓ ✅
                          verifyAdmin()
                          (role===admin?)
                                ↓ ✅
                          getDashboardStats()
                                ↓
                          db.collection('users').count()
                          db.collection('clubs').count()
                          db.collection('matches').find()
                          ... (more queries)
                                ↓
                          Aggregates data
                                ↓
Response       ←         Returns JSON      ←   All data
 (stats)                  ({ success, data })
         ↓
setStats(response.data.data)
         ↓
setLoading(false)
         ↓
Component re-renders
         ↓
Display StatCards with numbers
         ↓
✅ DASHBOARD UPDATED
```

---

## File Structure After Implementation

```
Frontend (azores-football-live-main/)
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── MorePage.tsx                ✏️ MODIFIED
│   │   ├── AdminPanelPage.tsx          ✨ NEW
│   │   └── ... (other pages)
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.tsx
│   │   └── ... (other components)
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── App.tsx                         ✏️ MODIFIED
│   └── main.tsx
├── QUICK_START.md                      ✨ NEW
├── ADMIN_PANEL_GUIDE.md                ✨ NEW
├── IMPLEMENTATION_SUMMARY.md           ✨ NEW
├── STATUS.md                           ✨ NEW
├── verify-admin-integration.sh         ✨ NEW
└── package.json                        (unchanged)

Backend (azores-score-backend/)
├── models/
│   ├── User.js
│   ├── Club.js
│   ├── Match.js
│   ├── Referee.js
│   └── Competition.js
├── controllers/
│   ├── adminDashboardController.js
│   ├── adminUserController.js
│   ├── adminClubController.js
│   ├── adminMatchController.js
│   ├── adminRefereeController.js
│   └── adminCompetitionController.js
├── routes/
│   └── adminRoutes.js
├── middleware/
│   └── auth.js
├── server.js
└── package.json
```

---

## 🎯 Key Decision Points

| Decision | Why | Impact |
|----------|-----|--------|
| Integrar em AppLayout | Natural + Consistente | Admin vê UI como outros users |
| Usar JWT existente | Reutilização + Segurança | Sem criação de novo token |
| Verificação role 2x (FE+BE) | Defense in depth | Máxima segurança |
| Query params para abas | URL-friendly | Pode guardar links de abas |
| StatCard components | Reutilizável | Fácil adicionar mais stats |
| Placeholder para abas | MVP approach | Pronto para expansão futura |

---

**Arquitetura finalizada, segura e pronta para expansão! 🏗️**
