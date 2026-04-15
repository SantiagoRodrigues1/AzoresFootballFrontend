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

interface Team {
  _id: string;
  equipa: string;
  name?: string;
}

interface Referee {
  _id: string;
  id?: string;
  nome: string;
  name?: string;
}

interface Competition {
  _id: string;
  name: string;
  season: string;
  status: string;
  teams: string[];
}

interface Match {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition?: string;
  referee?: string;
  stadium?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
}

interface CreateMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  onSave?: () => void;
}

export function CreateMatchModal({ open, onOpenChange, token, onSave }: CreateMatchModalProps) {
  const [formData, setFormData] = useState<Match>({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '15:00',
    competition: '',
    stadium: '',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
  });
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchCompetitions();
      fetchTeams();
      fetchReferees();
    }
  }, [open]);

  // Filtrar equipas quando a competição muda
  useEffect(() => {
    if (formData.competition && competitions.length > 0) {
      const selectedCompetition = competitions.find((c) => c._id === formData.competition);
      if (selectedCompetition && selectedCompetition.teams && selectedCompetition.teams.length > 0) {
        // Extrair IDs dos teams (podem ser objetos populados ou strings)
        const teamIds = selectedCompetition.teams.map((t: any) => 
          typeof t === 'string' ? t : t._id
        );
        const filtered = teams.filter((team) => 
          teamIds.includes(team._id)
        );
        setFilteredTeams(filtered);
      } else {
        // Se não há times na competição, mostrar todas
        setFilteredTeams(teams);
      }
    } else {
      setFilteredTeams(teams);
    }
  }, [formData.competition, competitions, teams]);

  const fetchCompetitions = async () => {
    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/competitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCompetitions(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar competições:', err);
      setError('Erro ao carregar competições');
    } finally {
      setCompetitionsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/teams`);
      if (response.ok) {
        const data = await response.json();
        setTeams(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar equipas:', err);
      setError('Erro ao carregar equipas');
    } finally {
      setTeamsLoading(false);
    }
  };

  const fetchReferees = async () => {
    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/referees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setReferees(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar árbitros:', err);
    }
  };

  const handleSave = async () => {
    // Validações
    if (!formData.competition) {
      setError('Campeonato é obrigatório');
      return;
    }

    if (!formData.homeTeam || !formData.awayTeam) {
      setError('Ambas as equipas são obrigatórias');
      return;
    }

    if (formData.homeTeam === formData.awayTeam) {
      setError('A equipa da casa e a equipa visitante devem ser diferentes');
      return;
    }

    if (!formData.date) {
      setError('Data do jogo é obrigatória');
      return;
    }

    if (!formData.time) {
      setError('Hora do jogo é obrigatória');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const endpoint = `${API_URL_LOCAL}/admin/matches`;

      // Combinar data e hora em formato ISO
      const dateTime = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(dateTime.getTime())) {
        throw new Error('Data ou hora inválida');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          homeTeam: formData.homeTeam,
          awayTeam: formData.awayTeam,
          date: dateTime.toISOString(),
          time: formData.time,
          competition: formData.competition,
          referee: formData.referee || null,
          stadium: formData.stadium || '',
          homeScore: 0,
          awayScore: 0,
          status: formData.status || 'scheduled',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao criar jogo: ${response.statusText}`);
      }

      // Limpar formulário
      setFormData({
        homeTeam: '',
        awayTeam: '',
        date: '',
        time: '15:00',
        competition: '',
        stadium: '',
        status: 'scheduled',
      });

      onOpenChange(false);
      onSave?.();
    } catch (err) {
      console.error('Erro ao criar jogo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar jogo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={open} onDidDismiss={() => onOpenChange(false)} className="rounded-t-3xl">
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding-top">
          <IonTitle className="font-bold">Criar Jogo</IonTitle>
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
            <IonLabel position="stacked" className="font-semibold">Campeonato *</IonLabel>
            <IonSelect
              value={formData.competition}
              onIonChange={(e) => setFormData({ ...formData, competition: e.detail.value })}
              disabled={loading || competitionsLoading}
              placeholder="Selecionar campeonato"
              className="font-medium"
            >
              {competitions.map((comp) => (
                <IonSelectOption key={comp._id} value={comp._id}>
                  {comp.name} ({comp.season})
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Equipa da Casa *</IonLabel>
            <IonSelect
              value={formData.homeTeam}
              onIonChange={(e) => setFormData({ ...formData, homeTeam: e.detail.value })}
              disabled={loading || teamsLoading || !formData.competition}
              placeholder={formData.competition ? "Selecionar equipa" : "Escolha campeonato primeiro"}
              className="font-medium"
            >
              {filteredTeams.map((team) => (
                <IonSelectOption key={team._id} value={team._id}>
                  {team.equipa || team.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Equipa Visitante *</IonLabel>
            <IonSelect
              value={formData.awayTeam}
              onIonChange={(e) => setFormData({ ...formData, awayTeam: e.detail.value })}
              disabled={loading || teamsLoading || !formData.competition}
              placeholder={formData.competition ? "Selecionar equipa" : "Escolha campeonato primeiro"}
              className="font-medium"
            >
              {filteredTeams.map((team) => (
                <IonSelectOption key={team._id} value={team._id}>
                  {team.equipa || team.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Data *</IonLabel>
            <IonInput
              type="date"
              value={formData.date}
              onIonChange={(e) => setFormData({ ...formData, date: e.detail.value || '' })}
              disabled={loading}
              className="font-medium"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="font-semibold">Hora *</IonLabel>
            <IonInput
              type="time"
              value={formData.time}
              onIonChange={(e) => setFormData({ ...formData, time: e.detail.value || '15:00' })}
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
            <IonLabel position="stacked" className="font-semibold">Árbitro</IonLabel>
            <IonSelect
              value={formData.referee}
              onIonChange={(e) => setFormData({ ...formData, referee: e.detail.value })}
              disabled={loading}
              placeholder="Opcional"
              className="font-medium"
            >
              {referees.map((ref) => (
                <IonSelectOption key={ref._id || ref.id} value={ref._id || ref.id}>
                  {ref.nome || ref.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

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
        </IonList>

        <div className="flex gap-2 mt-8 mb-4">
          <IonButton expand="block" fill="outline" onClick={() => onOpenChange(false)} disabled={loading} className="text-base font-semibold">
            Cancelar
          </IonButton>
          <IonButton expand="block" onClick={handleSave} disabled={loading || teamsLoading || competitionsLoading || !formData.competition} className="text-base font-semibold">
            {loading ? <><IonSpinner name="crescent" /> Criando...</> : 'Criar Jogo'}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
