import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonSpinner,
} from '@ionic/react';
import { add, create, trash, close } from 'ionicons/icons';
import { Loader2, AlertCircle } from 'lucide-react';

interface Referee {
  id: string;
  nome: string;
  email?: string;
  phone?: string;
  license?: string;
  status?: string;
}

interface RefereesManagerProps {
  token: string;
}

export function RefereesManager({ token }: RefereesManagerProps) {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState<Referee>({
    id: '',
    nome: '',
    email: '',
    phone: '',
    license: '',
    status: 'active',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchReferees();
  }, []);

  const fetchReferees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/referees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar árbitros');
      
      const data = await response.json();
      setReferees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar árbitros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (referee?: Referee) => {
    if (referee) {
      setEditingReferee(referee);
      setFormData(referee);
    } else {
      setEditingReferee(null);
      setFormData({
        id: '',
        nome: '',
        email: '',
        phone: '',
        license: '',
        status: 'active',
      });
    }
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const isNew = !editingReferee;
      const endpoint = isNew ? `${API_URL_LOCAL}/admin/referees` : `${API_URL_LOCAL}/admin/referees/${formData.id}`;

      const response = await fetch(endpoint, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          phone: formData.phone,
          license: formData.license,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao guardar árbitro');
      }

      setShowModal(false);
      await fetchReferees();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao guardar árbitro');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setFormLoading(true);

    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/referees/${deleteTarget}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao apagar árbitro');

      setShowDeleteAlert(false);
      setDeleteTarget(null);
      await fetchReferees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao apagar árbitro');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">A carregar árbitros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <IonButton expand="block" onClick={() => handleOpenModal()}>
        <IonIcon icon={add} slot="start" />
        Adicionar Árbitro
      </IonButton>

      {referees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum árbitro registado</p>
        </div>
      ) : (
        <IonList>
          {referees.map((referee) => (
            <IonItem key={referee.id}>
              <IonLabel>
                <h2 className="font-semibold">{referee.nome}</h2>
                <p className="text-sm text-muted-foreground">
                  {referee.email && `${referee.email} • `}
                  {referee.license && `Licença: ${referee.license}`}
                </p>
              </IonLabel>
              <div slot="end" className="flex gap-2">
                <IonButton fill="clear" onClick={() => handleOpenModal(referee)}>
                  <IonIcon icon={create} />
                </IonButton>
                <IonButton 
                  fill="clear" 
                  color="danger"
                  onClick={() => {
                    setDeleteTarget(referee.id);
                    setShowDeleteAlert(true);
                  }}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>
      )}

      {/* Edit/Create Modal */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="rounded-t-3xl">
        <IonHeader className="ion-no-border">
          <IonToolbar className="ion-padding-top">
            <IonTitle className="font-bold">{editingReferee ? 'Editar Árbitro' : 'Novo Árbitro'}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)} disabled={formLoading}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" fullscreen>
          {formError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{formError}</p>
            </div>
          )}

          <IonList inset>
            <IonItem>
              <IonLabel position="stacked" className="font-semibold">Nome</IonLabel>
              <IonInput
                value={formData.nome}
                onIonChange={(e) => setFormData({ ...formData, nome: e.detail.value || '' })}
                placeholder="Nome do árbitro"
                disabled={formLoading}
                className="font-medium"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" className="font-semibold">Email</IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonChange={(e) => setFormData({ ...formData, email: e.detail.value || '' })}
                placeholder="email@example.com"
                disabled={formLoading}
                className="font-medium"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" className="font-semibold">Telefone</IonLabel>
              <IonInput
                type="tel"
                value={formData.phone}
                onIonChange={(e) => setFormData({ ...formData, phone: e.detail.value || '' })}
                placeholder="912345678"
                disabled={formLoading}
                className="font-medium"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" className="font-semibold">Licença</IonLabel>
              <IonInput
                value={formData.license}
                onIonChange={(e) => setFormData({ ...formData, license: e.detail.value || '' })}
                placeholder="Ex: A1"
                disabled={formLoading}
                className="font-medium"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" className="font-semibold">Status</IonLabel>
              <IonSelect
                value={formData.status}
                onIonChange={(e) => setFormData({ ...formData, status: e.detail.value })}
                disabled={formLoading}
                className="font-medium"
              >
                <IonSelectOption value="active">Ativo</IonSelectOption>
                <IonSelectOption value="inactive">Inativo</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          <div className="flex gap-2 mt-8 mb-4">
            <IonButton expand="block" fill="outline" onClick={() => setShowModal(false)} disabled={formLoading} className="text-base font-semibold">
              Cancelar
            </IonButton>
            <IonButton expand="block" onClick={handleSave} disabled={formLoading} className="text-base font-semibold">
              {formLoading ? <><IonSpinner name="crescent" /> Guardando...</> : 'Guardar'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Delete Confirmation */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => { setShowDeleteAlert(false); setDeleteTarget(null); }}
        header="Confirmar"
        message="Tem a certeza que deseja apagar este árbitro?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Apagar',
            role: 'destructive',
            handler: handleDelete,
          }
        ]}
      />
    </div>
  );
}
