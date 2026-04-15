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
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { AlertCircle } from 'lucide-react';

interface Player {
  id: string;
  nome: string;
  numero: string;
  position?: string;
  url?: string;
  email?: string;
  status?: string;
  role?: string;
}

interface EditPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  teamId: string;
  teamCampeonato?: string;
  teamName?: string;
  token: string;
  isNew?: boolean;
  onSave?: () => void;
}

const POSITIONS = [
  'Guarda-redes',
  'Defesa Central',
  'Lateral Esquerdo',
  'Lateral Direito',
  'Médio Defensivo',
  'Médio',
  'Médio Ofensivo',
  'Extremo Esquerdo',
  'Extremo Direito',
  'Avançado',
];

function buildPlayerFormState(player?: Player | null): Player {
  return {
    id: player?.id ?? '',
    nome: player?.nome ?? '',
    numero: player?.numero ?? '',
    position: player?.position ?? 'Médio',
    url: player?.url ?? '',
    email: player?.email ?? '',
    status: player?.status ?? 'active',
    role: player?.role ?? 'player',
  };
}

export function EditPlayerModal({ 
  open, 
  onOpenChange, 
  player, 
  teamId, 
  teamCampeonato,
  teamName,
  token, 
  isNew, 
  onSave 
}: EditPlayerModalProps) {
  const [formData, setFormData] = useState<Player>(buildPlayerFormState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (player && !isNew) {
        setFormData(buildPlayerFormState(player));
      } else {
        setFormData(buildPlayerFormState());
      }
      setError(null);
    }
  }, [open, player, isNew]);

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      setError('Nome do jogador é obrigatório');
      return;
    }
    if (!formData.numero.trim()) {
      setError('Número de camisola é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;

      if (isNew) {
        const endpoint = `${API_URL_LOCAL}/admin/players`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.nome,
            number: parseInt(formData.numero),
            position: formData.position,
            teamId,
            email: formData.email,
            status: formData.status,
            role: formData.role,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao criar jogador');
        }
      } else {
        const endpoint = `${API_URL_LOCAL}/admin/players/${formData.id}`;
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.nome,
            number: parseInt(formData.numero),
            position: formData.position,
            email: formData.email,
            status: formData.status,
            role: formData.role,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao atualizar jogador');
        }
      }

      onOpenChange(false);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar jogador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={open} onDidDismiss={() => onOpenChange(false)} className="rounded-t-3xl">
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding-top">
          <IonTitle className="font-bold">{isNew ? 'Novo Jogador' : 'Editar Jogador'}</IonTitle>
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
            <IonLabel position="stacked" className="font-semibold">Nome</IonLabel>
            <IonInput
              value={formData.nome}
              onIonChange={(e) => setFormData({ ...formData, nome: e.detail.value || '' })}
              placeholder="Nome completo"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Número de Camisola</IonLabel>
            <IonInput
              type="number"
              value={formData.numero}
              onIonChange={(e) => setFormData({ ...formData, numero: e.detail.value || '' })}
              placeholder="1-99"
              min="1"
              max="99"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Posição</IonLabel>
            <IonSelect
              value={formData.position}
              onIonChange={(e) => setFormData({ ...formData, position: e.detail.value || 'Médio' })}
              disabled={loading}
              className="font-medium"
            >
              {POSITIONS.map((pos) => (
                <IonSelectOption key={pos} value={pos}>
                  {pos}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Email</IonLabel>
            <IonInput
              type="email"
              value={formData.email}
              onIonChange={(e) => setFormData({ ...formData, email: e.detail.value || '' })}
              placeholder="email@example.com"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Status</IonLabel>
            <IonSelect
              value={formData.status}
              onIonChange={(e) => setFormData({ ...formData, status: e.detail.value || 'active' })}
              disabled={loading}
              className="font-medium"
            >
              <IonSelectOption value="active">Ativo</IonSelectOption>
              <IonSelectOption value="inactive">Inativo</IonSelectOption>
              <IonSelectOption value="injured">Lesionado</IonSelectOption>
              <IonSelectOption value="suspended">Suspenso</IonSelectOption>
            </IonSelect>
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
