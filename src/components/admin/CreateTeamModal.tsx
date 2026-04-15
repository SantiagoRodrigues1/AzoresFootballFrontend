import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { IonButton, IonSpinner } from '@ionic/react';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  onSave?: () => void;
}

interface Competition {
  _id: string;
  name: string;
  season: string;
  status: string;
}

const ISLANDS = [
  'São Miguel',
  'Terceira',
  'Faial',
  'Pico',
  'São Jorge',
  'Graciosa',
  'Flores',
  'Corvo',
];

export function CreateTeamModal({ open, onOpenChange, token, onSave }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    island: 'São Miguel',
    stadium: '',
    foundedYear: new Date().getFullYear(),
    logo: '',
    description: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
  });
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSelectedCompetitionId('');
      const fetchCompetitions = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const response = await fetch(`${API_URL}/competitions`);
          if (!response.ok) {
            throw new Error('Não foi possível carregar campeonatos');
          }

          const data = await response.json();
          setCompetitions(Array.isArray(data) ? data : data.data || []);
        } catch {
          setCompetitions([]);
        }
      };

      fetchCompetitions();
    }
  }, [open]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Nome da equipa é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const endpoint = `${API_URL_LOCAL}/admin/clubs`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          competitionId: selectedCompetitionId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar equipa');
      }

      onOpenChange(false);
      setFormData({
        name: '',
        island: 'São Miguel',
        stadium: '',
        foundedYear: new Date().getFullYear(),
        logo: '',
        description: '',
        colors: {
          primary: '#3b82f6',
          secondary: '#ffffff',
        },
      });
      onSave?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar equipa';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={() => !loading && onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/0">
            <h2 className="text-xl font-bold text-foreground">
              Nova Equipa
            </h2>
            <button
              onClick={() => !loading && onOpenChange(false)}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome da Equipa *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: SC Braga"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Ilha */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ilha
                </label>
                <select
                  value={formData.island}
                  onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                >
                  {ISLANDS.map((island) => (
                    <option key={island} value={island}>
                      {island}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Campeonato
                </label>
                <select
                  value={selectedCompetitionId}
                  onChange={(e) => setSelectedCompetitionId(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                >
                  <option value="">Sem associação inicial</option>
                  {competitions.map((competition) => (
                    <option key={competition._id} value={competition._id}>
                      {competition.name} · {competition.season}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estádio */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Estádio
                </label>
                <input
                  type="text"
                  value={formData.stadium}
                  onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                  placeholder="Ex: Estádio Municipal"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Fundada em */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Fundada em
                </label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value || '0') })}
                  placeholder="YYYY"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Logo (URL ou Emoji)
                </label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://... ou ⚽"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Cor Primária */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cor Primária
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, primary: e.target.value }
                    })}
                    disabled={loading}
                    className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, primary: e.target.value }
                    })}
                    placeholder="#3b82f6"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Cor Secundária */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cor Secundária
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.colors.secondary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, secondary: e.target.value }
                    })}
                    disabled={loading}
                    className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.colors.secondary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, secondary: e.target.value }
                    })}
                    placeholder="#ffffff"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Informações sobre a equipa..."
                  disabled={loading}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-gradient-to-r from-muted/30 to-primary/0">
            <div className="flex gap-3">
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="font-semibold"
              >
                Cancelar
              </IonButton>
              <IonButton
                expand="block"
                onClick={handleSave}
                disabled={loading}
                className="font-semibold"
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" slot="start" />
                    Criando...
                  </>
                ) : (
                  'Criar'
                )}
              </IonButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
