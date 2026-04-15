# 📊 Guia de Integração - Painel Administrativo AzoresScore

## Visão Geral

O painel administrativo foi integrado com sucesso no fluxo de autenticação existente. Agora, em vez de ter um login separado para admins, o sistema utiliza o login unificado (`/auth`) onde usuários com `role: "admin"` veem opções administrativas.

## Fluxo de Acesso

### Para Administradores:

1. **Login Unificado**
   - Acesso: `/auth`
   - Credenciais: `admin@azores-score.com` / `admin123`
   - Sistema cria token JWT automaticamente

2. **Menu MorePage**
   - Após login, o user admin vê a aba "Mais" (MorePage)
   - Seção "⚙️ Administração" aparece automaticamente
   - Opções disponíveis:
     - 📊 Gerir Admin (Dashboard completo)
     - 👥 Utilizadores
     - ⚽ Clubes
     - 🏆 Competições

3. **Painel Admin Integrado**
   - Rota: `/admin-panel`
   - Endpoint: URL base da aplicação + "/admin-panel"
   - Layout: Usa o mesmo AppLayout que o resto da app
   - Proteção: Acesso restrito a users com `role === "admin"`

## Arquitetura do Painel

### Nova Página: `AdminPanelPage.tsx`

**Localização:** `src/pages/AdminPanelPage.tsx`

**Funcionalidades:**
- ✅ Dashboard com estatísticas em tempo real
- ✅ Navegação por abas (6 módulos)
- ✅ Verificação automática de permissões
- ✅ Design responsivo com dark mode
- ✅ Animações suaves (Framer Motion)

**Componentes Utilizados:**
```tsx
- StatCard: Exibe métricas com ícones coloridos
- Motion (Framer): Animações de entrada/saída
- Axios: Chamadas para `/api/admin/*`
- AuthContext: Verificação de role
```

**Dados Carregados:**
```
GET /api/admin/dashboard
└── Estatísticas:
    ├── users (total, byRole)
    ├── clubs (total)
    ├── players (total)
    ├── matches (total, byStatus)
    ├── referees (total)
    └── competitions (total)
```

## Mudanças no App.tsx

### Antes:
```tsx
// Rotas separadas do admin
<Route path="/admin" element={<AdminLoginPage />} />
<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
```

### Depois:
```tsx
// Rota integrada
<Route path="/admin-panel" element={
  <AppLayout>
    <AdminPanelPage />
  </AppLayout>
} />
```

**Benefícios:**
- ✅ Admin usa mesmo layout que usuários normais
- ✅ Integração perfeita com AppLayout (TabBar, header, etc)
- ✅ Sem página de login separada confusa
- ✅ Token reutilizado do login unificado

## Mudanças no MorePage.tsx

### Admin Items:
```tsx
const adminItems = [
  { icon: '📊', label: 'Gerir Admin', action: () => navigate('/admin-panel') },
  { icon: '👥', label: 'Utilizadores', action: () => navigate('/admin-panel?tab=users') },
  { icon: '⚽', label: 'Clubes', action: () => navigate('/admin-panel?tab=clubs') },
  { icon: '🏆', label: 'Competições', action: () => navigate('/admin-panel?tab=competitions') },
];
```

**Comportamento:**
- Mostram apenas se `user?.role === "admin"`
- Aparecem em seção separada "⚙️ Administração"
- Query params para navegação entre abas

## Variáveis de Ambiente

O sistema reutiliza as mesmas variáveis já configuradas:

```env
VITE_API_URL=http://localhost:3000
# ou
VITE_API_URL=https://seu-dominio.com
```

## Endpoints da API Admin

Todos os endpoints continuam iguais, no backend:

```
GET    /api/admin/dashboard              # Estatísticas
GET    /api/admin/users                  # Listar users
POST   /api/admin/users                  # Criar user
PATCH  /api/admin/users/:id              # Atualizar
DELETE /api/admin/users/:id              # Deletar
... (e mais para clubs, matches, referees, competitions)
```

**Autenticação:**
```
Header: Authorization: Bearer <token>
```

## Testando a Integração

### 1. Iniciar Servers
```bash
# Terminal 1 - Backend
cd azores-score-backend
npm start

# Terminal 2 - Frontend
cd azores-football-live-main
npm run dev
```

### 2. Acessar a Aplicação
```
Frontend: http://localhost:8080
Backend: http://localhost:3000
```

### 3. Fazer Login como Admin
- URL: `/auth`
- Email: `admin@azores-score.com`
- Senha: `admin123`

### 4. Navegar para Admin Panel
- Após login, clique em "Mais" (MorePage)
- Clique em "📊 Gerir Admin"
- Deve carregar `/admin-panel` com dashboard

### 5. Verificar Dados
- Dashboard mostra estatísticas do `/api/admin/dashboard`
- As 6 abas estão disponíveis para futura expansão

## Estrutura de Pastas

```
src/
├── pages/
│   ├── AdminPanelPage.tsx          # Nova página integrada
│   ├── MorePage.tsx                 # Atualizado com admin items
│   └── ... (outras páginas)
├── components/
│   └── layout/
│       └── AppLayout.tsx            # Usado por AdminPanelPage
├── contexts/
│   └── AuthContext.tsx              # Verificação de role
└── App.tsx                          # Rota /admin-panel adicionada
```

## Próximos Passos (Expansão Futura)

As abas restantes podem ser expandidas incorporando os componentes admin anteriormente criados:

1. **Utilizadores Tab** → `AdminUsersPage.tsx`
2. **Clubes Tab** → `AdminClubsPage.tsx`
3. **Jogos Tab** → `AdminMatchesPage.tsx`
4. **Árbitros Tab** → `AdminRefereesPage.tsx`
5. **Competições Tab** → `AdminCompetitionsPage.tsx`

Padrão sugerido:
```tsx
{activeTab === 'users' && <AdminUsersPage embedded={true} />}
{activeTab === 'clubs' && <AdminClubsPage embedded={true} />}
```

## Segurança

✅ **Verificações implementadas:**
1. JWT token obrigatório em `/api/admin/*`
2. Verificação de `role === "admin"` no backend (middleware)
3. Verificação de `role === "admin"` no frontend (AdminPanelPage)
4. Redirecionamento automático se não autorizado

## Troubleshooting

### ❌ "Painel Admin não aparece em Mais"
- Verificar se `user?.role === "admin"` no localStorage
- Confirmar que o login foi bem-sucedido
- Verificar console do browser para erros

### ❌ "Erro 401 ao carregar dashboard"
- Verificar se token está em localStorage
- Confirmar URL do backend está correta em VITE_API_URL
- Verificar se backend está rodando em porta 3000

### ❌ "Abas 'Utilizadores', 'Clubes', etc não funcionam"
- Atualmente mostram placeholder (🚧 em desenvolvimento)
- Para funcionalidade completa, incorporar componentes admin anteriormente criados
- Ver "Próximos Passos" acima

## Resumo das Mudanças

| Arquivo | Mudança | Impacto |
|---------|---------|--------|
| `App.tsx` | Removidas rotas admin separadas, adicionada `/admin-panel` | Admin agora integrado no fluxo principal |
| `MorePage.tsx` | adminItems atualizado com navegação | Admin vê opções ao fazer login |
| `AdminPanelPage.tsx` | **Novo arquivo** | Página principal do painel integrado |

---

**Versão:** 1.0.0  
**Data:** 2025-01-17  
**Status:** ✅ Integração Completa
