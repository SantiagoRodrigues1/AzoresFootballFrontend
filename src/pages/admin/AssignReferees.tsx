/**
 * AssignReferees.tsx
 * Página ADMIN para selecionar árbitros para um jogo ESPECÍFICO
 * 
 * LÓGICA CRÍTICA:
 * - Obter lista de árbitros aprovados
 * - Permitir seleção visual de 4 árbitros (main, assistant1, assistant2, fourthReferee)
 * - Bloquear guardar se não houver exatamente 4 árbitros
 * - Enviar array de árbitros para backend via PUT
 * 
 * Estado:
 * - selectedMain: ID do árbitro principal
 * - selectedAssistant1: ID do assistente 1
 * - selectedAssistant2: ID do assistente 2
 * - selectedFourthReferee: ID do 4º árbitro
 */

import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLoading,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonAlert,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonBadge,
  IonSpinner
} from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import matchService from '@/services/matchService';
import refereeService from '@/services/refereeService';
import RefereeCard from '@/components/referee/RefereeCard';
import { arrowBack, save, checkmarkCircle } from 'ionicons/icons';
import './AssignReferees.css';

interface Referee {
  id: string;
  name: string;
  email?: string;
  federacao?: string;
  categoria?: string;
  avatar?: string;
}

interface Match {
  id: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  date: string;
  venue: string;
}

type RefereePosition = 'main' | 'assistant1' | 'assistant2' | 'fourthReferee';

/**
 * AssignReferees Component
 * Página para seleção de árbitros para um jogo
 * 
 * Estados de seleção:
 * - selectedMain: ID do árbitro principal
 * - selectedAssistant1: ID do assistente 1
 * - selectedAssistant2: ID do assistente 2
 * - selectedFourthReferee: ID do 4º árbitro
 */
