import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { IonSpinner } from '@ionic/react';
import { FormationSelector } from '@/components/team-manager/FormationSelector';
import { FootballPitch } from '@/components/team-manager/FootballPitch';
import { PlayerSelectionModal } from '@/components/team-manager/PlayerSelectionModal';
import { SquadPanel } from '@/components/team-manager/SquadPanel';
import { LineupStatusBanner } from '@/components/team-manager/LineupStatusBanner';
import { LineupDisplay } from '@/components/team-manager/LineupDisplay';
import { LineupDisplayFlashscore } from '@/components/team-manager/LineupDisplayFlashscore';
import { DoubleLineupFlashscore } from '@/components/team-manager/DoubleLineupFlashscore';
import { ValidationErrorModal } from '@/components/team-manager/ValidationErrorModal';
import {
  LineupHeader,
  MatchPrepPanel,
  CaptainSelector,
  AutoLineupButton,
} from '@/components/lineup';
import { FormationName, CallUpPlayer, LineupPlayer, PlayerPosition } from '@/types';
import { FORMATIONS } from '@/utils/formations';
import {
  autoPositionPlayers,
  generateAutoLineup,
  checkLineupAccess,
  validateLineup,
} from '@/utils/lineupHelpers';
import { isClubManagerRole } from '@/utils/access';

interface MatchData {
  id: string;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  date: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished' | 'halftime' | 'postponed';
}

interface TeamSquad {
  players: Array<{
    id: string;
    nome: string;
    numero: number;
    position?: string;
  }>;
}

interface MatchLineupPageProps {
  onLineupSaved?: (lineup: any) => void;
}

function normalizePlayerPosition(position?: string | null): PlayerPosition {
  const normalized = (position || '').trim().toLowerCase();

  if (!normalized) {
    return 'midfielder';
  }

  if (normalized.includes('guarda')) {
    return 'goalkeeper';
  }

  if (
    normalized.includes('defesa') ||
    normalized.includes('lateral')
  ) {
    return 'defender';
  }

  if (
    normalized.includes('médio') ||
    normalized.includes('medio')
  ) {
    return 'midfielder';
  }

  if (
    normalized.includes('avanç') ||
    normalized.includes('avanc') ||
    normalized.includes('extremo')
  ) {
    return 'forward';
  }

  if (
    normalized === 'goalkeeper' ||
    normalized === 'defender' ||
    normalized === 'midfielder' ||
    normalized === 'forward'
  ) {
    return normalized;
  }

  return 'midfielder';
}

function normalizeLineupPlayer(player: any): LineupPlayer {
  return {
    ...player,
    position: normalizePlayerPosition(player?.position),
  };
}

function normalizeCallUpPlayer(player: any): CallUpPlayer {
  return {
    playerId: String(player.id || player.playerId || ''),
    playerName: player.nome || player.name || player.playerName || 'Jogador',
    playerNumber: Number.parseInt(String(player.numero || player.number || player.playerNumber || 0), 10) || 0,
    position: normalizePlayerPosition(player.position || player.posicao),
    selected: false,
    isStarter: player.isStarter ?? true,
  };
}

