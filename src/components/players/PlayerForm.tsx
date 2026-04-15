import { useState } from 'react';
import { API_URL } from '@/services/api';
import { Plus, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  'Outro'
];

interface Player {
  _id?: string;
  name: string;
  numero: string;
  position: string;
  email?: string;
  photo?: string;
  team?: string;
}

interface PlayerFormProps {
  teamId: string;
  onPlayerAdded: (player: Player) => void;
  onPlayerUpdated?: (player: Player) => void;
  initialPlayer?: Player | null;
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
}

export function PlayerForm({
  teamId,
  onPlayerAdded,
  onPlayerUpdated,
  initialPlayer,
  isOpen,
  onClose,
  isEditMode = false
}: PlayerFormProps) {
  const [formData, setFormData] = useState<Player>(
    initialPlayer || {
      name: '',
      numero: '',
      position: 'Outro',
      email: '',
      photo: ''
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('azores_score_token');

  // Validar formulário
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.numero || isNaN(Number(formData.numero)) || Number(formData.numero) < 1 || Number(formData.numero) > 99) {
      setError('Número de camisola deve estar entre 1 e 99');
      return false;
    }
    return true;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `${API_URL}/players/${initialPlayer?._id}`
        : `${API_URL}/players`;

      const payload = {
        ...formData,
        team: teamId,
        teamId
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar jogador');
      }

      const result = await response.json();
      setSuccess(true);

      // Callback
      if (isEditMode && onPlayerUpdated) {
        onPlayerUpdated(result.data);
      } else {
        onPlayerAdded(result.data);
      }

      // Reset form
      setTimeout(() => {
        setFormData({
          name: '',
          numero: '',
          position: 'Outro',
          email: '',
          photo: ''
        });
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="surface-card max-w-md w-full rounded-xl overflow-hidden">
              {/* Header */}
              <div className="page-hero flex items-center justify-between p-6 text-white">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus size={24} />
                  {isEditMode ? 'Editar Jogador' : 'Adicionar Jogador'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-1 rounded"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Success */}
                {success && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"
                  >
                    <span className="text-lg">✅</span>
                    <span>{isEditMode ? 'Jogador atualizado!' : 'Jogador adicionado!'}</span>
                  </motion.div>
                )}

                {/* Nome */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-foreground">
                    Nome do Jogador *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                    className="surface-input w-full rounded-lg px-4 py-2"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Número de Camisola */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-foreground">
                      Número *
                    </label>
                    <input
                      type="number"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="1-99"
                      min="1"
                      max="99"
                      className="surface-input w-full rounded-lg px-4 py-2"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Posição */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-foreground">
                      Posição
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="surface-input w-full rounded-lg px-4 py-2"
                      disabled={loading}
                    >
                      {POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-foreground">
                    Email (Opcional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jogador@example.com"
                    className="surface-input w-full rounded-lg px-4 py-2"
                    disabled={loading}
                  />
                </div>

                {/* Foto URL */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-foreground">
                    URL da Foto (Opcional)
                  </label>
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="surface-input w-full rounded-lg px-4 py-2"
                    disabled={loading}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="surface-card-muted flex-1 rounded-lg px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted/80"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : isEditMode ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
