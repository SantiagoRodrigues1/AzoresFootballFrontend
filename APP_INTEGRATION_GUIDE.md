/**
 * APP.TSX INTEGRATION GUIDE
 * 
 * This shows exactly how to add the MatchControlPage route to your app
 * and integrate it with the existing navigation flow.
 */

// ============================================================================
// 1. ADD IMPORTS TO App.tsx
// ============================================================================

// Add these imports at the top of your App.tsx file:

import { MatchControlPage } from '@/pages/MatchControlPage';
import { MatchLineupPage } from '@/pages/MatchLineupPage'; // Should already exist

// ============================================================================
// 2. ADD ROUTE TO YOUR ROUTES
// ============================================================================

// In your <Routes> component, find where you have other team-manager routes
// and add this new route. Example of how it should look:

/**
<Routes>
  {/* ... other routes ... */}
  
  {/* Team Manager Routes - Add this section if doesn't exist */}
  <Route path="/my-matches" element={
    <AppLayout>
      <MyMatchesPage />
    </AppLayout>
  } />
  
  {/* NEW: Match Control (Lineup + Live Match) - ADD THIS */}
  <Route path="/match-control/:matchId" element={
    <AppLayout>
      <MatchControlPage />
    </AppLayout>
  } />
  
  {/* ... rest of routes ... */}
</Routes>
*/

// ============================================================================
// 3. UPDATE NAVIGATION IN MyMatchCard.tsx
// ============================================================================

/**
 * In your src/components/matches/MyMatchCard.tsx file:
 * 
 * Replace the old "Gerir Escalação" button with a new action
 * that navigates to /match-control/:matchId
 */

// Current code (OLD):
/*
const handleEditLineup = () => {
  navigate(`/match-lineup/${matchId}`);
};

return (
  <motion.button
    onClick={handleEditLineup}
    className="btn-primary"
  >
    📋 Gerir Escalação
  </motion.button>
);
*/

