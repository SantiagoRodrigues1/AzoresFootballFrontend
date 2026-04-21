import { useState, useEffect } from 'react';
import { API_URL } from '@/services/api';
import { IonButton, IonSpinner, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'team_manager' | 'team_president' | 'admin';
  assignedTeam?: string;
}

interface TeamMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName: string;
  token: string;
  currentMembers: TeamMember[];
  onSave?: () => void;
}

export function TeamMembersModal({
  open,
  onOpenChange,
  teamId,
  teamName,
  token,
  currentMembers,
  onSave,
}: TeamMembersModalProps) {
  const [members, setMembers] = useState<TeamMember[]>(currentMembers);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'team_manager' | 'team_president'>('team_manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMembers(currentMembers);
      setNewMemberEmail('');
      setNewMemberRole('team_manager');
      setError(null);
      setSuccess(null);
    }
  }, [open, currentMembers]);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setError('Email é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole,
          assignedTeam: teamId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar membro');
      }

      const newMember = await response.json();
      setMembers([...members, newMember]);
      setNewMemberEmail('');
      setNewMemberRole('team_manager');
      setSuccess('Membro adicionado com sucesso!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar membro');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL_LOCAL = API_URL;
      const response = await fetch(`${API_URL_LOCAL}/admin/team-members/${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao remover membro');
      }

      setMembers(members.filter((m) => m.id !== memberId));
      setSuccess('Membro removido com sucesso!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover membro');
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white">Membros da Equipa</h2>
            </div>
            <button
              onClick={() => !loading && onOpenChange(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Add New Member */}
            <div className="space-y-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-foreground">Adicionar Novo Membro</h3>

              <div className="space-y-3">
                <IonItem className="ion-item-custom">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    value={newMemberEmail}
                    onIonChange={(e) => setNewMemberEmail(e.detail.value || '')}
                    placeholder="email@example.com"
                    type="email"
                    className="ion-input-custom"
                  />
                </IonItem>

                <IonItem className="ion-item-custom">
                  <IonLabel position="stacked">Função</IonLabel>
                  <IonSelect
                    value={newMemberRole}
                    onIonChange={(e) =>
                      setNewMemberRole(e.detail.value as 'team_manager' | 'team_president')
                    }
                    className="ion-select-custom"
                  >
                    <IonSelectOption value="team_manager">
                      Gestor da Equipa (Seleções e Escalações)
                    </IonSelectOption>
                    <IonSelectOption value="team_president">
                      Presidente da Equipa (Administração)
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
              </div>

              <IonButton expand="block" onClick={handleAddMember} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Membro
              </IonButton>
            </div>

            {/* Current Members */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Membros Atuais</h3>

              {members.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm bg-muted rounded-lg">
                  Nenhum membro adicionado para esta equipa
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.role === 'team_manager'
                            ? 'Gestor da Equipa'
                            : member.role === 'team_president'
                            ? 'Presidente'
                            : 'Admin'}
                        </p>
                      </div>

                      {member.role !== 'admin' && (
                        <IonButton
                          fill="clear"
                          color="danger"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IonButton>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <IonButton
                expand="block"
                color="medium"
                onClick={() => !loading && onOpenChange(false)}
                disabled={loading}
              >
                Fechar
              </IonButton>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .ion-item-custom {
          --padding-start: 0;
          --padding-end: 0;
          --inner-padding-end: 0;
          --border-width: 0;
          background: none;
          --highlight-height: 0;
        }

        .ion-input-custom {
          --padding-start: 8px;
          --padding-end: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .ion-select-custom {
          --padding-start: 8px;
          --padding-end: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
