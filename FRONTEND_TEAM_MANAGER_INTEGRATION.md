/**
 * INTEGRATION GUIDE - How to integrate MatchControlPage into your app
 * 
 * This file shows:
 * 1. How to add the route
 * 2. How to structure the app
 * 3. How to navigate to the match control
 */

// ============================================================================
// STEP 1: Add route to App.tsx
// ============================================================================

// In src/App.tsx, add these imports:
import { MatchControlPage } from '@/pages/MatchControlPage';

// In your Routes component, add this route:
<Route path="/match-control/:matchId" element={
  <AppLayout>
    <MatchControlPage />
  </AppLayout>
} />

// ============================================================================
// STEP 2: Update MyMatchCard to link to the new page
// ============================================================================

// In src/components/matches/MyMatchCard.tsx:

const handleOpenMatchControl = () => {
  navigate(`/match-control/${matchId}`);
};

// Replace the old "Gerir Escalação" button with:
<motion.button
  whileHover={{ x: 2 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleOpenMatchControl}
  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3 font-semibold flex items-center justify-center gap-2"
>
  {isLive ? '🎮 Gerir Jogo' : '📋 Gerir Escalação'}
  <ArrowRight className="w-4 h-4" />
</motion.button>

// ============================================================================
// STEP 3: Component Structure
// ============================================================================

/*
MatchControlPage (Main Entry)
  ├─ Edit Mode → MatchLineupPage (existing)
  ├─ View Mode → LineupView (NEW)
  │   └─ Shows saved lineup
  │   └─ Buttons: [Edit] [Start Match]
  └─ Live Mode → LiveMatchManager (NEW + existing live components)
      ├─ ScoreHeader
      ├─ EventTimeline
      ├─ ActionButtons
      ├─ EventModal
      └─ MatchStatusControls

File Structure:
src/
  pages/
    MatchControlPage.tsx (NEW - Main orchestrator)
    MatchLineupPage.tsx (existing - Used for editing)
  components/
    match/
      LineupView.tsx (NEW - Display saved lineup)
      LiveMatchManager.tsx (NEW - Main live manager)
      LineupView.css (NEW)
      LiveMatchManager.css (NEW)
    live/
      ActionButtons.tsx (UPDATED - Better mobile UX)
      ActionButtons.css (UPDATED)
      EventModal.tsx (existing - Use as-is)
      ScoreHeader.tsx (existing - Use as-is)
      EventTimeline.tsx (existing - Use as-is)
      MatchStatusControls.tsx (existing - Use as-is)
*/

// ============================================================================
// STEP 4: Data Flow
// ============================================================================

/*
Phase 1 - Escalação (Before Match)
1. MatchControlPage loads match data
2. Checks if lineup exists:
   - If NO: Show MatchLineupPage (edit mode)
   - If YES: Show LineupView (view mode)
3. Team Manager can:
   - View lineup on pitch
   - Edit it (click [Edit])
   - Start match when ready (click [Iniciar Jogo])

Phase 2 - Live Match (During Game)
3. When match starts (status = "live"):
   - MatchControlPage switches to LiveMatchManager
   - Shows ScoreHeader with live timer
   - Shows EventTimeline of all events
   - Shows ActionButtons: [Golo] [Cartão] [Substituição] [Tempo+]
4. Team Manager can:
   - Click [Golo] → EventModal → Select player → Confirm → Score updates
   - Click [Cartão] → EventModal → Select player & type → Confirm → Timeline updates
   - Click [Substituição] → EventModal → Select in/out → Confirm
   - Click [Tempo+] → Prompt → Add minutes
   - Click [⏸ Intervalo] → Pause game
   - Click [▶️ 2ª Parte] → Resume
   - Click [🏁 Terminar] → Finish game → Standings auto-update
*/

// ============================================================================
// STEP 5: Key Features
// ============================================================================

/*
Mobile-First Design
✓ Large touch buttons (100px min height)
✓ Responsive grid layout
✓ Full-width buttons on small screens
✓ 4-column grid on desktop

Professional UX
✓ Smooth animations (Framer Motion)
✓ Clear visual feedback (loading, success, error)
✓ Real-time score updates
✓ Auto-refresh every 5 seconds
✓ Optimistic UI updates

Football-Specific Features
✓ Visual pitch layout with player positions
✓ Formation selection (4-3-3, 4-4-2, 5-3-2, etc)
✓ Captain & Vice-Captain badges
✓ Substitutes bench display
✓ Event timeline with timestamps
✓ Match timer with elapsed time

Fast Event Registration
✓ ≤3 clicks to register any event
✓ Auto-filled minute
✓ Modal-based input
✓ Immediate feedback

Data Persistence
✓ Lineup saved to MongoDB
✓ Auto-loads on page reload
✓ Real-time sync with backend
✓ Transaction support for data consistency
*/

// ============================================================================
// STEP 6: API Integration (via liveMatchService)
// ============================================================================

/*
Backend Endpoints Used:

GET /api/team-manager/matches/:matchId
  → Get match data

GET /api/team-manager/lineups/:matchId/:teamId
  → Get saved lineup (if exists)

POST /api/team-manager/lineups
  → Save/update lineup

POST /api/live-match/:matchId/start
  → Start match (status = "live")

POST /api/live-match/:matchId/event
  → Register event (goal, card, substitution)

POST /api/live-match/:matchId/status
  → Change status (halftime, second_half, finished)

POST /api/live-match/:matchId/finish
  → Finish game + auto-update standings

POST /api/live-match/:matchId/added-time
  → Add extra minutes

GET /api/live-match/:matchId
  → Get full match details with events

All endpoints:
- Require JWT token in Authorization header
- Support only Team Managers of the assigned team
- Return proper error messages
- Have transaction support for consistency
*/

// ============================================================================
// STEP 7: Customization & Styling
// ============================================================================

/*
Colors & Themes

LineupView:
  - Green gradient (football pitch)
  - Blue for players
  - Yellow for selected
  - Red/Orange for captain badges

LiveMatchManager:
  - Dark gradient background (#0f172a → #1e293b)
  - Color-coded buttons:
    - Goal: Green (#10b981)
    - Card: Orange (#f59e0b)
    - Substitution: Purple (#8b5cf6)
    - Time: Blue (#3b82f6)

You can customize by editing:
- LineupView.css
- LiveMatchManager.css
- ActionButtons.css
- ActionButtons.tsx colors variable
*/

// ============================================================================
// STEP 8: Testing Checklist
// ============================================================================

/*
Phase 1 - Lineup View
□ Navigate to /match-control/:matchId
□ See edit form if no lineup exists
□ Edit lineup: select 11 players, set formation, choose captain
□ Save lineup
□ Page shows LineupView with:
  □ Pitch with all 11 players positioned
  □ Substitutes list
  □ Captain/Vice-Captain badges
  □ Summary (11/11 starters, X substitutes)
□ Click [Edit] → Goes back to edit mode
□ Click [Iniciar Jogo] → Shows green loading state

Phase 2 - Live Match
□ After starting, match status changes to "live"
□ Go back to /match-control/:matchId
□ Now shows LiveMatchManager with:
  □ ScoreHeader: Teams, score, timer, status badge
  □ EventTimeline: Empty (no events yet)
  □ ActionButtons: [⚽] [🟨] [🔄] [⏱️]
  □ MatchStatusControls: [⏸] [▶️]

□ Click [⚽ Golo]:
  □ Modal opens: minute auto-filled, select player, click OK
  □ Score updates (2 → 3)
  □ Timeline shows new goal
  □ Success message: "⚽ Golo registado!"

□ Click [🟨 Cartão]:
  □ Modal opens: select player, choose yellow/red, click OK
  □ Timeline shows new card event

□ Click [🔄 Substituição]:
  □ Modal opens: select player out, player in, click OK
  □ Timeline shows: "Rodolfo sai, João entra"

□ Click [⏱️ Tempo+]:
  □ Prompt asks: "Quantos minutos?"
  □ Say "5"
  □ Added time increases

□ Click [⏸ Intervalo]:
  □ Status badge changes to "INTERVALO"
  □ Buttons changes to [▶️] [🔴 Terminar]

□ Click [▶️ 2ª Parte]:
  □ Status badge changes to "2ª PARTE"
  □ Buttons show again: [⚽] [🟨] etc

□ Click [🔴 Terminar]:
  □ Alert asks confirmation
  □ Click "Confirmar"
  □ Game finishes
  □ Status shows "JOGO TERMINADO"
  □ Standings updated (check backend logs)
*/

// ============================================================================
// STEP 9: Troubleshooting
// ============================================================================

/*
Problem: Lineup doesn't load on MatchControlPage
  → Check if GET /api/team-manager/lineups/:matchId/:teamId returns 200
  → Check console for errors
  → Check MongoDB lineups collection

Problem: Can't start match
  → Check if POST /api/live-match/:matchId/start returns 200
  → Check if user has team assigned (assignedTeam field)
  → Check JWT token validity

Problem: Events don't register
  → Check if POST /api/live-match/:matchId/event returns 201
  → Check if minute is valid (0-120)
  → Check if player ID exists

Problem: Score doesn't update
  → Check if event type is "goal"
  → Check backend logs for score calculation
  → Refresh page to see updated score

Problem: Standings don't update
  → Check if match status changed to "finished"
  → Check POST /api/live-match/:matchId/finish response
  → Check MongoDB standings collection
*/

// ============================================================================
// STEP 10: Performance Tips
// ============================================================================

/*
Mobile Performance
✓ Use CSS Grid for layout (not Flexbox for buttons)
✓ Use CSS transforms for animations (GPU acceleration)
✓ Optimize modal rendering (lazy load if needed)
✓ Minimize re-renders with React.memo on child components

Bandwidth Optimization
✓ Auto-refresh every 5 seconds (configurable)
✓ Compress event data
✓ Cache lineup data locally
✓ Use service workers for offline capability

User Experience
✓ Show loading states immediately
✓ Disable buttons during saving
✓ Show success messages (auto-dismiss after 2-3s)
✓ Implement error recovery with retry buttons
✓ Pre-load player data on mount
*/

export {};
