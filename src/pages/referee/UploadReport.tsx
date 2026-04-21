/**
 * UploadReport.tsx
 * Página para upload de relatório pós-jogo
 * 
 * Permite:
 * - Upload de PDF
 * - Comentário opcional
 * - Envio do relatório
 */

import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonLoading,
  IonAlert
} from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import matchService from '@/services/matchService';
import refereeService from '@/services/refereeService';
import { arrowBack, documentText, checkmarkCircle, cloudUpload } from 'ionicons/icons';
import './UploadReport.css';

interface Match {
  id: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  date: string;
  venue: string;
}

/**
 * UploadReport Component
 * Página para upload de relatório pós-jogo
 */
const UploadReport: React.FC = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Carregar detalhes do jogo
  const loadMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!matchId) {
        setError('ID do jogo inválido');
        return;
      }

      const matchData = await matchService.getMatchById(matchId, token || undefined);
      setMatch(matchData);
    } catch (err) {
      setError('Erro ao carregar detalhes do jogo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      setError('❌ Apenas ficheiros PDF são permitidos');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('❌ O ficheiro é muito grande (máximo 5MB)');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Upload de relatório
  const handleUploadReport = async () => {
    try {
      if (!selectedFile) {
        setError('Selecione um ficheiro PDF');
        return;
      }

      if (!matchId) {
        setError('ID do jogo inválido');
        return;
      }

      setUploading(true);
      setError(null);

      // Criar FormData
      const formData = new FormData();
      formData.append('report', selectedFile);
      if (comment.trim()) {
        formData.append('comment', comment);
      }

      // Upload
      const response = await refereeService.uploadMatchReport(matchId, formData, token || undefined);

      if (response.success) {
        setSuccess('✅ Relatório enviado com sucesso!');
        setSelectedFile(null);
        setComment('');
        setShowConfirmDialog(false);
        
        // Voltar após sucesso
        setTimeout(() => {
          navigate(`/referee/matches/${matchId}`);
        }, 2000);
      } else {
        setError(response.message || 'Erro ao enviar relatório');
      }
    } catch (err) {
      setError('Erro ao fazer upload do relatório. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // Validar antes de enviar
  const isFormValid = selectedFile && !uploading;

  useEffect(() => {
    loadMatch();
  }, [matchId, token]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButton fill="clear" slot="start" onClick={() => navigate(-1)}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Upload de Relatório</IonTitle>
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
          <IonTitle>Upload de Relatório</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* CONTENT */}
      <IonContent>
        {/* CARD: Info do Jogo */}
        {match && (
          <IonCard className="ion-margin">
            <IonCardHeader>
              <IonCardTitle>📄 Relatório para</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="match-info">
                <strong>{match.homeTeam.name}</strong> vs <strong>{match.awayTeam.name}</strong>
              </p>
              <p className="match-venue">{match.venue}</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* CARD: Upload */}
        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle>📎 Selecionar Ficheiro</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="file-upload-container">
              {selectedFile ? (
                <div className="file-selected">
                  <div className="file-icon">
                    <IonIcon icon={documentText} />
                  </div>
                  <div className="file-info">
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <IonButton 
                    fill="clear" 
                    color="medium"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remover
                  </IonButton>
                </div>
              ) : (
                <div className="file-placeholder">
                  <IonIcon icon={cloudUpload} />
                  <p className="placeholder-text">Clique para selecionar um ficheiro PDF</p>
                  <p className="placeholder-hint">Máximo 5MB</p>
                </div>
              )}
              
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              
              {!selectedFile && (
                <IonButton 
                  expand="block" 
                  color="primary"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <IonIcon icon={cloudUpload} slot="start" />
                  Selecionar Ficheiro
                </IonButton>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        {/* CARD: Comentário */}
        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle>💬 Comentário (Opcional)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonTextarea
              placeholder="Adicione comentários adicionais sobre o jogo..."
              value={comment}
              onIonChange={(e) => setComment(e.detail.value || '')}
              rows={5}
            />
            <p className="hint-text">
              Máximo 500 caracteres - {comment.length}/500
            </p>
          </IonCardContent>
        </IonCard>

        {/* BOTÃO: Enviar */}
        <div className="ion-margin ion-margin-bottom">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol size="12" sizeMd="6">
                <IonButton 
                  expand="block" 
                  color="success"
                  disabled={!isFormValid}
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Enviar Relatório
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>

      {/* AlertDialog: Confirmar Envio */}
      <IonAlert
        isOpen={showConfirmDialog}
        onDidDismiss={() => setShowConfirmDialog(false)}
        header="Confirmar Envio"
        message="Tem a certeza que deseja enviar este relatório? Não poderá ser alterado depois."
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Enviar',
            handler: handleUploadReport,
            cssClass: 'alert-button-confirm'
          }
        ]}
      />

      {/* Loading: Uploading */}
      <IonLoading
        isOpen={uploading}
        message="Enviando relatório..."
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

export default UploadReport;
