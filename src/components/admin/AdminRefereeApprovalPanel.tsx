/**
 * AdminRefereeApprovalPanel.tsx
 * Painel administrativo para aprovação de árbitros
 */
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonLoading,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonAlert,
  IonModal,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  checkmarkCircle,
  closeCircle,
  download,
  search
} from 'ionicons/icons';
import { api } from '@/services/api';
import './AdminRefereeApprovalPanel.css';

const AdminRefereeApprovalPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [referees, setReferees] = useState<any[]>([]);
  const [selectedReferee, setSelectedReferee] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadPendingReferees();
    loadStats();
  }, []);

  const loadPendingReferees = async () => {
    try {
      const token = localStorage.getItem('azores_score_token');
      const response = await api.get('/admin/referees/approval/pending', { headers: { Authorization: `Bearer ${token}` } });
      setReferees(response.data.referees);
    } catch (_err) {
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('azores_score_token');
      const response = await api.get('/admin/referees/approval/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(response.data);
    } catch (_err) {
    }
  };

  const handleApprove = async (refereeId: string) => {
    try {
      const token = localStorage.getItem('azores_score_token');
      await api.post(`/admin/referees/approval/${refereeId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Remover da lista
      setReferees(referees.filter(r => r._id !== refereeId));
      setShowModal(false);
      alert('Árbitro aprovado com sucesso!');
      loadStats();
    } catch (err) {
      alert('Erro ao aprovar árbitro');
    }
  };

  const handleReject = async (refereeId: string) => {
    if (!rejectionReason.trim()) {
      alert('Digite um motivo para a rejeição');
      return;
    }

    try {
      const token = localStorage.getItem('azores_score_token');
      await api.post(`/admin/referees/approval/${refereeId}/reject`, { motivo: rejectionReason }, { headers: { Authorization: `Bearer ${token}` } });

      setReferees(referees.filter(r => r._id !== refereeId));
      setShowModal(false);
      setRejectionReason('');
      alert('Árbitro rejeitado!');
      loadStats();
    } catch (err) {
      alert('Erro ao rejeitar árbitro');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Aprovação de Árbitros</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* ESTATÍSTICAS */}
        {stats && (
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <p className="stat-label">Pendentes</p>
                    <p className="stat-number pending">{stats.pendingReferees}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <p className="stat-label">Aprovados</p>
                    <p className="stat-number success">{stats.approvedReferees}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <p className="stat-label">Rejeitados</p>
                    <p className="stat-number error">{stats.rejectedReferees}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <p className="stat-label">Total</p>
                    <p className="stat-number">{stats.totalReferees}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* LISTA DE ÁRBITROS PENDENTES */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              📋 Árbitros Pendentes
              <IonBadge color="danger">{referees.length}</IonBadge>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {referees.length > 0 ? (
              <IonList>
                {referees.map((referee, idx) => (
                  <IonItem key={idx} onClick={() => { setSelectedReferee(referee); setShowModal(true); }}>
                    <IonLabel>
                      <p className="referee-name"><strong>{referee.nomeCompleto}</strong></p>
                      <p className="referee-info">
                        {referee.categoria} | {referee.federacao}
                      </p>
                      <p className="referee-info small">
                        Cartão: {referee.numeroCartaoArbitro}
                      </p>
                    </IonLabel>
                    <IonIcon icon={search} slot="end" />
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <p>Nenhum árbitro pendente.</p>
            )}
          </IonCardContent>
        </IonCard>

        {/* MODAL DE DETALHES E APROVAÇÃO */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          {selectedReferee && (
            <IonContent>
              <IonHeader>
                <IonToolbar color="primary">
                  <IonTitle>Detalhes do Árbitro</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowModal(false)}>Fechar</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>

              <div className="modal-content">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{selectedReferee.nomeCompleto}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="detail-item">
                      <span>Cartão:</span>
                      <strong>{selectedReferee.numeroCartaoArbitro}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Categoria:</span>
                      <strong>{selectedReferee.categoria}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Federação:</span>
                      <strong>{selectedReferee.federacao}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Região:</span>
                      <strong>{selectedReferee.regiao}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Experiência:</span>
                      <strong>{selectedReferee.anosExperiencia} anos</strong>
                    </div>
                    <div className="detail-item">
                      <span>Data Submissão:</span>
                      <strong>
                        {new Date(selectedReferee.userId?.dataSubmissaoArbitro).toLocaleDateString('pt-PT')}
                      </strong>
                    </div>
                  </IonCardContent>
                </IonCard>

                {/* DOCUMENTO */}
                {selectedReferee.documentoURL && (
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>📄 Documento</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        expand="block"
                        fill="outline"
                        href={selectedReferee.documentoURL}
                        target="_blank"
                      >
                        <IonIcon icon={download} slot="start" />
                        Descarregar Documento
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* AÇÕES */}
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>✅ Ação</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="rejection-section">
                      <label>Se Rejeitar, Indique o Motivo:</label>
                      <IonTextarea
                        value={rejectionReason}
                        onIonChange={(e) => setRejectionReason(e.detail.value || '')}
                        placeholder="Ex: Documento inválido ou expirado"
                        rows={3}
                      />
                    </div>

                    <div className="action-buttons">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={() => handleApprove(selectedReferee._id)}
                      >
                        <IonIcon icon={checkmarkCircle} slot="start" />
                        Aprovar
                      </IonButton>

                      <IonButton
                        expand="block"
                        color="danger"
                        onClick={() => handleReject(selectedReferee._id)}
                      >
                        <IonIcon icon={closeCircle} slot="start" />
                        Rejeitar
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonContent>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AdminRefereeApprovalPanel;
