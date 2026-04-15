import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { IonButton, IonSpinner } from '@ionic/react';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface Team {
  _id: string;
  equipa: string;
  campeonato?: string;
  logo?: string;
  colors?: { primary: string };
  stadium?: string;
  founded?: number;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface TeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  token: string;
  onSave?: () => void;
}

export function TeamModal({ open, onOpenChange, team, token, onSave }: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    campeonato: 'azores_score',
    stadium: '',
    founded: new Date().getFullYear(),
    logo: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && team) {
      setFormData({
        name: team.equipa,
        campeonato: team.campeonato || 'azores_score',
        stadium: team.stadium || '',
        founded: team.founded || new Date().getFullYear(),
        logo: team.logo || '',
        primaryColor: team.primaryColor || team.colors?.primary || '#3b82f6',
        secondaryColor: team.secondaryColor || '#1e40af',
        description: team.description || '',
      });
      setError(null);
    }
  }, [open, team]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Nome da equipa é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const endpoint = `${API_URL_LOCAL}/admin/clubs/${team?._id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao guardar equipa');
      }

      onOpenChange(false);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar equipa');
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
        <div className="pointer-events-auto flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-transparent p-6">
            <h2 className="text-xl font-bold text-foreground">Editar Equipa</h2>
            <button
              onClick={() => !loading && onOpenChange(false)}
              disabled={loading}
              className="rounded-lg p-2 transition-colors hover:bg-muted disabled:opacity-50"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <p className="text-sm font-medium text-destructive">{error}</p>
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
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                />
              </div>

              {/* Campeonato */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Campeonato
                </label>
                <input
                  type="text"
                  value={formData.campeonato}
                  onChange={(e) => setFormData({ ...formData, campeonato: e.target.value })}
                  placeholder="Ex: azores_score"
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                />
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
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Logo (URL)
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://..."
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                />
              </div>

              {/* Cores */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Cor Primária
                  </label>
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Cor Secundária
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#1e40af"
                    disabled={loading}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
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
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-gradient-to-r from-muted/40 to-transparent p-6">
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
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </IonButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
