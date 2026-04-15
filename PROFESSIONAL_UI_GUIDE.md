# 🎯 Professional Lineup Management UI Guide

## Overview

The Team Manager lineup management system has been enhanced with professional-grade UI components and features, creating a Flashscore-style experience for managing football team lineups.

## ✨ New Components

### 1. **LineupHeader** (`src/components/lineup/LineupHeader.tsx`)
Professional match header with team information and status badge.

**Features:**
- Back navigation button
- Team names with directional indicators (🏠 Home, ✈️ Away)
- Match date and time
- Live status badge with color coding:
  - 🔵 Agendado (Scheduled)
  - 🟢 Em Direto (Live)
  - 🟠 Intervalo (Halftime)
  - ⚫ Finalizado (Finished)
  - 🔴 Adiado (Postponed)
- Edit mode indicator

**Usage:**
```tsx
<LineupHeader
  homeTeam="Angrense"
  awayTeam="Graciosa FC"
  matchDate="Friday, January 24, 2025"
  matchStatus="scheduled"
  onBack={() => navigate('/my-matches')}
  isEditing={true}
/>
```

---

### 2. **PlayerConditionBadge** (`src/components/lineup/PlayerConditionBadge.tsx`)
Visual player status indicator with emoji badges.

**Status Types:**
- 🟢 Available (Disponível)
- 🟡 Doubtful (Incerto)
- 🔴 Injured (Lesionado)
- ⛔ Suspended (Suspenso)

**Usage:**
```tsx
<PlayerConditionBadge status="available" />
<PlayerConditionBadge status="injured" showLabel={true} />
```

---

### 3. **CaptainSelector** (`src/components/lineup/CaptainSelector.tsx`)
Dual dropdown for selecting captain and vice-captain.

**Features:**
- Select from starting XI only
- 👑 Captain selection
- 🛡️ Vice-captain selection
- Clear individual selections
- Read-only mode when not editing
- Visual confirmation of selections

**Usage:**
```tsx
<CaptainSelector
  players={selectedPlayers.map(p => ({
    id: p.playerId,
    name: p.playerName,
    number: p.playerNumber,
    position: p.position,
  }))}
  currentCaptain={captain}
  currentViceCaptain={viceCaptain}
  onCaptainChange={setCaptain}
  onViceCaptainChange={setViceCaptain}
  isEditing={true}
/>
```

---

### 4. **MatchPrepPanel** (`src/components/lineup/MatchPrepPanel.tsx`)
Summary dashboard showing match preparation status.

**Displays:**
- **Formation Card**: Formation type with description (e.g., "4-3-3 - Atacante com 2 alas")
- **Player Progress**: Circular progress bar showing selected players vs. required
  - Green when complete ✅
  - Orange when incomplete ⚠️
- **Captain Info**: Designated captain display
- **Match Time**: Kickoff time countdown

**Usage:**
```tsx
<MatchPrepPanel
  formation="4-3-3"
  selectedCount={11}
  totalRequired={11}
  captainName="João Silva"
  matchTime="15:30"
/>
```

---

### 5. **AutoLineupButton** (`src/components/lineup/AutoLineupButton.tsx`)
Smart auto-generation button with loading state.

**Features:**
- ✨ Wand icon with gradient background
- Loading animation during generation
- Disabled state when insufficient players
- Success feedback animation

**Usage:**
```tsx
<AutoLineupButton
  onGenerate={handleAutoGenerate}
  isLoading={saving}
  disabled={availablePlayers.length < 11}
/>
```

---

### 6. **PlayerCardWithCondition** (`src/components/lineup/PlayerCardWithCondition.tsx`)
Individual player selection card with condition badges.

**Features:**
- Jersey number display (blue circle)
- Player name and position
- Condition badge (🟢🟡🔴⛔)
- Selection state (green border when selected)
- Captain/Vice-captain badge (👑🛡️)
- Click to toggle selection

**Usage:**
```tsx
<PlayerCardWithCondition
  playerNumber={7}
  playerName="João Silva"
  position="Striker"
  condition="available"
  isSelected={true}
  isCaptain={true}
  onSelect={() => addPlayer()}
  onDeselect={() => removePlayer()}
/>
```

---

## 🎨 UI/UX Improvements

