/**
 * 🔧 TROUBLESHOOTING - Resolução de Problemas Comuns
 * 
 * Se algo não funcionar, consulte este guia
 */

# 🔧 TROUBLESHOOTING

## ❌ ERRO: Rotas não funcionam

**Problema**: Ao tentar aceder `/referee/dashboard`, vê "404 Not Found"

**Solução**:
1. Verificar se `App.tsx` foi atualizado com as novas rotas
2. Verificar se imports estão corretos:
   ```typescript
   import RefereeDashboard from "@/pages/referee/RefereeDashboard";
   import { RefereeRoute } from "@/guards/RefereeRoute";
   ```
3. Recarregar página (CTRL+SHIFT+R para hard refresh)
4. Verificar console (F12) para erros JavaScript

---

## ❌ ERRO: Guard redireciona sempre

**Problema**: Mesmo com login correto, é redireccionado para `/auth`

**Solução**:
1. Verificar se `user.role` está correto no AuthContext
2. Verificar console: `console.log(user)` deve mostrar role
3. Se role for undefined, verificar backend `/auth/login` response
4. Role deve ser exatamente: `"referee"` ou `"admin"` (lowercase)

```typescript
// Correto
user.role === "referee"

// INCORRETO
user.role === "Referee"
user.role === "REFEREE"
```

---

## ❌ ERRO: Componentes não renderizam

**Problema**: Ver erro `Cannot find module "@/components/referee/MatchCard"`

**Solução**:
1. Verificar se ficheiro existe: `src/components/referee/MatchCard.tsx`
2. Verificar alias `@/` em `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
3. Recarregar TypeScript: Ctrl+Shift+P → "Reload Window"

---

## ❌ ERRO: CSS não aplicado

**Problema**: Estilos não aparecem nas páginas

**Solução**:
1. Verificar se CSS foi criado com mesmo nome:
   - `RefereeDashboard.tsx` → `RefereeDashboard.css`
   - `RefereeMatches.tsx` → `RefereeMatches.css`

2. Verificar import no TSX:
   ```typescript
   import './RefereeDashboard.css';
   ```

3. Se usar inline styles, verificar sintaxe class vs className

4. Verificar se há conflito com Tailwind:
   - Ionic components podem usar seu próprio CSS
   - Prioridade: IonCard < CSS customizado < Inline style

---

## ❌ ERRO: API devolveu 404

**Problema**: Console mostra `GET /api/users?role=referee 404`

**Solução**:
1. Verificar se backend tem endpoint:
   ```javascript
   app.get('/api/users', (req, res) => {
     // Implementar lógica
   });
   ```

2. Verificar VITE_API_URL em `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Verificar se backend está a correr na porta correta

4. Testar endpoint direto:
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
   http://localhost:3000/api/users?role=referee
   ```

---

## ❌ ERRO: Upload falha

**Problema**: Clicar "Enviar Relatório" não funciona

**Solução**:
1. Verificar se ficheiro é PDF válido
2. Verificar se ficheiro é < 5MB
3. Verificar backend tem endpoint:
   ```javascript
   app.post('/api/matches/:id/report', (req, res) => {
     // Implementar multer para ficheiro
   });
   ```

4. Verificar se FormData está correto:
   ```typescript
   const formData = new FormData();
   formData.append('report', selectedFile);
   formData.append('comment', comment);
   ```

---

## ❌ ERRO: Seleção de árbitros não funciona

**Problema**: RefereeCard não responde ao clicar

**Solução**:
1. Verificar se handleSelectReferee está sendo chamado
2. Verificar se selectedMain/Assistant1/etc estão updating
3. Adicionar console.log para debug:
   ```typescript
   const handleSelectReferee = (refereeId: string) => {
     console.log('Selected referee:', refereeId);
     if (activeTab === 'main') {
       setSelectedMain(selectedMain === refereeId ? null : refereeId);
     }
   };
   ```

---

## ❌ ERRO: Progress bar não atualiza

**Problema**: 0/4 fica sempre igual

**Solução**:
1. Verificar se estado está atualizing:
   ```typescript
   const selectionCount = [selectedMain, selectedAssistant1, selectedAssistant2, selectedFourthReferee].filter(Boolean).length;
   ```

2. Verificar se componente re-renderiza:
   - Adicionar chave única
   - Verificar dependências de useEffect

3. Adicionar console.log:
   ```typescript
   console.log('selectionCount:', selectionCount);
   ```

---

## ❌ ERRO: Toast não aparece

**Problema**: Toast de sucesso não visível

**Solução**:
1. Verificar IonToast está no JSX:
   ```typescript
   <IonToast
     isOpen={!!success}
     message={success}
     duration={3000}
     color="success"
   />
   ```

2. Verificar setSuccess está sendo chamado:
   ```typescript
   setSuccess('✅ Presença confirmada!');
   ```

3. Verificar se componente remonta (suspense ou similar)

---

## ⚠️ AVISO: Endpoints Diferentes

Se backend tiver endpoints diferentes do esperado:

**1. RefereeRoute**
```typescript
// Esperado:
GET /api/users?role=referee&status=approved