// NEW CODE:
/*
import { useNavigate } from 'react-router-dom';

const MyMatchCard = ({ match, matchId }) => {
  const navigate = useNavigate();
  const isLive = ['live', 'halftime', 'second_half'].includes(match?.status);

  const handleOpenMatchControl = () => {
    navigate(`/match-control/${matchId}`);
  };

  return (
    <motion.div className="match-card">
      {/* ... match info ... */}
      
      {/* Action Button - Smart Text Based on Status */}
      <motion.button
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOpenMatchControl}
        className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3 font-semibold flex items-center justify-center gap-2"
      >
        {isLive ? (
          <>
            🎮 Gerir Jogo
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            📋 Gerir Escalação
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};
*/

// ============================================================================
// 4. FILE STRUCTURE - What You Should Have
// ============================================================================

/**
src/
├── pages/
│   ├── MatchLineupPage.tsx (existing - edit mode)
│   └── MatchControlPage.tsx (NEW - main orchestrator)
│
├── components/
│   ├── match/
│   │   ├── LineupView.tsx (NEW)
│   │   ├── LineupView.css (NEW)
│   │   ├── LiveMatchManager.tsx (NEW)
│   │   ├── LiveMatchManager.css (NEW)
│   │
│   ├── live/
│   │   ├── ActionButtons.tsx (UPDATED - rewritten)
│   │   ├── ActionButtons.css (UPDATED - rewritten)
│   │   ├── EventModal.tsx (existing - ENHANCED mobile CSS)
│   │   ├── EventModal.css (UPDATED - mobile optimization)
│   │   ├── MatchStatusControls.tsx (existing)
│   │   ├── MatchStatusControls.css (existing)
│   │   ├── ScoreHeader.tsx (existing)
│   │   ├── ScoreHeader.css (existing)
│   │   ├── EventTimeline.tsx (existing)
│   │   └── EventTimeline.css (existing)
│   │
│   └── matches/
│       ├── MyMatchCard.tsx (UPDATED - add navigation)
│
├── services/
│   ├── liveMatchService.ts (existing - API client)
│
└── types/
    └── (your type definitions)
*/

// ============================================================================
// 5. EXPECTED DATA FLOW
// ============================================================================

/**
User Journey:

1. Team Manager logs in → Sees /team-manager dashboard

2. Clicks on a match in /my-matches
   └─ Button shows "📋 Gerir Escalação" or "🎮 Gerir Jogo"

3. Clicks button → Navigates to /match-control/:matchId
   ├─ MatchControlPage loads
   ├─ Fetches match data from backend
   ├─ Fetches lineup data (if exists)
   ├─ Determines phase based on match state:
   │  ├─ No lineup + match scheduled → Shows MatchLineupPage (EDIT mode)
   │  ├─ Lineup exists + match scheduled → Shows LineupView (VIEW mode)
   │  └─ Match live/halftime/second_half → Shows LiveMatchManager (LIVE mode)

4. EDIT MODE (MatchLineupPage)
   ├─ Uses existing component (you already have this)
   ├─ Team Manager:
   │  ├─ Selects 11 players
   │  ├─ Chooses formation
   │  ├─ Selects captain/vice-captain
   │  └─ Clicks [Guardar Escalação]
   ├─ On save success:
   │  ├─ Lineup data sent to backend
   │  └─ MatchControlPage auto-transitions to VIEW mode

5. VIEW MODE (LineupView)
   ├─ Shows football pitch visualization
   ├─ Displays all 11 players positioned
   ├─ Shows substitutes list
   ├─ Team Manager can:
   │  ├─ Click [📝 Editar] → Back to EDIT mode
   │  └─ Click [▶️ INICIAR JOGO] → Transition to LIVE mode

6. LIVE MODE (LiveMatchManager)
   ├─ Shows ScoreHeader (teams, score, timer)
   ├─ Shows EventTimeline (all events registered)
   ├─ Shows ActionButtons (goal, card, subst, time)
   ├─ Shows MatchStatusControls (halftime, 2nd half, finish)
   ├─ Team Manager can:
   │  ├─ Register goals
   │  ├─ Register cards (yellow/red)
   │  ├─ Register substitutions
   │  ├─ Add extra time
   │  ├─ Pause for halftime
   │  ├─ Resume 2nd half
   │  └─ Finish match (calculates standings)
*/

// ============================================================================
// 6. KEY COMPONENTS - What Each Does
// ============================================================================

/**
MatchControlPage (pages/MatchControlPage.tsx)
├─ Purpose: Main orchestrator, manages phase state
├─ State:
│  ├─ phase: 'edit' | 'view' | 'live'
│  ├─ match: Match data
│  ├─ lineup: Lineup data
│  └─ loading/error states
├─ Logic:
│  ├─ Determines correct phase on mount
│  ├─ Auto-updates phase when match status changes
│  ├─ Handles lineup save transitions
│  └─ Handles match start transitions
└─ Renders:
   ├─ MatchLineupPage when phase='edit'
   ├─ LineupView when phase='view'
   └─ LiveMatchManager when phase='live'

LineupView (components/match/LineupView.tsx)
├─ Purpose: Visual display of saved lineup on pitch
├─ Props:
│  ├─ lineup: Saved lineup with players & positions
│  ├─ onEdit: Click [Edit] button
│  └─ onStartMatch: Click [Start] button
├─ Display:
│  ├─ Football pitch (green gradient)
│  ├─ 11 players positioned by formation
│  ├─ Substitutes grid
│  └─ Summary statistics
└─ Buttons:
   ├─ [📝 Editar]
   └─ [▶️ INICIAR JOGO]

LiveMatchManager (components/match/LiveMatchManager.tsx)
├─ Purpose: Main live match control interface
├─ Props:
│  ├─ matchId: Which match to manage
│  └─ (gets other data from API)
├─ Features:
│  ├─ Auto-fetches match data every 5s
│  ├─ Timer calculation from start time
│  ├─ Event registration handlers
│  ├─ Status change handlers
│  └─ Error/success messages
├─ State:
│  ├─ match: Current match data
│  ├─ elapsedMinutes: Calculated from timer
│  ├─ isSaving: During API calls
│  ├─ error/success: User feedback
│  └─ modal state: Event capture
└─ Renders:
   ├─ ScoreHeader
   ├─ EventTimeline
   ├─ ActionButtons
   └─ MatchStatusControls

ActionButtons (components/live/ActionButtons.tsx) - UPDATED
├─ Purpose: Quick event registration buttons
├─ Props:
│  ├─ onGoal: Goal handler
│  ├─ onCard: Card handler
│  ├─ onSubstitution: Substitution handler
│  ├─ onAddedTime: Extra time handler
│  └─ isLoading: Disable during API calls
├─ Features:
│  ├─ Framer Motion animations
│  ├─ Responsive grid (2x2 mobile, 4x1 desktop)
│  ├─ Touch-optimized sizes
│  ├─ Saving indicator
│  └─ Color-coded buttons
└─ Buttons:
   ├─ [⚽ Golo] - Green
   ├─ [🟨 Cartão] - Orange
   ├─ [🔄 Substituição] - Purple
   └─ [⏱️ Tempo+] - Blue

EventModal (components/live/EventModal.tsx) - ENHANCED
├─ Purpose: Form for capturing event details
├─ Props:
│  ├─ isOpen: Show/hide modal
│  ├─ eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution'
│  ├─ players: List of squad players
│  ├─ onSubmit: Save handler
│  ├─ currentMinute: Auto-fill
│  └─ isLoading: Disable during save
├─ Features:
│  ├─ Mobile-optimized (slides up from bottom)
│  ├─ Auto-fill minute
│  ├─ Player dropdowns
│  ├─ Validation errors
│  └─ Touch-friendly touch targets
└─ Validation:
   ├─ Minute: 0-120
   ├─ Player: Required for goal/card
   ├─ Substitution: In/Out must differ
   └─ Error messages shown in modal

MatchStatusControls (components/live/MatchStatusControls.tsx)
├─ Purpose: Status change buttons
├─ Props:
│  ├─ match: Current match
│  ├─ onStart: Start match
│  ├─ onStatus: Halftime/2nd half
│  ├─ onFinish: Finish match
│  └─ isLoading: Disable during save
├─ Features:
│  ├─ Dynamic buttons based on status
│  ├─ Confirmation for finish
│  └─ Color-coded buttons
└─ Buttons:
   ├─ [🎮 Iniciar] - Scheduled only
   ├─ [⏸️ Intervalo] - Live only
   ├─ [▶️ 2ª Parte] - Halftime only
   └─ [🔴 Terminar] - Live/2nd half

ScoreHeader (components/live/ScoreHeader.tsx)
├─ Purpose: Display match score and timer
├─ Props:
│  ├─ homeTeam/awayTeam: Team info (name, logo)
│  ├─ homeScore/awayScore: Current score
│  ├─ elapsedMinutes: Match timer
│  ├─ matchStatus: Current status
│  └─ addedTime: Extra minutes
├─ Features:
│  ├─ Framer Motion animations
│  ├─ Score bounces on update
│  ├─ Status badge with color
│  ├─ Timer shows "minutes'"
│  └─ Added time shows "+x"
└─ Display:
   ├─ Team 1 vs Team 2
   ├─ Score (large, centered)
   ├─ Timer with status badge
   └─ Added time indicator

EventTimeline (components/live/EventTimeline.tsx)
├─ Purpose: Show all match events
├─ Props:
│  ├─ events: Array of match events
│  └─ elapsedMinutes: Current time
├─ Features:
│  ├─ Chronological order
│  ├─ Icon per event type
│  ├─ Player name and minute
│  ├─ Mobile-optimized layout
│  └─ Scrollable if long
└─ Event Types:
   ├─ ⚽ Goal
   ├─ 🟨 Yellow Card
   ├─ 🟥 Red Card
   └─ 🔄 Substitution
*/

// ============================================================================
// 7. API ENDPOINTS USED
// ============================================================================

/**
GET /api/team-manager/matches/:matchId
  Purpose: Load match data
  Response:
  {
    _id: "match-id",
    homeTeam: { name: "Team A", logo: "..." },
    awayTeam: { name: "Team B", logo: "..." },
    homeScore: 0,
    awayScore: 0,
    status: "scheduled" | "live" | "halftime" | "second_half" | "finished",
    startedAt: "2024-01-15T20:30:00Z",
    events: [...]
  }

GET /api/team-manager/lineups/:matchId/:teamId
  Purpose: Load saved lineup
  Response:
  {
    _id: "lineup-id",
    players: [
      {
        id: "player-1",
        name: "João Silva",
        number: 7,
        position: "forward",
        isCaptain: true,
        isViceCaptain: false
      },
      ...
    ],
    formation: "4-3-3",
    substitutes: [...]
  }

POST /api/team-manager/lineups
  Purpose: Save/update lineup
  Body: { matchId, teamId, players, formation, captain, viceCaptain }
  Response: { _id, ...lineup data }

POST /api/live-match/:matchId/start
  Purpose: Start match (change status to "live")
  Response: { ...match with status: "live", startedAt: timestamp }

POST /api/live-match/:matchId/event
  Purpose: Register event (goal, card, substitution)
  Body:
  {
    type: "goal" | "yellow_card" | "red_card" | "substitution",
    minute: 45,
    playerId?: "...",
    playerInId?: "...",
    playerOutId?: "..."
  }
  Response: { ...match with new event added }

POST /api/live-match/:matchId/status
  Purpose: Change match status
  Body: { status: "halftime" | "second_half" }
  Response: { ...match with new status }

POST /api/live-match/:matchId/finish
  Purpose: Finish match (calc standings)
  Body: { league, season }
  Response: { ...match with status: "finished" }

POST /api/live-match/:matchId/added-time
  Purpose: Add extra minutes
  Body: { minutes: 5 }
  Response: { ...match with addedTime: 5 }
*/

// ============================================================================
// 8. ERROR HANDLING & USER FEEDBACK
// ============================================================================

/**
Error Messages:

Network Errors:
  "Erro ao carregar dados do jogo"         → Can't fetch match/lineup
  "Erro ao guardar escalação"              → POST lineup failed
  "Erro ao iniciar jogo"                   → Can't start match
  "Erro ao adicionar evento"               → Can't register event
  "Erro ao alterar estado do jogo"         → Can't change status
  "Erro ao terminar jogo"                  → Can't finish match
  "Erro ao adicionar tempo"                → Can't add minutes

Validation Errors:
  "Selecione um jogador"                   → No player selected for event
  "Selecione jogador a sair e a entrar"    → Incomplete substitution
  "Não pode ser o mesmo jogador"           → In/Out same for sub
  "Minuto inválido (0-120)"                → Minute out of range
  "Tipo de evento não definido"            → System error

Permission Errors:
  "Não tem permissão para gerir este jogo" → User not team manager
  "Jogo não existe"                        → Invalid match ID

Success Messages:
  "✅ Escalação guardada com sucesso!"     → Lineup saved
  "✅ Jogo iniciado com sucesso!"          → Match started
  "⚽ Golo registado!"                      → Goal added
  "🟨 Cartão registado!"                   → Card added
  "🔄 Substituição registada!"             → Sub added
  "⏱️ 5 minutos adicionais!"               → Time added
  "✅ Jogo terminado com sucesso!"         → Match finished
*/

// ============================================================================
// 9. TESTING INTEGRATION
// ============================================================================

/**
Quick Integration Test:

1. Add route to App.tsx
2. Update MyMatchCard navigation
3. Run frontend: npm run dev (port 8001)
4. Run backend: npm start (port 3000)
5. Login as Team Manager
6. Go to /my-matches
7. Click "📋 Gerir Escalação"
8. Verify:
   □ Page loads (MatchControlPage)
   □ If no lineup: shows MatchLineupPage (edit mode)
   □ Create lineup and save
   □ Page transitions to LineupView
   □ See pitch with players
   □ Click [INICIAR JOGO]
   □ Transitions to LiveMatchManager
   □ See score header, buttons, timeline
   □ Can register events (click buttons → modal → save)
   □ Events appear in timeline
   □ Can finish match

If any step fails:
  - Check browser console for errors
  - Check backend logs for API errors
  - Verify MongoDB data (match/lineup exist)
  - Check network tab in DevTools
*/

export {};
