import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonInput, 
  IonLabel, 
  IonItem,
  IonList,
  IonIcon,
  IonButtons,
  IonSpinner,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { AlertCircle } from 'lucide-react';

interface Team {
  _id: string;
  equipa: string;
  campeonato?: string;
  logo?: string;
  colors?: { primary: string; secondary?: string };
  stadium?: string;
  founded?: number;
  description?: string;
}

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  token: string;
  onSave?: () => void;
}

export function EditTeamModal({ open, onOpenChange, team, token, onSave }: EditTeamModalProps) {
  const [formData, setFormData] = useState<Team>({
    _id: '',
    equipa: '',
    campeonato: '',
    logo: '',
    colors: { primary: '#3b82f6', secondary: '#1e40af' },
    stadium: '',
    founded: new Date().getFullYear(),
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team && open) {
      setFormData({
        _id: team._id,
        equipa: team.equipa,
        campeonato: team.campeonato || '',
        logo: team.logo || '',
        colors: team.colors || { primary: '#3b82f6', secondary: '#1e40af' },
        stadium: team.stadium || '',
        founded: team.founded || new Date().getFullYear(),
        description: team.description || '',
      });
      setError(null);
    }
  }, [team, open]);

  const handleSave = async () => {
    if (!formData.equipa.trim()) {
      setError('Nome da equipa é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const endpoint = `${API_URL_LOCAL}/admin/clubs/${formData._id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.equipa,
          stadium: formData.stadium,
          founded: formData.founded,
          logo: formData.logo,
          primaryColor: formData.colors?.primary || '#3b82f6',
          secondaryColor: formData.colors?.secondary || '#1e40af',
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar equipa');
      }

      onOpenChange(false);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar equipa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={open} onDidDismiss={() => onOpenChange(false)} className="rounded-t-3xl">
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding-top">
          <IonTitle className="font-bold">Editar Equipa</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onOpenChange(false)} disabled={loading}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Nome da Equipa</IonLabel>
            <IonInput
              value={formData.equipa}
              onIonChange={(e) => setFormData({ ...formData, equipa: e.detail.value || '' })}
              placeholder="Ex: SC Braga"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Estádio</IonLabel>
            <IonInput
              value={formData.stadium}
              onIonChange={(e) => setFormData({ ...formData, stadium: e.detail.value || '' })}
              placeholder="Ex: Estádio Municipal"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Fundada em</IonLabel>
            <IonInput
              type="number"
              value={formData.founded}
              onIonChange={(e) => setFormData({ ...formData, founded: parseInt(e.detail.value || '0') })}
              placeholder="YYYY"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Logo (URL)</IonLabel>
            <IonInput
              value={formData.logo}
              onIonChange={(e) => setFormData({ ...formData, logo: e.detail.value || '' })}
              placeholder="https://..."
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Descrição</IonLabel>
            <IonInput
              value={formData.description}
              onIonChange={(e) => setFormData({ ...formData, description: e.detail.value || '' })}
              placeholder="Informações sobre a equipa..."
              disabled={loading}
              className="font-medium"
            />
          </IonItem>
        </IonList>

        <div className="flex gap-2 mt-8 mb-4">
          <IonButton expand="block" fill="outline" onClick={() => onOpenChange(false)} disabled={loading} className="text-base font-semibold">
            Cancelar
          </IonButton>
          <IonButton expand="block" onClick={handleSave} disabled={loading} className="text-base font-semibold">
            {loading ? <><IonSpinner name="crescent" /> Guardando...</> : 'Guardar'}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
