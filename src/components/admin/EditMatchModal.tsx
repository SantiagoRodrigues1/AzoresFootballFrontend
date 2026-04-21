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

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  refereeId?: string;
  stadium?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
}

interface Team {
  _id: string;
  equipa: string;
}

interface Referee {
  id: string;
  _id?: string;
  nome: string;
  name?: string;
}

interface RefereeEntry {
  referee: string;
  tipo: string;
}

const REFEREE_TYPES = [
  'Ãrbitro Principal',
  'Assistente 1',
  'Assistente 2',
  '4Âº Ãrbitro',
  'VAR',
  'AVAR',
  'Delegado',
  'Observador',
  'Cronometrista',
  'Outro',
];

interface EditMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match | null;
  token: string;
  onSave?: () => void;
}

export function EditMatchModal({ open, onOpenChange, match, token, onSave }: EditMatchModalProps) {
  const [formData, setFormData] = useState<Match>({
    id: '',
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '15:00',
    stadium: '',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [refereeTeam, setRefereeTeam] = useState<RefereeEntry[]>([
    { referee: '', tipo: 'Ãrbitro Principal' },
    { referee: '', tipo: 'Assistente 1' },
    { referee: '', tipo: 'Assistente 2' },
    { referee: '', tipo: '4Âº Ãrbitro' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchTeamsAndReferees();
      if (match) {
        const [dateStr, timeStr] = match.date.split('T');
        setFormData({
          ...match,
          date: dateStr,
          time: timeStr?.substring(0, 5) || '15:00',
        });
        // Pre-popular refereeTeam se existir no match
        if ((match as any).refereeTeam && Array.isArray((match as any).refereeTeam) && (match as any).refereeTeam.length === 4) {
          setRefereeTeam((match as any).refereeTeam.map((r: any) => ({
            referee: r.referee?._id || r.referee || '',
            tipo: r.tipo || '',
          })));
        }
      }
    }
  }, [open, match]);

  const fetchTeamsAndReferees = async () => {
    try {
      const API_URL_LOCAL = API_URL;
      
      const [teamsRes, refereesRes] = await Promise.all([
        fetch(`${API_URL_LOCAL}/teams`),
        fetch(`${API_URL_LOCAL}/admin/referees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (teamsRes.ok) {
        const data = await teamsRes.json();
        setTeams(data);
      }

      if (refereesRes.ok) {
        const data = await refereesRes.json();
        setReferees(Array.isArray(data) ? data : data.data || []);
      }
    } catch {
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.homeTeamId || !formData.awayTeamId) {
      setError('Ambas as equipas sÃ£o obrigatÃ³rias');
      return;
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      setError('A equipa da casa e a equipa visitante devem ser diferentes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const endpoint = `${API_URL_LOCAL}/admin/matches/${formData.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          homeTeamId: formData.homeTeamId,
          awayTeamId: formData.awayTeamId,
          date: `${formData.date}T${formData.time}:00`,
          refereeTeam: refereeTeam.every(r => r.referee && r.tipo) ? refereeTeam : undefined,
          stadium: formData.stadium,
          homeScore: formData.homeScore,
          awayScore: formData.awayScore,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar jogo');
      }

      onOpenChange(false);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar jogo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={open} onDidDismiss={() => onOpenChange(false)} className="rounded-t-3xl">
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding-top">
          <IonTitle className="font-bold">Editar Jogo</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onOpenChange(false)} disabled={loading}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Equipa da Casa <span className="text-red-500">*</span></IonLabel>
            <IonSelect
              value={formData.homeTeamId}
              onIonChange={(e) => setFormData({ ...formData, homeTeamId: e.detail.value })}
              disabled={loading || teamsLoading}
              placeholder="Selecionar equipa"
              className="font-medium"
            >
              {teams.map((team) => (
                <IonSelectOption key={team._id} value={team._id}>
                  {team.equipa}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Equipa Visitante <span className="text-red-500">*</span></IonLabel>
            <IonSelect
              value={formData.awayTeamId}
              onIonChange={(e) => setFormData({ ...formData, awayTeamId: e.detail.value })}
              disabled={loading || teamsLoading}
              placeholder="Selecionar equipa"
              className="font-medium"
            >
              {teams.map((team) => (
                <IonSelectOption key={team._id} value={team._id}>
                  {team.equipa}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Data <span className="text-red-500">*</span></IonLabel>
            <IonInput
              type="date"
              value={formData.date}
              onIonChange={(e) => setFormData({ ...formData, date: e.detail.value || '' })}
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Hora <span className="text-red-500">*</span></IonLabel>
            <IonInput
              type="time"
              value={formData.time}
              onIonChange={(e) => setFormData({ ...formData, time: e.detail.value || '15:00' })}
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">EstÃ¡dio</IonLabel>
            <IonInput
              value={formData.stadium}
              onIonChange={(e) => setFormData({ ...formData, stadium: e.detail.value || '' })}
              placeholder="Ex: EstÃ¡dio Municipal"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>
        </IonList>

        {/* Equipa de Arbitragem */}
        <div className="mt-4 mb-2 px-1">
          <h3 className="font-bold text-base">Equipa de Arbitragem</h3>
          <p className="text-xs text-gray-500 mt-1">Selecione 4 Ã¡rbitros diferentes com as respetivas funÃ§Ãµes</p>
        </div>
        <IonList inset>
          {refereeTeam.map((entry, idx) => (
            <div key={idx}>
              <IonItem>
                <IonLabel position="stacked" className="font-semibold">FunÃ§Ã£o {idx + 1}</IonLabel>
                <IonSelect
                  value={entry.tipo}
                  onIonChange={(e) => {
                    const updated = [...refereeTeam];
                    updated[idx] = { ...updated[idx], tipo: e.detail.value };
                    setRefereeTeam(updated);
                  }}
                  disabled={loading}
                  className="font-medium"
                >
                  {REFEREE_TYPES.map((t) => (
                    <IonSelectOption key={t} value={t}>{t}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked" className="font-semibold">Ãrbitro {idx + 1}</IonLabel>
                <IonSelect
                  value={entry.referee}
                  onIonChange={(e) => {
                    const updated = [...refereeTeam];
                    updated[idx] = { ...updated[idx], referee: e.detail.value };
                    setRefereeTeam(updated);
                  }}
                  disabled={loading}
                  placeholder="Selecionar Ã¡rbitro"
                  className="font-medium"
                >
                  {referees.map((ref) => (
                    <IonSelectOption key={ref._id || ref.id} value={ref._id || ref.id}>
                      {ref.nome || ref.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </div>
          ))}
        </IonList>

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Status</IonLabel>
            <IonSelect
              value={formData.status}
              onIonChange={(e) => setFormData({ ...formData, status: e.detail.value })}
              disabled={loading}
              className="font-medium"
            >
              <IonSelectOption value="scheduled">Agendado</IonSelectOption>
              <IonSelectOption value="live">Ao Vivo</IonSelectOption>
              <IonSelectOption value="finished">Terminado</IonSelectOption>
              <IonSelectOption value="cancelled">Cancelado</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Golos (Casa)</IonLabel>
            <IonInput
              type="number"
              value={formData.homeScore}
              onIonChange={(e) => setFormData({ ...formData, homeScore: parseInt(e.detail.value || '0') })}
              min="0"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Golos (Visitante)</IonLabel>
            <IonInput
              type="number"
              value={formData.awayScore}
              onIonChange={(e) => setFormData({ ...formData, awayScore: parseInt(e.detail.value || '0') })}
              min="0"
              disabled={loading}
              className="font-medium"
            />
          </IonItem>
        </IonList>

        <div className="flex gap-2 mt-8 mb-4">
          <IonButton expand="block" fill="outline" onClick={() => onOpenChange(false)} disabled={loading} className="text-base font-semibold">
            Cancelar
          </IonButton>
          <IonButton expand="block" onClick={handleSave} disabled={loading || teamsLoading} className="text-base font-semibold">
            {loading ? <><IonSpinner name="crescent" /> Guardando...</> : 'Guardar'}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
