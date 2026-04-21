/**
 * RefereeSignupForm.tsx
 * Formulário de registo para árbitros
 */
import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonSelect, IonSelectOption, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonLoading, IonAlert } from '@ionic/react';
import { arrowBack, cloudUpload } from 'ionicons/icons';
import axios from 'axios';
import { API_URL } from '@/services/api';
import './RefereeSignupForm.css';

const RefereeSignupForm: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Dados utilizador, 2: Dados árbitro, 3: Upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nomeCompleto: '',
    dataNascimento: '',
    telefone: '',
    numeroCartaoArbitro: '',
    federacao: 'FAA',
    regiao: 'São Miguel',
    categoria: 'Distrital',
    anosExperiencia: 0,
  });

  const [documento, setDocumento] = useState<File | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Apenas JPG, PNG ou PDF são permitidos');
        return;
      }
      // Validar tamanho
      if (file.size > 5 * 1024 * 1024) {
        setError('Ficheiro muito grande (máximo 5MB)');
        return;
      }
      setDocumento(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validações
      if (step === 1) {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Preencha todos os campos');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords não correspondem');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password deve ter pelo menos 6 caracteres');
          return;
        }
        setStep(2);
      } else if (step === 2) {
        if (!formData.nomeCompleto || !formData.dataNascimento || !formData.telefone) {
          setError('Preencha todos os dados pessoais');
          return;
        }
        if (!formData.numeroCartaoArbitro || !formData.categoria) {
          setError('Preencha todos os dados de arbitragem');
          return;
        }
        setStep(3);
      } else if (step === 3) {
        if (!documento) {
          setError('Envie o cartão de árbitro');
          return;
        }

        // Submeter formulário completo
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, String(value));
        });
        formDataToSend.append('documento', documento);

        const response = await axios.post(
          `${API_URL}/referee/signup`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );

        if (response.data?.token && response.data?.user) {
          localStorage.setItem('azores_score_token', response.data.token);
          localStorage.setItem('azores_score_user', JSON.stringify(response.data.user));
        }
        setSuccess(true);

        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = '/referee/pending-approval';
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton slot="start" fill="clear" onClick={() => setStep(step > 1 ? step - 1 : 0)}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Registo de Árbitro - Passo {step}/3</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="referee-form-container">
          {/* PASSO 1: DADOS DE UTILIZADOR */}
          {step === 1 && (
            <div className="form-section">
              <h2>Dados de Acesso</h2>
              <hr />

              <IonItem>
                <IonLabel position="floating">Nome de Utilizador *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) => handleInputChange('name', e.detail.value)}
                  placeholder="ex: João Silva"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Email *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) => handleInputChange('email', e.detail.value)}
                  placeholder="seu.email@example.com"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Password *</IonLabel>
                <IonInput
                  type="password"
                  value={formData.password}
                  onIonChange={(e) => handleInputChange('password', e.detail.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Confirmar Password *</IonLabel>
                <IonInput
                  type="password"
                  value={formData.confirmPassword}
                  onIonChange={(e) => handleInputChange('confirmPassword', e.detail.value)}
                  placeholder="Confirme a password"
                />
              </IonItem>
            </div>
          )}

          {/* PASSO 2: DADOS DE ÁRBITRO */}
          {step === 2 && (
            <div className="form-section">
              <h2>Dados Pessoais e de Arbitragem</h2>
              <hr />

              <h3>Dados Pessoais</h3>

              <IonItem>
                <IonLabel position="floating">Nome Completo *</IonLabel>
                <IonInput
                  value={formData.nomeCompleto}
                  onIonChange={(e) => handleInputChange('nomeCompleto', e.detail.value)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Data de Nascimento *</IonLabel>
                <IonInput
                  type="date"
                  value={formData.dataNascimento}
                  onIonChange={(e) => handleInputChange('dataNascimento', e.detail.value)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Telefone *</IonLabel>
                <IonInput
                  value={formData.telefone}
                  onIonChange={(e) => handleInputChange('telefone', e.detail.value)}
                  placeholder="912345678"
                />
              </IonItem>

              <h3>Dados de Arbitragem</h3>

              <IonItem>
                <IonLabel position="floating">Número do Cartão *</IonLabel>
                <IonInput
                  value={formData.numeroCartaoArbitro}
                  onIonChange={(e) => handleInputChange('numeroCartaoArbitro', e.detail.value)}
                  placeholder="ARB001/2024"
                />
              </IonItem>

              <IonItem>
                <IonLabel>Federação</IonLabel>
                <IonSelect
                  value={formData.federacao}
                  onIonChange={(e) => handleInputChange('federacao', e.detail.value)}
                >
                  <IonSelectOption value="FAA">FAA - Federação Açoreana</IonSelectOption>
                  <IonSelectOption value="FPF">FPF - Federação Portuguesa</IonSelectOption>
                  <IonSelectOption value="Outra">Outra</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Região</IonLabel>
                <IonSelect
                  value={formData.regiao}
                  onIonChange={(e) => handleInputChange('regiao', e.detail.value)}
                >
                  <IonSelectOption value="São Miguel">São Miguel</IonSelectOption>
                  <IonSelectOption value="Terceira">Terceira</IonSelectOption>
                  <IonSelectOption value="Pico">Pico</IonSelectOption>
                  <IonSelectOption value="São Jorge">São Jorge</IonSelectOption>
                  <IonSelectOption value="Graciosa">Graciosa</IonSelectOption>
                  <IonSelectOption value="Santa Maria">Santa Maria</IonSelectOption>
                  <IonSelectOption value="Flores">Flores</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Categoria *</IonLabel>
                <IonSelect
                  value={formData.categoria}
                  onIonChange={(e) => handleInputChange('categoria', e.detail.value)}
                >
                  <IonSelectOption value="Distrital">Distrital</IonSelectOption>
                  <IonSelectOption value="Nacional">Nacional</IonSelectOption>
                  <IonSelectOption value="Internacional">Internacional</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Anos de Experiência</IonLabel>
                <IonInput
                  type="number"
                  value={formData.anosExperiencia}
                  onIonChange={(e) => handleInputChange('anosExperiencia', parseInt(e.detail.value || '0'))}
                  min="0"
                />
              </IonItem>
            </div>
          )}

          {/* PASSO 3: UPLOAD DE DOCUMENTO */}
          {step === 3 && (
            <div className="form-section">
              <h2>Verificação - Upload de Cartão</h2>
              <hr />

              <div className="upload-area">
                <IonIcon icon={cloudUpload} className="upload-icon" />
                <p>Envie uma imagem ou PDF do seu cartão de árbitro</p>

                <input
                  type="file"
                  id="documento-input"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleDocumentUpload}
                  style={{ display: 'none' }}
                />

                <IonButton
                  expand="block"
                  onClick={() => document.getElementById('documento-input')?.click()}
                >
                  Selecionar Ficheiro
                </IonButton>

                {documento && (
                  <div className="file-selected">
                    <p>✓ {documento.name}</p>
                    <small>{(documento.size / 1024).toFixed(2)} KB</small>
                  </div>
                )}
              </div>

              <div className="info-box">
                <p>
                  Aceitos: JPG, PNG, PDF<br />
                  Tamanho máximo: 5MB
                </p>
              </div>
            </div>
          )}

          {/* ERROS */}
          <IonAlert
            isOpen={!!error}
            onDidDismiss={() => setError(null)}
            header="Erro"
            message={error}
            buttons={['OK']}
          />

          {/* SUCESSO */}
          <IonAlert
            isOpen={success}
            onDidDismiss={() => {}}
            header="Sucesso!"
            message="Registo realizado. Aguarde aprovação..."
            buttons={['OK']}
          />

          {/* LOADING */}
          <IonLoading isOpen={loading} message="Processando..." />
        </div>

        {/* BOTÃO DE SUBMETER */}
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton onClick={handleSubmit} color={step === 3 ? 'success' : 'primary'}>
            {step === 3 ? '✓ Submeter' : 'Próximo →'}
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default RefereeSignupForm;
