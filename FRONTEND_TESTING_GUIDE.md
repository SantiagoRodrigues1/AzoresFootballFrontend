╔════════════════════════════════════════════════════════════════╗
║   TEAM MANAGER - FRONTEND TESTING GUIDE                       ║
║   Manual Verification Steps                                  ║
╚════════════════════════════════════════════════════════════════╝

OBJETIVO: Validar que o sistema de Team Manager funciona 
corretamente no frontend

═══════════════════════════════════════════════════════════════

TEST 1: LOGIN & AUTHENTICATION
────────────────────────────────

1. Abrir: http://localhost:8081
   Expected: AzoresScore homepage loading

2. Clicar em login ou botão de autenticação
   Expected: Auth page appears

3. Inserir credenciais:
   Email:    manager_santa_clara_b@league.com
   Password: Manager@2025

4. Clicar "Login" ou "Entrar"
   Expected: ✅ Login bem-sucedido, redirecionado para página

═══════════════════════════════════════════════════════════════

TEST 2: "OS MEUS JOGOS" - MATCH LISTING
────────────────────────────────────────

1. Após login bem-sucedido, navegar para "Os Meus Jogos"
   (pode estar em menu lateral ou navbar)

2. Verificar que aparecem EXATAMENTE 3 MATCHES:
   ✓ São Roque (Açores) vs Santa Clara B
   ✓ Vitória do Pico vs Santa Clara B
   ✓ [Um terceiro match]

3. Verificar que NÃO aparecem matches de outras equipas

4. Clicar em NENHUM match de equipas diferentes (testar permissões):
   - Procurar match de "Angrense" ou "CD Lajense"
   - Se existisse, NÃO deveria conseguir aceder

═══════════════════════════════════════════════════════════════

TEST 3: LINEUP PAGE - TEAM MANAGER ACCESS
──────────────────────────────────────────

1. Em "Os Meus Jogos", clicar no PRIMEIRO match
   (São Roque vs Santa Clara B)

2. Expected: MatchLineupPage carrega
   - Layout with 2 teams side by side (if exists)
   - Formation display (default: 4-4-2)
   - Player selection area
   - Save button or confirmation

3. Verificar elementos chave:
   ✓ Title shows "São Roque (Açores) vs Santa Clara B"
   ✓ Santa Clara B players appear (ou empty for selection)
   ✓ Formation visual (4-4-2 is default)
   ✓ "Guardar" or "Confirmar" button exists

4. Se houver modal de seleção de jogador:
   - Click em um slot de player
   - Expected: Player selection modal appears
   - Can select from Santa Clara B roster

5. Click "Guardar" (Save)
   - Expected: Mensagem de sucesso ou estado atualizado

═══════════════════════════════════════════════════════════════

TEST 4: PERMISSION CHECK - ACCESS DENIAL
──────────────────────────────────────────

1. Login como: manager_vitoria_do_pico@league.com
   Password: Manager@2025

2. Navegar para "Os Meus Jogos"
   Expected: Ver APENAS 1 match (a do Vitória do Pico)

3. Tentar aceder ao match de Santa Clara B:
   - Se URL permite navegação direta:
     http://localhost:8081/matches/[santa-clara-match-id]
   - Expected: ❌ Access denied or 403 error
   - Should NOT load lineup page

4. Voltar. Clicar no match do Vitória do Pico
   Expected: ✅ Funciona corretamente (pode editar)

═══════════════════════════════════════════════════════════════

TEST 5: ADMIN ACCESS
────────────────────

1. Logout

2. Login como admin:
   Email:    admin@azores-score.com
   Password: Admin@2025

3. If admin has dashboard access:
   Expected: Admin can see all teams' matches

4. Navigate to any team's match (if possible)
   Expected: Admin has full access

═══════════════════════════════════════════════════════════════

TEST 6: MOBILE RESPONSIVENESS (Optional)
─────────────────────────────────────────

After successful desktop testing, test on mobile:

1. Resize browser to mobile size (320px width) or test on phone
   if same network

2. Verify:
   ✓ Layout reflows correctly
   ✓ Buttons clickable (no text overflow)
   ✓ "Os Meus Jogos" list is readable
   ✓ MatchLineupPage works (formations render)
   ✓ Player selector accessible

═══════════════════════════════════════════════════════════════

EXPECTED RESULTS SUMMARY
────────────────────────

✅ Santa Clara B Manager:
   - Logs in: SUCCESS
   - Sees 3 matches: ✓
   - Can edit own lineups: ✓
   - Cannot access other matches: ✓ (403 or denied)

✅ Vitória do Pico Manager:
   - Logs in: SUCCESS
   - Sees 1 match: ✓
   - Can edit own lineup: ✓
   - Cannot access other matches: ✓ (403 or denied)

✅ Other Managers (Angrense, CD Lajense, etc):
   - Logs in: SUCCESS
   - Sees 0 matches (no upcoming matches): ✓
   - Page shows "Sem jogos disponíveis" or similar: ✓

✅ Admin:
   - Logs in: SUCCESS
   - Can see all/any matches: ✓

═══════════════════════════════════════════════════════════════

TROUBLESHOOTING
───────────────

If Login Fails:
  • Verify backend running: node server.js is active on port 3000
  • Verify .env variables set correctly
  • Check browser console (F12) for network errors

If Can't See Matches:
  • Verify backend endpoint: GET http://localhost:3000/api/team-manager/matches
  • Check authorization header: Bearer token included
  • Verify MongoDB has data: run check-matches.js

If Lineup Page Won't Load:
  • Verify MatchLineupPage.tsx exists
  • Check console for component errors
  • Verify match ID is passed correctly

If Mobile Broken:
  • Check Tailwind CSS responsive classes
  • Verify viewport meta tag in index.html
  • Check max-width constraints

═══════════════════════════════════════════════════════════════

Test Credentials Quick Reference
─────────────────────────────────

Team Manager (with matches):
  Email: manager_santa_clara_b@league.com
  Pass:  Manager@2025
  Expected Matches: 3

Team Manager (with 1 match):
  Email: manager_vitoria_do_pico@league.com
  Pass:  Manager@2025
  Expected Matches: 1

Team Manager (no matches):
  Email: manager_angrense@league.com
  Pass:  Manager@2025
  Expected Matches: 0

Admin:
  Email: admin@azores-score.com
  Pass:  Admin@2025
  Access: Full system

═══════════════════════════════════════════════════════════════

NEXT ACTIONS AFTER TESTING
───────────────────────────

If all tests PASS ✅:
  1. Proceed to UI/UX Phase
  2. Add status indicators (Draft/Saved/Confirmed)
  3. Add captain badges (C, VC)
  4. Implement animations
  5. Finalize responsive design

If tests FAIL ⚠️:
  1. Record exact error message
  2. Check VS Code for TypeScript errors
  3. Review browser console (F12) for JavaScript errors
  4. Document the failure and submit to agent

═══════════════════════════════════════════════════════════════

Report: Prepared by GitHub Copilot
Date: 2025-01-21
Status: Ready for Manual Frontend Validation