export function MatchLineupPage({ onLineupSaved }: MatchLineupPageProps) {
  const { user, token } = useAuth();
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  // State Management
  const [match, setMatch] = useState<MatchData | null>(null);
  const [squad, setSquad] = useState<TeamSquad | null>(null);
  const [formation, setFormation] = useState<FormationName>('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState<LineupPlayer[]>([]);
  const [callUpPlayers, setCallUpPlayers] = useState<CallUpPlayer[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [viceCaptain, setViceCaptain] = useState<string | null>(null);
  
  // Substitutes management
  const [substitutes, setSubstitutes] = useState<CallUpPlayer[]>([]);
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);
  const [showLineupPreview, setShowLineupPreview] = useState(false);
  const [lineupViewMode, setLineupViewMode] = useState<'field' | 'flashscore' | 'double'>('double');

  // Double lineup view
  const [bothLineups, setBothLineups] = useState<any>(null);
  const [loadingBothLineups, setLoadingBothLineups] = useState(false);

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string>('');
  const [forceSaveIgnoringValidation, setForceSaveIgnoringValidation] = useState(false);
  const [lineupSaved, setLineupSaved] = useState(false);

  // Permission Check - FIXED: Support both admin and team_manager
  const hasLineupAccess = useMemo(() => {
    return checkLineupAccess(
      user?.role,
      user?.assignedTeam,
      match?.homeTeam?.id,
      match?.awayTeam?.id,
      user?.email
    );
  }, [user, match]);

  const isAdmin = user?.role === 'admin';
  const isTeamManager = isClubManagerRole(user?.role);
  
  // Check if all 11 starters are selected
  const has11Starters = selectedPlayers.length === 11;

  // Time Calculations - NO RESTRICTIONS FOR TEAM MANAGERS
  const timeToKickoff = useMemo(() => {
    if (!match) return { hours: 0, minutes: 0, isCallUpOpen: true, isLineupOpen: true };

    // For team managers, always allow editing
    if (isTeamManager) {
      return {
        hours: 0,
        minutes: 0,
        isCallUpOpen: true,
        isLineupOpen: true,
      };
    }

    const kickoff = new Date(match.date).getTime();
    const now = new Date().getTime();
    const diffMs = kickoff - now;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return {
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      isCallUpOpen: true,
      isLineupOpen: true,
    };
  }, [match, isTeamManager]);

  // Auto-position players when squad loads or formation changes
  useEffect(() => {
    if (callUpPlayers.length > 0 && selectedPlayers.length === 0) {
      const autoPositioned = autoPositionPlayers(callUpPlayers, formation);
      setSelectedPlayers(autoPositioned);
    }
  }, [callUpPlayers, formation]);

  // Fetch Match Data
  useEffect(() => {
    if (!matchId || !user || !token) return;

    const fetchMatchData = async () => {
      try {
        setLoading(true);
        // Fetch match data - use team-manager endpoint for team managers, admin for admins
        const endpoint = isAdmin 
          ? `${API_URL}/admin/matches/${matchId}`
          : `${API_URL}/team-manager/matches/${matchId}`;

        const matchRes = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!matchRes.ok) {
          const errorData = await matchRes.json();
          throw new Error(errorData.message || 'Jogo não encontrado');
        }
        
        const matchData = await matchRes.json();
        
        // Ensure match has required fields
        if (!matchData.homeTeam || !matchData.awayTeam) {
          throw new Error('Jogo com dados incompletos (equipas não encontradas)');
        }
        
        setMatch(matchData);

        // Determine which team's squad to fetch
        let teamId = user.assignedTeam;

        // If admin, try to fetch the first team from the match
        if (isAdmin && !teamId) {
          teamId = matchData.homeTeam?.id;
        }

        if (teamId) {
          const squadRes = await fetch(`${API_URL}/players/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (squadRes.ok) {
            const squadData = await squadRes.json();
            const players = squadData.data || squadData.players || [];
            setSquad({ players });

            // Convert squad to call-up players
            const callUpPlayers: CallUpPlayer[] = players.map(
              (p: any) => normalizeCallUpPlayer(p)
            );
            setCallUpPlayers(callUpPlayers);
          } else {
            const errorData = await squadRes.json().catch(() => ({}));
            console.error('Erro ao carregar plantel:', errorData.message || squadRes.status);
            setError('Não foi possível carregar o plantel. Verifique se a equipa tem jogadores registados.');
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar dados do jogo'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId, user, token, isAdmin]);

  // Load saved lineup from database for team manager
  useEffect(() => {
    if (!matchId || !token || !user?.assignedTeam) return;

    const loadSavedLineup = async () => {
      try {
        const response = await fetch(
          `${API_URL}/team-manager/lineups/${matchId}/${user.assignedTeam}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const savedLineup = data.data;
            
            // Restore formation
            if (savedLineup.formation) {
              setFormation(savedLineup.formation);
            }

            // Restore starters (selectedPlayers)
            if (savedLineup.starters && Array.isArray(savedLineup.starters)) {
              setSelectedPlayers(savedLineup.starters.map(normalizeLineupPlayer));
            }

            // Restore substitutes
            if (savedLineup.substitutes && Array.isArray(savedLineup.substitutes)) {
              setSubstitutes(savedLineup.substitutes.map(normalizeCallUpPlayer));
            }

            // Restore captain and vice-captain
            if (savedLineup.captain) {
              setCaptain(savedLineup.captain);
            }
            if (savedLineup.viceCaptain) {
              setViceCaptain(savedLineup.viceCaptain);
            }

            // Show feedback message
            const message = `✅ Escalação anterior carregada (${savedLineup.formation}, ${savedLineup.starters?.length || 0} jogadores)`;
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(null), 4000);
          }
        } else if (response.status !== 404) {
          // Non-critical: lineup may not exist yet
        }
      } catch (_err) {
        // Don't show error to user - this is optional functionality
      }
    };

    loadSavedLineup();
  }, [matchId, user?.assignedTeam, token]);

  // Fetch both lineups for comparison
  useEffect(() => {
    if (!matchId || !token) return;

    const fetchBothLineups = async () => {
      try {
        setLoadingBothLineups(true);
        const response = await fetch(`${API_URL}/team-manager/lineups/match/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setBothLineups(data.data);
        } else if (response.status === 403) {
          // Silently ignore 403 - user may not have permission to see both lineups
        } else {
          // Non-critical: silently ignore unexpected statuses
        }
      } catch (_err) {
      } finally {
        setLoadingBothLineups(false);
      }
    };

    fetchBothLineups();
  }, [matchId, token]);

  // Handle Position Click
  const handlePositionClick = (positionIndex: number) => {
    if (!hasLineupAccess) return;

    const formationData = FORMATIONS[formation];
    const position = formationData.positions[positionIndex];

    setSelectedPositionIndex(positionIndex);
    setShowPlayerModal(true);
  };

  // Handle Player Selection
  const handlePlayerSelect = (player: CallUpPlayer) => {
    if (selectedPositionIndex === null) return;

    const formationData = FORMATIONS[formation];
    const position = formationData.positions[selectedPositionIndex];

    const newPlayer: LineupPlayer = {
      playerId: player.playerId,
      playerName: player.playerName,
      playerNumber: player.playerNumber,
      position: player.position,
      formationPosition: position.label,
      isStarter: true,
      fieldPosition: { x: position.x, y: position.y },
    };

    const newSelected = [...selectedPlayers];
    newSelected[selectedPositionIndex] = newPlayer;
    setSelectedPlayers(newSelected);
    setShowPlayerModal(false);
  };

  // Handle Remove Player
  const handleRemovePlayer = (positionIndex: number) => {
    const newSelected = selectedPlayers.filter((_, i) => i !== positionIndex);
    setSelectedPlayers(newSelected);
  };

  // Handle Formation Change
  const handleFormationChange = (newFormation: FormationName) => {
    setFormation(newFormation);
    // Auto-reposition when formation changes
    const autoPositioned = autoPositionPlayers(callUpPlayers, newFormation);
    setSelectedPlayers(autoPositioned);
  };

  // Handle Auto-generate Lineup
  const handleAutoGenerate = async () => {
    const autoLineup = generateAutoLineup(callUpPlayers, formation);
    setSelectedPlayers(autoLineup);
    // Auto-select first player as captain if available
    if (autoLineup.length > 0) {
      setCaptain(autoLineup[0].playerId);
    }
  };

  // Handle Save Lineup
  const handleSaveLineup = async () => {
    if (!matchId || !user || !token || !hasLineupAccess) return;

    const formationData = FORMATIONS[formation];
    
    // Validate lineup
    const validation = validateLineup(formation, selectedPlayers);
    if (!validation.isValid && !forceSaveIgnoringValidation) {
      setValidationErrorMessage(validation.errors.join('\n'));
      setShowValidationError(true);
      return;
    }

    setSaving(true);
    try {
      // Sanitize player numbers - convert to valid numbers
      const sanitizePlayerNumber = (num: any): number | null => {
        if (num === null || num === undefined) return null;
        const parsed = parseInt(String(num), 10);
        return isNaN(parsed) ? null : parsed;
      };

      const response = await fetch(`${API_URL}/team-manager/lineups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          teamId: user.assignedTeam || match?.homeTeam?.id,
          formation,
          starters: selectedPlayers.map(p => ({
            playerId: p.playerId,
            playerName: p.playerName,
            playerNumber: sanitizePlayerNumber(p.playerNumber),
            position: p.position,
            formationPosition: p.formationPosition
          })),
          substitutes: substitutes.map((s, idx) => ({
            playerId: s.playerId,
            playerName: s.playerName,
            playerNumber: sanitizePlayerNumber(s.playerNumber),
            position: s.position,
            benchNumber: idx + 1
          })),
          captain,
          viceCaptain
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao guardar escalação');
      }

      const data = await response.json();
      
      // Mark lineup as saved
      setLineupSaved(true);
      
      // Show success message for 3 seconds
      const formationLabel = formation || '4-3-3';
      const messageText = `✅ Escalação guardada com sucesso!\n\n📋 Formação: ${formationLabel}\n👥 Jogadores: ${selectedPlayers.length}/11`;
      setSuccessMessage(messageText);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Call parent callback IMMEDIATELY (no delay, no navigate!)
      if (onLineupSaved) {
        onLineupSaved({
          starters: selectedPlayers,
          substitutes,
          formation,
          captain,
          viceCaptain
        });
      }
      // No redirect needed - parent component handles navigation
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar escalação');
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
      setForceSaveIgnoringValidation(false);
    }
  };

  // Handle Continue Save Despite Validation Errors
  const handleContinueSaveDespiteErrors = async () => {
    setShowValidationError(false);
    setForceSaveIgnoringValidation(true);
    // Trigger save again with forceSaveIgnoringValidation = true
    setTimeout(() => {
      handleSaveLineup();
    }, 100);
  };
  
  // Handle Add Substitute
  const handleAddSubstitute = (player: CallUpPlayer) => {
    // Avoid duplicates with starters
    if (selectedPlayers.some(p => p.playerId === player.playerId)) {
      setError('Este jogador já está no 11 inicial');
      return;
    }
    
    // Avoid duplicate suplentes
    if (substitutes.some(p => p.playerId === player.playerId)) {
      setError('Este jogador já é suplente');
      return;
    }
    
    setSubstitutes([...substitutes, player]);
    setShowSubstituteModal(false);
  };
  
  // Handle Remove Substitute
  const handleRemoveSubstitute = (playerId: string) => {
    setSubstitutes(substitutes.filter(p => p.playerId !== playerId));
  };

  // Handle Start Live Management
  const handleStartLiveManagement = () => {
    if (onLineupSaved) {
      // Called from MatchControlPage - pass control to parent
      onLineupSaved({
        starters: selectedPlayers,
        substitutes,
        formation,
        captain,
        viceCaptain
      });
    } else {
      // Direct navigation to live match manager - use correct route
      navigate(`/live-match/${matchId}`);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <IonSpinner name="crescent" color="primary" />
        </motion.div>
      </div>
    );
  }

  // Permission Check - FIXED
  if (!hasLineupAccess) {
    return (
      <div className="app-shell min-h-screen p-4">
        <div className="surface-card mx-auto mt-20 max-w-md rounded-xl p-6 text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">🔒 Acesso Negado</h1>
          <p className="mb-6 text-muted-foreground">
            {isTeamManager
              ? 'Pode apenas gerir escalações da sua equipa.'
              : 'Não tem permissão para gerir esta escalação.'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/my-matches')}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Voltar aos Meus Jogos
          </motion.button>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="app-shell min-h-screen p-4">
        <div className="surface-card mx-auto mt-20 max-w-md rounded-xl p-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-foreground">⚽ Jogo não encontrado</h1>
          <p className="mb-6 text-muted-foreground">Não conseguimos carregar os dados do jogo.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/matches')}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Voltar aos Jogos
          </motion.button>
        </div>
      </div>
    );
  }

  const formationData = FORMATIONS[formation];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-shell min-h-screen p-4 pb-32 md:p-6"
    >
      {/* Header with LineupHeader component */}
      <div className="max-w-6xl mx-auto mb-6">
        <LineupHeader
          homeTeam={match.homeTeam.name}
          awayTeam={match.awayTeam.name}
          matchDate={new Date(match.date).toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          matchStatus={match.status}
          onBack={() => navigate('/my-matches')}
          isEditing={hasLineupAccess && !saving}
        />
      </div>

      {/* Status Banner - Only show for admins, not for team managers */}
      {!isTeamManager && (
        <div className="max-w-6xl mx-auto mb-6">
          <LineupStatusBanner
            status="lineup_pending"
            hoursUntilKickoff={timeToKickoff.hours}
            minutesUntilKickoff={timeToKickoff.minutes}
            matchTime={new Date(match.date).toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
        </div>
      )}

      {/* Error Notification (Toast) - Appears at the top */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md"
        >
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 font-semibold">
            <span className="text-xl">❌</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-lg hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Notification (Toast) - Appears at the top */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md"
        >
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 font-semibold">
            <span className="text-xl">✅</span>
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-lg hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Match Preparation Panel - Simplified for Team Managers */}
        {!isTeamManager ? (
          <MatchPrepPanel
            formation={formation}
            selectedCount={selectedPlayers.length}
            totalRequired={formationData.positions.length}
            captainName={captain ? selectedPlayers.find(p => p.playerId === captain)?.playerName : undefined}
            matchTime={new Date(match.date).toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card rounded-xl border-l-4 border-primary p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">⚽ Gestão de Escalação</h3>
                <p className="mt-1 text-sm text-muted-foreground">Toque em cada posição para seleccionar um jogador</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-primary">{selectedPlayers.length}/{formationData.positions.length}</p>
                <p className="text-xs font-semibold text-muted-foreground">Titulares</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Formation Selector */}
        {!lineupSaved && (
          <FormationSelector
            selectedFormation={formation}
            onFormationChange={handleFormationChange}
            disabled={saving}
          />
        )}

        {/* Football Pitch */}
        {!lineupSaved && (
          <FootballPitch
            formation={formation}
            selectedPlayers={selectedPlayers}
            onPositionClick={handlePositionClick}
            onRemovePlayer={handleRemovePlayer}
            disabled={saving}
          />
        )}

        {/* Squad Panel */}
        {!lineupSaved && (
          <SquadPanel
            starters={selectedPlayers}
            bench={[]}
            available={callUpPlayers.filter(
              (p) => !selectedPlayers.some((sp) => sp.playerId === p.playerId)
            )}
          />
        )}

        {/* Captain Selector - Only when players selected */}
        {!lineupSaved && hasLineupAccess && selectedPlayers.length > 0 && (
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
            isEditing={!saving}
          />
        )}

        {/* Action Buttons - Save and Auto Generate */}
        {!lineupSaved && hasLineupAccess && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-3"
          >
            {/* Auto Lineup Button */}
            <AutoLineupButton
              onGenerate={handleAutoGenerate}
              isLoading={saving}
              disabled={callUpPlayers.length < formationData.positions.length}
            />

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedPlayers([]);
                  setSubstitutes([]);
                  setFormation('4-3-3');
                  setCaptain(null);
                  setViceCaptain(null);
                }}
                disabled={saving}
                className="surface-card-muted flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
                Limpar Tudo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveLineup}
                disabled={
                  saving ||
                  selectedPlayers.length !== formationData.positions.length
                }
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Guardando...' : 'Guardar Escalação'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Substitutes Section - Only visible when 11 starters selected */}
        {!lineupSaved && hasLineupAccess && has11Starters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">🔄 Suplentes ({substitutes.length})</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubstituteModal(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Adicionar Suplente
              </motion.button>
            </div>
            
            {/* Substitutes List */}
            {substitutes.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {substitutes.map((sub, idx) => (
                  <motion.div
                    key={`substitute-${sub.playerId || idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="surface-card flex items-center justify-between rounded-lg border border-blue-200 p-3 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {sub.playerNumber}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{sub.playerName}</p>
                        <p className="text-xs text-muted-foreground">#{sub.playerNumber}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveSubstitute(sub.playerId)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-700 text-center py-4">Nenhum suplente adicionado</p>
            )}
          </motion.div>
        )}

        {/* Lineup Preview - Show complete lineup */}
        {has11Starters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLineupPreview(!showLineupPreview)}
              className="mb-4 flex w-full items-center justify-between rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
            >
              <span>📋 {showLineupPreview ? 'Ocultar' : 'Mostrar'} Pré-visualização da Escalação</span>
              <span>{showLineupPreview ? '▼' : '▶'}</span>
            </motion.button>

            {/* BUTTON: Gerir Jogo Ao Vivo - SIMPLES: SÓ VAI PARA LIVE */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartLiveManagement}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-xl flex items-center justify-center gap-3 mb-4"
            >
              <span className="text-2xl">🎮</span>
              <span>GERIR JOGO AO VIVO DA MINHA EQUIPA</span>
            </motion.button>
            
            {showLineupPreview && (
              <div className="space-y-4">
                {/* View Toggle - Tabs */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="surface-card-muted flex flex-wrap gap-2 rounded-lg p-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLineupViewMode('field')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      lineupViewMode === 'field'
                        ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    ⚽ Campo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLineupViewMode('flashscore')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      lineupViewMode === 'flashscore'
                        ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    📊 Flashscore
                  </motion.button>
                  {bothLineups && bothLineups.length >= 2 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLineupViewMode('double')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        lineupViewMode === 'double'
                          ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg'
                            : 'bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      👥 Confronto
                    </motion.button>
                  )}
                </motion.div>

                {/* Field View */}
                {lineupViewMode === 'field' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <LineupDisplay
                      starters={selectedPlayers}
                      substitutes={substitutes}
                      formation={formation}
                      captain={captain}
                      viceCaptain={viceCaptain}
                    />
                  </motion.div>
                )}

                {/* Flashscore View */}
                {lineupViewMode === 'flashscore' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <LineupDisplayFlashscore
                      starters={selectedPlayers}
                      substitutes={substitutes}
                      formation={formation}
                      captain={captain}
                      viceCaptain={viceCaptain}
                    />
                  </motion.div>
                )}

                {/* Double Lineup View - Both teams */}
                {lineupViewMode === 'double' && bothLineups && bothLineups.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {loadingBothLineups ? (
                      <div className="flex items-center justify-center min-h-96">
                        <IonSpinner name="crescent" />
                      </div>
                    ) : (
                      <DoubleLineupFlashscore
                        homeTeam={{
                          id: bothLineups[0].team?._id,
                          name: bothLineups[0].team?.name || 'Equipa 1',
                          starters: bothLineups[0].starters || [],
                          substitutes: bothLineups[0].substitutes || [],
                          formation: bothLineups[0].formation || '4-3-3',
                          captain: bothLineups[0].captain,
                          viceCaptain: bothLineups[0].viceCaptain,
                        }}
                        awayTeam={{
                          id: bothLineups[1].team?._id,
                          name: bothLineups[1].team?.name || 'Equipa 2',
                          starters: bothLineups[1].starters || [],
                          substitutes: bothLineups[1].substitutes || [],
                          formation: bothLineups[1].formation || '4-3-3',
                          captain: bothLineups[1].captain,
                          viceCaptain: bothLineups[1].viceCaptain,
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* SAVED LINEUP VIEW - Show only when lineup is saved */}
        {lineupSaved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <motion.div
              className="rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center dark:border-green-800 dark:from-green-500/10 dark:to-emerald-500/10"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Escalação Guardada com Sucesso!</h2>
              <p className="text-green-600 mb-4">Formação: <span className="font-bold text-lg">{formation}</span></p>
            </motion.div>

            {/* Starters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-card rounded-xl border-l-4 border-blue-600 p-6"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-4">👥 Titulares ({selectedPlayers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedPlayers.map((player, idx) => (
                  <motion.div
                    key={`starter-${player.playerId}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-500/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {player.playerNumber}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-blue-900 dark:text-blue-200">{player.playerName}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">{player.position}</p>
                    </div>
                    {player.playerId === captain && (
                      <span className="text-lg">⚙️</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Substitutes Section */}
            {substitutes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card rounded-xl border-l-4 border-amber-600 p-6"
              >
                <h3 className="text-xl font-bold text-amber-900 mb-4">🔄 Suplentes ({substitutes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {substitutes.map((player, idx) => (
                    <motion.div
                      key={`sub-${player.playerId}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-500/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                        {player.playerNumber}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-900 dark:text-amber-200">{player.playerName}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-300">{player.position}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons when saved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 md:flex-row md:gap-3"
            >
              {/* Edit Lineup Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLineupSaved(false);
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold text-lg hover:shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Editar 11
              </motion.button>

              {/* Manage Live Match Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartLiveManagement}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-2xl">🎮</span>
                Gerir Jogo ao Vivo
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* SAVED LINEUP VIEW - Show only when lineup is saved */}
      {lineupSaved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Success Banner */}
          <motion.div
            className="rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center dark:border-green-800 dark:from-green-500/10 dark:to-emerald-500/10"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Escalação Guardada com Sucesso!</h2>
            <p className="text-green-600 mb-4">Formação: <span className="font-bold text-lg">{formation}</span></p>
          </motion.div>

          {/* Starters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card rounded-xl border-l-4 border-blue-600 p-6"
          >
            <h3 className="text-xl font-bold text-blue-900 mb-4">👥 Titulares ({selectedPlayers.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedPlayers.map((player, idx) => (
                <motion.div
                  key={`starter-${player.playerId}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {player.playerNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-200">{player.playerName}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">{player.position}</p>
                  </div>
                  {player.playerId === captain && (
                    <span className="text-lg">⚙️</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Substitutes Section */}
          {substitutes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-card rounded-xl border-l-4 border-amber-600 p-6"
            >
              <h3 className="text-xl font-bold text-amber-900 mb-4">🔄 Suplentes ({substitutes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {substitutes.map((player, idx) => (
                  <motion.div
                    key={`sub-${player.playerId}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-500/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                      {player.playerNumber}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-amber-900 dark:text-amber-200">{player.playerName}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-300">{player.position}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons when saved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:gap-3"
          >
            {/* Edit Lineup Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLineupSaved(false);
              }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold text-lg hover:shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-6 h-6" />
              Editar 11
            </motion.button>

            {/* Manage Live Match Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartLiveManagement}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🎮</span>
              Gerir Jogo ao Vivo
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Player Selection Modal */}
      {selectedPositionIndex !== null && (
        <PlayerSelectionModal
          open={showPlayerModal}
          onOpenChange={setShowPlayerModal}
          availablePlayers={callUpPlayers.filter(
            (p) => !selectedPlayers.some((sp) => sp.playerId === p.playerId) &&
                   !substitutes.some((sub) => sub.playerId === p.playerId)
          )}
          requestedPosition={
            FORMATIONS[formation].positions[selectedPositionIndex]
              .positionType as PlayerPosition
          }
          onSelectPlayer={handlePlayerSelect}
        />
      )}
      
      {/* Substitute Selection Modal */}
      {showSubstituteModal && (
        <PlayerSelectionModal
          open={showSubstituteModal}
          onOpenChange={setShowSubstituteModal}
          availablePlayers={callUpPlayers.filter(
            (p) => !selectedPlayers.some((sp) => sp.playerId === p.playerId) &&
                   !substitutes.some((sub) => sub.playerId === p.playerId)
          )}
          requestedPosition="midfielder"
          onSelectPlayer={handleAddSubstitute}
        />
      )}
      
      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationError}
        errorMessage={validationErrorMessage}
        onGoBack={() => setShowValidationError(false)}
        onContinueSave={handleContinueSaveDespiteErrors}
      />
    </motion.div>
  );
}
