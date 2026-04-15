import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { IonButton, IonSpinner } from '@ionic/react';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface Player {
  id: string;
  nome: string;
  numero: string;
  position?: string;
  email?: string;
  status?: string;
}

interface PlayerModalProps {
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
    position: player?.position ?? '',
    email: player?.email ?? '',
    status: player?.status ?? 'active',
  };
}

export function PlayerModal({ open, onOpenChange, player, teamId, teamCampeonato, teamName, token, isNew, onSave }: PlayerModalProps) {
  const [formData, setFormData] = useState<Player>(buildPlayerFormState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (isNew) {
        setFormData(buildPlayerFormState());
      } else if (player) {
        setFormData(buildPlayerFormState(player));
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
            numero: formData.numero,
            position: formData.position || 'Outro',
            teamId,
            campeonato: teamCampeonato,
            teamName: teamName,
            email: formData.email || '',
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error || 'Erro ao criar jogador');
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
            numero: formData.numero,
            position: formData.position || 'Outro',
            campeonato: teamCampeonato,
            teamName: teamName,
            email: formData.email || '',
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error || 'Erro ao atualizar jogador');
        }
      }

      // ✅ Sucesso! Fechar modal IMEDIATAMENTE
      onOpenChange(false);
      setLoading(false);
      
      // Chamar onSave IMEDIATAMENTE
      onSave?.();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao guardar jogador';
      setError(errorMessage);
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
        <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-primary/5 to-primary/0">
            <h2 className="text-xl font-bold text-foreground">
              {isNew ? 'Novo Jogador' : 'Editar Jogador'}
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
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome ?? ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Número de Camisola *
                </label>
                <input
                  type="number"
                  value={formData.numero ?? ''}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="Ex: 10"
                  disabled={loading}
                  min="1"
                  max="99"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Posição */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Posição
                </label>
                <select
                  value={formData.position ?? ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                >
                  <option value="">Selecionar posição</option>
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email ?? ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="injured">Lesionado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 bg-gradient-to-r from-slate-50/50 to-primary/0">
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