### Color Scheme
- **Success/Active**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Info**: Blue (#3b82f6)
- **Danger**: Red (#ef4444)
- **Prime**: Purple (#7c3aed) for auto-generation

### Visual Indicators
- **Match Status**: Colored badges (scheduled vs. live vs. finished)
- **Player Condition**: Emoji badges for quick recognition
- **Progress**: Visual progress bars with percentage
- **Selection**: Green borders and checkmarks

### Animation Enhancements
- Smooth transitions on formation change
- Loading spinners during API calls
- Button feedback (scale and tap effects)
- Card hover effects

---

## 🔧 Integration with MatchLineupPage

### State Management
```typescript
const [captain, setCaptain] = useState<string | null>(null);
const [viceCaptain, setViceCaptain] = useState<string | null>(null);
```

### New Features in MatchLineupPage
1. **MatchPrepPanel**: Shows real-time progress
2. **CaptainSelector**: Appears after formation is selected
3. **AutoLineupButton**: Replaces simple "Auto" button with enhanced UX
4. **Enhanced Save**: Includes captain and vice-captain data

### Save Request Update
```typescript
{
  matchId: "...",
  teamId: "...",
  formation: "4-3-3",
  startingXI: [...],
  captain: playerId,
  viceCaptain: playerId,
  submittedBy: userId
}
```

---

## 📱 Responsive Design

All components are mobile-optimized:
- Touch-friendly button sizes (min 48px)
- Responsive grid layouts
- Adaptive font sizes
- Full-width modals on small screens
- Fixed footer action buttons on mobile

---

## 🧪 Testing Checklist

### Component Integration Tests
- [ ] LineupHeader displays match info correctly
- [ ] Status badges show correct colors
- [ ] PlayerConditionBadges display emoji correctly
- [ ] CaptainSelector dropdown works on mobile
- [ ] MatchPrepPanel updates in real-time
- [ ] AutoLineupButton generates lineup correctly
- [ ] PlayerCardWithCondition toggles selection

### Feature Tests
- [ ] Team Managers can access "My Matches"
- [ ] Clicking match opens MatchLineupPage
- [ ] Formation can be changed without losing selections
- [ ] Auto-generate fills all positions
- [ ] Captain/Vice-captain can be selected
- [ ] Progress bar updates as players are added
- [ ] Save includes captain data
- [ ] Redirect to My Matches after save

### Permission Tests
- [ ] Admin can access all matches
- [ ] Team Manager can only access own team
- [ ] Regular users cannot access lineup management
- [ ] Read-only mode for finished matches

### Mobile Tests
- [ ] All buttons are touch-friendly
- [ ] Modals are full-screen on mobile
- [ ] Dropdowns don't overflow viewport
- [ ] Progress bars display correctly
- [ ] Navigation works smoothly

---

## 🚀 Quick Start

### For Team Managers

1. **Login**: `manager_angrense_new@league.com` / `temp123`
2. **Navigate**: Click "Minhas Escalações" or "My Matches" tab
3. **Select Match**: Click on your team's upcoming match
4. **Choose Formation**: Select from dropdown
5. **Auto-Generate**: Click ✨ button for quick setup or manually select players
6. **Designate Captain**: Select from dropdown after players are selected
7. **Confirm**: Review players and click "Guardar Escalação"

### For Admins

All matches are accessible:
1. Navigate to "Admin Panel" → "Gerenciar Escalações"
2. Select any match
3. Build lineup for home or away team
4. Save with captain info

---

## 📊 Browser Console Debugging

Enable debug logging:
```javascript
localStorage.setItem('debug:lineup', 'true');
```

Monitor permission checks:
```javascript
// View in Network tab when saving
POST /api/team-manager/lineups
```

Check player data:
```javascript
// View in Console
console.log(selectedPlayers);
console.log(captain, viceCaptain);
```

---

## 🔗 Component Dependencies

```
MatchLineupPage
├── LineupHeader
├── MatchPrepPanel
├── FormationSelector
├── FootballPitch
├── SquadPanel
├── CaptainSelector
├── AutoLineupButton
├── PlayerSelectionModal
└── LineupStatusBanner
```

---

## 📝 Notes

- Components use Ionic for mobile first approach
- Framer Motion for smooth animations
- shadcn/ui for accessible button components
- TailwindCSS for responsive design
- All components are TypeScript with full type safety

---

## 🎯 Future Enhancements

- Player substitutions (subs and bench)
- Tactical notes/comments field
- Formation strategy descriptions
- Historical lineup comparisons
- Player performance stats integration
- Smart lineup suggestions based on player form