const AssignReferees: React.FC = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<RefereePosition>('main');

  // Estados de seleção (IDs dos árbitros)
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedAssistant1, setSelectedAssistant1] = useState<string | null>(null);
  const [selectedAssistant2, setSelectedAssistant2] = useState<string | null>(null);
  const [selectedFourthReferee, setSelectedFourthReferee] = useState<string | null>(null);

  // Estados de feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Carregar dados iniciais
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!matchId) {
        setError('ID do jogo inválido');
        return;
      }

      // Carregar detalhes do jogo
      const matchData = await matchService.getMatchById(matchId, token || undefined);
      setMatch(matchData);

      // Carregar árbitros aprovados
      const refereesData = await refereeService.getApprovedReferees(token || undefined);
      setReferees(refereesData);

      // Se o jogo já tem árbitros, pré-selecionar
      if (matchData.referees) {
        const refs = matchData.referees as Record<string, any>;
        if (refs.main) {
          setSelectedMain(
            typeof refs.main === 'string' 
              ? refs.main 
              : refs.main.id
          );
        }
        if (refs.assistant1) {
          setSelectedAssistant1(
            typeof refs.assistant1 === 'string' 
              ? refs.assistant1 
              : refs.assistant1.id
          );
        }
        if (refs.assistant2) {
          setSelectedAssistant2(
            typeof refs.assistant2 === 'string' 
              ? refs.assistant2 
              : refs.assistant2.id
          );
        }
        if (refs.fourthReferee) {
          setSelectedFourthReferee(
            typeof refs.fourthReferee === 'string' 
              ? refs.fourthReferee 
              : refs.fourthReferee.id
          );
        }
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle referee selection
  const handleSelectReferee = (refereeId: string) => {
    if (activeTab === 'main') {
      setSelectedMain(selectedMain === refereeId ? null : refereeId);
    } else if (activeTab === 'assistant1') {
      setSelectedAssistant1(selectedAssistant1 === refereeId ? null : refereeId);
    } else if (activeTab === 'assistant2') {
      setSelectedAssistant2(selectedAssistant2 === refereeId ? null : refereeId);
    } else if (activeTab === 'fourthReferee') {
      setSelectedFourthReferee(selectedFourthReferee === refereeId ? null : refereeId);
    }
  };

  // Validar seleção
  const isSelectionValid = selectedMain && selectedAssistant1 && selectedAssistant2 && selectedFourthReferee;
  const selectionCount = [selectedMain, selectedAssistant1, selectedAssistant2, selectedFourthReferee].filter(Boolean).length;
  const selectionProgress = Math.max(0, Math.min(100, (selectionCount / 4) * 100));

  // Confirmar atribuição de árbitros
  const handleSaveAssignment = async () => {
    try {
      if (!matchId) {
        setError('ID do jogo inválido');
        return;
      }

      if (!isSelectionValid) {
        setError('Deve selecionar exatamente 4 árbitros (principal, 2 assistentes e 4º árbitro)');
        return;
      }

      setSaving(true);
      setError(null);

      // Enviar para backend
      const assignment = {
        main: selectedMain!,
        assistant1: selectedAssistant1!,
        assistant2: selectedAssistant2!,
        fourthReferee: selectedFourthReferee!
      };

      const response = await matchService.assignRefereesToMatch(
        matchId,
        assignment,
        token || undefined
      );

      if (response.success || response.data) {
        setSuccess('✅ Árbitros atribuídos com sucesso!');
        setShowConfirmDialog(false);
        
        // Voltar após sucesso
        setTimeout(() => {
          navigate(`/admin/matches`);
        }, 2000);
      } else {
        setError(response.message || 'Erro ao atribuir árbitros');
      }
    } catch (err) {
      console.error('❌ Erro ao guardar atribuição:', err);
      setError('Erro ao guardar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Filtrar árbitros por busca e remover já selecionados
  const filteredReferees = referees.filter(ref => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      ref.name.toLowerCase().includes(query) || 
      ref.email?.toLowerCase().includes(query) ||
      ref.federacao?.toLowerCase().includes(query);

    // Remover árbitro já selecionado noutras posições
    const isAlreadySelected =
      (activeTab !== 'main' && ref.id === selectedMain) ||
      (activeTab !== 'assistant1' && ref.id === selectedAssistant1) ||
      (activeTab !== 'assistant2' && ref.id === selectedAssistant2) ||
      (activeTab !== 'fourthReferee' && ref.id === selectedFourthReferee);

    return matchesSearch && !isAlreadySelected;
  });

  // Obter árbitro selecionado para a aba atual
  const getCurrentSelection = (): string | null => {
    if (activeTab === 'main') return selectedMain;
    if (activeTab === 'assistant1') return selectedAssistant1;
    if (activeTab === 'assistant2') return selectedAssistant2;
    if (activeTab === 'fourthReferee') return selectedFourthReferee;
    return null;
  };

  useEffect(() => {
    loadData();
  }, [matchId, token]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Selecionar Árbitros</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Selecionar Árbitros</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* CONTENT */}
      <IonContent>
        {/* Card: Info do Jogo */}
        {match && (
          <IonCard className="ion-margin">
            <IonCardHeader>
              <IonCardTitle>🎯 Jogo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="match-title">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </p>
              <p className="match-detail">{match.venue}</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* Card: Status de Seleção */}
        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle>📊 Status de Seleção</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" sizeMd="3" className="selection-status">
                  <div className={`status-box ${selectedMain ? 'selected' : 'empty'}`}>
                    <p className="role">🎯 Principal</p>
                    <p className="name">
                      {selectedMain 
                        ? referees.find(r => r.id === selectedMain)?.name 
                        : 'Por escolher'}
                    </p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="3" className="selection-status">
                  <div className={`status-box ${selectedAssistant1 ? 'selected' : 'empty'}`}>
                    <p className="role">⚪ Assistente 1</p>
                    <p className="name">
                      {selectedAssistant1 
                        ? referees.find(r => r.id === selectedAssistant1)?.name 
                        : 'Por escolher'}
                    </p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="3" className="selection-status">
                  <div className={`status-box ${selectedAssistant2 ? 'selected' : 'empty'}`}>
                    <p className="role">⚪ Assistente 2</p>
                    <p className="name">
                      {selectedAssistant2 
                        ? referees.find(r => r.id === selectedAssistant2)?.name 
                        : 'Por escolher'}
                    </p>
                  </div>
                </IonCol>
                <IonCol size="12" sizeMd="3" className="selection-status">
                  <div className={`status-box ${selectedFourthReferee ? 'selected' : 'empty'}`}>
                    <p className="role">🟡 4º Árbitro</p>
                    <p className="name">
                      {selectedFourthReferee 
                        ? referees.find(r => r.id === selectedFourthReferee)?.name 
                        : 'Por escolher'}
                    </p>
                  </div>
                </IonCol>
              </IonRow>
              
              {/* Progress Bar */}
              <IonRow className="ion-margin-top">
                <IonCol size="12">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${selectionProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {selectionCount}/4 árbitros selecionados
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Abas de Seleção */}
        <div className="ion-margin">
          <IonSegment 
            value={activeTab} 
            onIonChange={(e) => setActiveTab(e.detail.value as RefereePosition)}
          >
            <IonSegmentButton value="main">
              <IonBadge color={selectedMain ? 'success' : 'medium'}>
                {selectedMain ? '✓' : '○'}
              </IonBadge>
              <IonTitle size="small">Principal</IonTitle>
            </IonSegmentButton>
            <IonSegmentButton value="assistant1">
              <IonBadge color={selectedAssistant1 ? 'success' : 'medium'}>
                {selectedAssistant1 ? '✓' : '○'}
              </IonBadge>
              <IonTitle size="small">Asst 1</IonTitle>
            </IonSegmentButton>
            <IonSegmentButton value="assistant2">
              <IonBadge color={selectedAssistant2 ? 'success' : 'medium'}>
                {selectedAssistant2 ? '✓' : '○'}
              </IonBadge>
              <IonTitle size="small">Asst 2</IonTitle>
            </IonSegmentButton>
            <IonSegmentButton value="fourthReferee">
              <IonBadge color={selectedFourthReferee ? 'success' : 'medium'}>
                {selectedFourthReferee ? '✓' : '○'}
              </IonBadge>
              <IonTitle size="small">4º Árb.</IonTitle>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Search Bar */}
        <IonSearchbar
          placeholder="Buscar árbitro..."
          value={searchQuery}
          onIonInput={(e) => setSearchQuery(e.detail.value || '')}
          showCancelButton="focus"
          className="ion-margin"
        />

        {/* Lista de Árbitros */}
        <div className="ion-margin">
          {filteredReferees.length > 0 ? (
            <div className="referees-grid">
              {filteredReferees.map((referee) => (
                <RefereeCard
                  key={referee.id}
                  referee={referee}
                  isSelected={referee.id === getCurrentSelection()}
                  onSelect={() => handleSelectReferee(referee.id)}
                  selectionType={activeTab}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">🔍</p>
              <p className="empty-message">
                {searchQuery 
                  ? 'Sem árbitros encontrados' 
                  : 'Nenhum árbitro disponível'}
              </p>
            </div>
          )}
        </div>

        {/* BUTTON: Guardar */}
        <div className="ion-margin ion-margin-bottom">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  color="success"
                  disabled={!isSelectionValid || saving}
                  onClick={() => setShowConfirmDialog(true)}
                >
                  {saving ? (
                    <>
                      <IonSpinner name="crescent" /> Guardando...
                    </>
                  ) : (
                    <>
                      <IonIcon icon={save} slot="start" />
                      Guardar Atribuição
                    </>
                  )}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>

      {/* AlertDialog: Confirmar Atribuição */}
      <IonAlert
        isOpen={showConfirmDialog}
        onDidDismiss={() => setShowConfirmDialog(false)}
        header="Confirmar Atribuição"
        message={`Vai atribuir os seguintes árbitros:\n\n🎯 Principal: ${referees.find(r => r.id === selectedMain)?.name}\n⚪ Assistente 1: ${referees.find(r => r.id === selectedAssistant1)?.name}\n⚪ Assistente 2: ${referees.find(r => r.id === selectedAssistant2)?.name}\n🟡 4º Árbitro: ${referees.find(r => r.id === selectedFourthReferee)?.name}`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Confirmar',
            handler: handleSaveAssignment,
            cssClass: 'alert-button-confirm'
          }
        ]}
      />

      {/* Toast: Sucesso */}
      <IonToast
        isOpen={!!success}
        onDidDismiss={() => setSuccess(null)}
        message={success}
        duration={2000}
        color="success"
      />

      {/* Toast: Erro */}
      <IonToast
        isOpen={!!error}
        onDidDismiss={() => setError(null)}
        message={error}
        duration={3000}
        color="danger"
      />
    </IonPage>
  );
};

export default AssignReferees;
