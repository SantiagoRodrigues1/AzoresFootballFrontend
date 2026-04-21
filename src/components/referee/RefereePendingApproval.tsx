/**
 * RefereePendingApproval.tsx
 * Página de aprovação pendente para árbitros
 */
import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLoading, IonRefresher, IonRefresherContent } from '@ionic/react';
import { checkmarkCircle, timerOutline, mailOutline, logOut } from 'ionicons/icons';
import { api } from '@/services/api';
import './RefereePendingApproval.css';

const RefereePendingApproval: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refereeData, setRefereeData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('azores_score_token');
      const response = await api.get('/referee/profile', { headers: { Authorization: `Bearer ${token}` } });

      setRefereeData(response.data.refereeProfile);
      setUser(response.data.user);
    } catch (_err) {
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (event: any) => {
    loadData();
    event.detail.complete();
  };

  const handleLogout = () => {
    localStorage.removeItem('azores_score_token');
    localStorage.removeItem('azores_score_user');
    window.location.href = '/auth';
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
        <IonToolbar color="warning">
          <IonTitle>Aprovação Pendente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon="chevron-down"
            pullingText="Puxe para atualizar"
            refreshingSpinner="circles"
            refreshingText="Atualizando..."
          />
        </IonRefresher>

        <div className="pending-container">
          {/* ÍCONE GRANDE */}
          <div className="pending-icon">
            <IonIcon icon={timerOutline} />
          </div>

          {/* MENSAGEM PRINCIPAL */}
          <IonCard className="pending-card">
            <IonCardHeader>
              <IonCardTitle>Sua Conta Está em Verificação</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Obrigado por se registar como árbitro! Seu pedido foi recebido e está
                sendo revisado pelo nosso painel administrativo.
              </p>
              <p className="info-text">
                Você será notificado assim que sua conta for aprovada. Geralmente
                leva 1-2 dias úteis.
              </p>
            </IonCardContent>
          </IonCard>

          {/* DADOS ENVIADOS */}
          <IonCard className="info-card">
            <IonCardHeader>
              <IonCardTitle>Dados Submetidos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="info-item">
                <span className="label">Nome:</span>
                <span className="value">{refereeData?.nomeCompleto}</span>
              </div>
              <div className="info-item">
                <span className="label">Cartão:</span>
                <span className="value">{refereeData?.numeroCartaoArbitro}</span>
              </div>
              <div className="info-item">
                <span className="label">Categoria:</span>
                <span className="value">{refereeData?.categoria}</span>
              </div>
              <div className="info-item">
                <span className="label">Federação:</span>
                <span className="value">{refereeData?.federacao}</span>
              </div>
              <div className="info-item">
                <span className="label">Região:</span>
                <span className="value">{refereeData?.regiao}</span>
              </div>
              <div className="info-item">
                <span className="label">Experiência:</span>
                <span className="value">{refereeData?.anosExperiencia} anos</span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* O QUE FAZER */}
          <IonCard className="action-card">
            <IonCardHeader>
              <IonCardTitle>📧 Próximas Etapas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-text">Revisão do seu documento</div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-text">Validação dos dados</div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-text">Aprovação e notificação</div>
                </div>
              </div>

              <p className="info-box">
                <IonIcon icon={mailOutline} />
                Receberá um email quando sua conta for aprovada ou se precisarmos
                de mais informações.
              </p>
            </IonCardContent>
          </IonCard>

          {/* BOTÕES DE AÇÃO */}
          <div className="action-buttons">
            <IonButton
              expand="block"
              color="primary"
              onClick={() => handleRefresh({ detail: { complete: () => {} } })}
            >
              <IonIcon icon={checkmarkCircle} slot="start" />
              Verificar Estatuto
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={handleLogout}
            >
              <IonIcon icon={logOut} slot="start" />
              Sair
            </IonButton>
          </div>

          {/* FAQ */}
          <div className="faq-section">
            <h3>❓ Perguntas Frequentes</h3>

            <div className="faq-item">
              <p className="question">Quanto tempo leva a aprovação?</p>
              <p className="answer">Geralmente 1-2 dias úteis.</p>
            </div>

            <div className="faq-item">
              <p className="question">Posso editar meus dados agora?</p>
              <p className="answer">Não, faça login novamente após a aprovação.</p>
            </div>

            <div className="faq-item">
              <p className="question">O que fazer se for rejeitado?</p>
              <p className="answer">Receberá email explicando o motivo.</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RefereePendingApproval;
