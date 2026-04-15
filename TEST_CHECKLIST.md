# ✅ Quick Test Checklist - Professional Lineup UI

## 🚀 Pre-Test Setup (5 minutes)

- [ ] Backend running: `npm start` in `azores-score-backend/`
- [ ] Frontend running: `npm run dev` in `azores-football-live-main/`
- [ ] Frontend accessible: http://localhost:8080
- [ ] Build successful: `npm run build` shows no errors
- [ ] Team managers created: 10 accounts with `_new@league.com` pattern

---

## 👤 Login Test (1 minute)

**Use:** `manager_angrense_new@league.com` / `temp123`

- [ ] Login page accessible
- [ ] Credentials accepted ✅
- [ ] Redirect to home page
- [ ] User menu shows role (team_manager)

---

## 🎮 Navigation Test (2 minutes)

After login:

- [ ] Tab bar visible at bottom
- [ ] "Minhas Escalações" or "My Matches" tab appears (team managers only)
- [ ] Tab shows team manager's upcoming matches
- [ ] Click on a match → navigates to MatchLineupPage

---

## 🎬 Interface Components Test (5 minutes)

### LineupHeader Component
- [ ] Back button appears and works
- [ ] "✏️ Editar Escalação" label shows
- [ ] Team names display correctly (Angrense vs opponent)
- [ ] Match date/time displays correctly
- [ ] Status badge shows (should be 🟢 Agendado if future match)
- [ ] Header has gradient background
- [ ] Header is responsive on mobile

### MatchPrepPanel Component
- [ ] Panel appears at top of lineup section
- [ ] Shows "FORMAÇÃO: 4-3-3"
- [ ] Shows formation description (e.g., "Atacante com 2 alas")
- [ ] Progress bar shows "0/11" initially
- [ ] Progress bar is orange (incomplete)
- [ ] Match time displays correctly
- [ ] Panel has gradient background (green/emerald)

### FormationSelector
- [ ] Can change formations (4-3-3, 4-4-2, etc.)
- [ ] Players auto-reposition when formation changes
- [ ] Pitch updates visually

### Football Pitch
- [ ] Shows 11 position slots for selected formation
- [ ] Can click on positions to add players
- [ ] Selected players show on pitch

### SquadPanel
- [ ] Shows available players (not yet selected)
- [ ] Lists used to update as players selected
- [ ] Shows player numbers and names

### Buttons Section (After players selected)
- [ ] "✨ Gerar Escalação Sugerida" button visible
- [ ] Auto-generate button has wand icon and gradient
- [ ] Button disabled if < 11 players available

---

## ⚡ Auto-Generate Workflow (3 minutes)

1. Click "✨ Gerar Escalação Sugerida" button
   - [ ] Button shows loading state (spinner)
   - [ ] Button text changes to "A gerar escalação..."
   - [ ] Operation completes within 1 second

2. After generation:
   - [ ] All 11 positions filled on pitch
   - [ ] Players show on pitch with names/numbers
   - [ ] MatchPrepPanel updates to "11/11"
   - [ ] Progress bar fills to 100% (GREEN)
   - [ ] Progress bar color changes to green
   - [ ] Text shows "✅ Escalação completa!"

3. CaptainSelector becomes visible:
   - [ ] "👑 CAPITÃES & VICE-CAPITÃO" section appears
   - [ ] Two dropdowns visible (Captain and Vice-Captain)
   - [ ] Both say "Seleccionar" initially
   - [ ] Can click on Captain dropdown

---

## 👑 Captain Selection Test (3 minutes)

1. Click Captain dropdown
   - [ ] Dropdown opens showing list of 11 players
   - [ ] "Limpar seleção" button appears at top
   - [ ] Can see player numbers, names, positions
   - [ ] Hover effects work

2. Select a captain (e.g., first player)
   - [ ] Dropdown closes
   - [ ] Captain field shows selected player
   - [ ] Display shows: "#7 João Silva" format
   - [ ] Player gets 👑 badge in selected lineup

3. Click Vice-Captain dropdown
   - [ ] Same behavior as captain dropdown
   - [ ] Shows all 11 players again

4. Select vice-captain
   - [ ] Vice-captain field updates
   - [ ] Player gets 🛡️ badge in lineup
   - [ ] Both badges visible in MatchPrepPanel

5. Clear selections
   - [ ] Click "Limpar seleção" in any dropdown
   - [ ] Field reverts to "Seleccionar"
   - [ ] Badge removed from player

---

## 💾 Save Functionality (2 minutes)

1. Review before save:
   - [ ] All 11 players shown on pitch
   - [ ] Progress bar shows green "Escalação completa!"
   - [ ] Captain selected (shows in MatchPrepPanel)
   - [ ] Vice-captain selected (shows in dropdown)

2. Click "Guardar Escalação" button:
   - [ ] Button shows "Guardando..." text
   - [ ] Button is disabled during save
   - [ ] API call completes (check Network tab)
   - [ ] Save includes `captain` and `viceCaptain` fields

3. After save:
   - [ ] Success message appears
   - [ ] Auto-redirect to My Matches after 2 seconds
   - [ ] Can see match no longer shows as "manage" option

---

## 🔄 Manual Selection Workflow (5 minutes)