// Se backend tiver diferente:
Mudar em refereeService.ts:
const response = await axios.get(`${API_URL}/seu-endpoint`, { headers });
```

**2. AssignReferees**
```typescript
// Esperado:
PUT /api/matches/:matchId/referees
Body: { main, assistant1, assistant2, fourthReferee }

// Se backend tiver diferente:
Mudar em matchService.ts:
const response = await axios.put(`${API_URL}/matches/${matchId}/seu-endpoint`, assignment);
```

---

## 🔍 DEBUG AVANÇADO

### Adicionar Logs em Guards

```typescript
// RefereeRoute.tsx
console.log('User:', user);
console.log('Role:', user?.role);
console.log('Referee Status:', (user as any).refereeStatus);
```

### Adicionar Logs em Services

```typescript
// refereeService.ts
export const getApprovedReferees = async (token?: string): Promise<RefereeUser[]> => {
  console.log('Fetching from:', `${API_URL}/users?role=referee&status=approved`);
  console.log('Token:', token);
  try {
    const response = await axios.get(`${API_URL}/users?role=referee&status=approved`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log('Response:', response.data);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Full error:', error);
    throw error;
  }
};
```

### Verificar LocalStorage

```javascript
// Console (F12):
localStorage.getItem('azores_score_token')
localStorage.getItem('azores_score_user')
JSON.parse(localStorage.getItem('azores_score_user'))
```

---

## 🧪 TESTES MANUAIS SIMPLES

### Teste 1: Guard Funciona
```bash
1. Logout
2. Ir para /referee/dashboard
3. Deve redirecionar para /auth
```

### Teste 2: Service Funciona
```javascript
// No console (F12):
import refereeService from '@/services/refereeService';
const token = localStorage.getItem('azores_score_token');
refereeService.getApprovedReferees(token)
  .then(data => console.log('Success:', data))
  .catch(err => console.log('Error:', err));
```

### Teste 3: Component Funciona
```javascript
// No console (F12):
// Se RefereeCard não responde ao clicar,
// adicionar em componente:
const handleClick = () => {
  console.log('Card clicked!');
  onSelect?.();
};
```

---

## 📝 CHECKLIST DE RESOLUÇÃO

- [ ] Verificou console (F12) para erros JavaScript
- [ ] Verificou Network (F12) para erros API
- [ ] Verificou se arquivo existe no caminho correto
- [ ] Verificou imports e paths
- [ ] Recarregou página (CTRL+SHIFT+R)
- [ ] Verificou .env com variáveis corretas
- [ ] Verificou se backend está a correr
- [ ] Verificou se token está em localStorage
- [ ] Verificou se user.role está correto
- [ ] Verificou endpoints com curl/Postman
- [ ] Adicionou console.log para debug
- [ ] Testou em desenvolvedor ferramentas de browser

---

## 📞 SE AINDA NÃO FUNCIONAR

1. **Verificar App.tsx**:
   - Imports corretos?
   - Rotas na ordem correta?
   - RefereeRoute e AdminRoute aplicadas?

2. **Verificar Backend**:
   - Endpoints implementados?
   - CORS configurado?
   - Retorna data no formato esperado?

3. **Verificar Frontend**:
   - .env com VITE_API_URL correto?
   - Services têm lógica correta?
   - Componentes renderizam?

4. **Verificar AuthContext**:
   - user.role setado corretamente?
   - token não nulo?
   - isAuthenticated = true?

---

**Se problema persistir, adicionar mais console.log e enviar screenshot do erro**