1. Start fresh (click "Limpar Tudo"):
   - [ ] All players removed from pitch
   - [ ] Progress bar resets to "0/11"
   - [ ] Progress bar color is orange
   - [ ] Captain/Vice-Captain cleared
   - [ ] Formation resets to "4-3-3"

2. Manually add players:
   - [ ] Click first position on pitch
   - [ ] PlayerSelectionModal opens
   - [ ] Shows available players with condition badges
   - [ ] Select a player
   - [ ] Modal closes, player appears on pitch
   - [ ] MatchPrepPanel updates: "1/11"

3. Add more players:
   - [ ] Repeat for all 11 positions
   - [ ] Progress bar updates each time
   - [ ] When reach 5 players: "5/11" display
   - [ ] When reach 10 players: "10/11" display
   - [ ] When reach 11 players:
     - [ ] Progress bar turns green
     - [ ] Shows "✅ Escalação completa!"
     - [ ] CaptainSelector becomes active

---

## 🚫 Edge Cases (3 minutes)

1. **Permission Check**:
   - [ ] Regular users cannot see button/lineup
   - [ ] Non-team members cannot access

2. **Finished Matches**:
   - [ ] If match status is "Finished" → read-only view
   - [ ] Cannot edit if match already played

3. **Formation Mismatch**:
   - [ ] Change formation from 4-3-3 to 3-5-2
   - [ ] Existing players auto-reposition
   - [ ] Progress bar updates for new position count

4. **Clear All**:
   - [ ] Click "↺ Limpar Tudo"
   - [ ] Everything resets (players, captain, vice-captain, formation)
   - [ ] Progress bar back to 0/11

---

## 📱 Mobile Test (3 minutes)

Using Chrome DevTools mobile view or actual mobile:

- [ ] Header is responsive
- [ ] Dropdowns don't overflow screen
- [ ] Buttons are touch-friendly (min 48px)
- [ ] Progress bar displays correctly
- [ ] Formation selector works on mobile
- [ ] Captain selector shows in full-width view
- [ ] Pitch visualization adapts to screen size
- [ ] Save button position doesn't block content

---

## 🔍 Developer Debug (2 minutes)

Open browser console:

```javascript
// Check user data
console.log(user);  // Should show email with manager_

// Check localStorage
localStorage.getItem('auth')

// Check Network tab
// POST /api/team-manager/lineups should include:
// {
//   captain: "playerId",
//   viceCaptain: "playerId",
//   ...
// }
```

- [ ] Network tab shows successful POST
- [ ] Response includes saved `captain` and `viceCaptain`
- [ ] No JavaScript errors in console
- [ ] No TypeScript errors during build

---

## 🧪 Regression Tests (5 minutes)

Verify existing features still work:

- [ ] Admin can manage all lineups
- [ ] Regular users cannot access lineup management
- [ ] Matches page works correctly
- [ ] Team view works correctly
- [ ] Authentication still works
- [ ] No console errors on any page
- [ ] Navigation between tabs works smooth

---

## 📊 Test Matrix

**Test Scenario Summary:**
```
                  Admin    Team Mgr   Regular User
─────────────────────────────────────────────────
View matches     ✅ All    ✅ Own     ✅ All
Manage lineup    ✅ All    ✅ Own     ❌ None
Select captain   ✅ Yes    ✅ Yes     ❌ N/A
Auto-generate    ✅ Yes    ✅ Yes     ❌ N/A
Save lineup      ✅ Yes    ✅ Yes     ❌ N/A
```

---

## 🎯 Success Criteria

**All checkboxes MUST be checked for successful UI release:**

### Must-Have ✅
- [ ] LineupHeader displays correctly
- [ ] MatchPrepPanel shows progress
- [ ] CaptainSelector works for both captain and vice-captain
- [ ] AutoLineupButton fills all positions
- [ ] Save includes captain data
- [ ] Team Managers can access their matches only
- [ ] No permission errors on lineup page

### Should-Have ✅
- [ ] Animations smooth on all browsers
- [ ] Mobile responsive on <600px screens
- [ ] All buttons have hover states
- [ ] Loading states show during async operations
- [ ] Success message shows after save

### Nice-to-Have ✅
- [ ] Status badge colors correct for match status
- [ ] Emoji badges work on all devices
- [ ] Gradient backgrounds render smoothly
- [ ] Transitions are performant

---

## 🐛 Issues Found During Testing

If you find issues, document them here:

| Issue | Steps to Reproduce | Expected | Actual | Severity |
|-------|-------------------|----------|--------|----------|
| Example | Click auto-gen on mobile | Fills lineup | Does nothing | High |
| | | | | |
| | | | | |

---

## ✅ Sign-Off

- [ ] All tests passed
- [ ] No critical issues found
- [ ] Ready for production
- [ ] Tested by: _____________
- [ ] Date: _________________
- [ ] Notes:
  ```
  
  
  ```

---

## 📞 Quick Links

- Team Manager Credentials: 10 accounts with `manager_[team]_new@league.com` / `temp123`
- Frontend URL: http://localhost:8080
- Backend API: http://localhost:3000/api
- Component Guide: PROFESSIONAL_UI_GUIDE.md
- Session Summary: PROFESSIONAL_LINEUP_SUMMARY.md
- Before/After: BEFORE_AND_AFTER.md

