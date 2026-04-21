import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { IonButton, IonAlert } from '@ionic/react';

interface Match {
  casa: string;
  fora: string;
  data_hora: string;
  status?: 'scheduled' | 'live' | 'finished';
  resultado?: string;
  estadio?: string;
}

interface TeamMatchesSectionProps {
  teamId: string;
  teamName: string;
  matches: Match[];
  canEdit: boolean;
  token?: string;
  onCreateMatch?: () => void;
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => Promise<void>;
}

export function TeamMatchesSection({
  teamId,
  teamName,
  matches,
  canEdit,
  token,
  onCreateMatch,
  onEditMatch,
  onDeleteMatch,
}: TeamMatchesSectionProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const teamMatches = matches.filter(
    (m) => m.casa.toLowerCase() === teamName.toLowerCase() || 
            m.fora.toLowerCase() === teamName.toLowerCase()
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-PT', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const handleDeleteMatch = async () => {
    if (!matchToDelete || !onDeleteMatch) return;

    setIsDeleting(true);
    try {
      await onDeleteMatch(matchToDelete);
      setShowDeleteAlert(false);
      setMatchToDelete(null);
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Jogos</h3>
            <p className="text-sm text-muted-foreground">
              {teamMatches.length} jogo{teamMatches.length !== 1 ? 's' : ''}
            </p>
          </div>
          {canEdit && (
            <IonButton
              fill="solid"
              size="small"
              onClick={onCreateMatch}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </IonButton>
          )}
        </div>

        {/* Matches List */}
        {teamMatches.length === 0 ? (
          <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Sem jogos agendados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teamMatches.map((match, idx) => {
              const isHome = match.casa.toLowerCase() === teamName.toLowerCase();

              return (
                <motion.div
                  key={`${match.casa}-${match.fora}-${match.data_hora}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-primary/30"
                >
                  {/* Match Card Content */}
                  <div className="flex items-center gap-4">
                    {/* Date & Time */}
                    <div className="flex-shrink-0 text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
                      <p className="text-xs font-bold text-primary uppercase">
                        {formatDate(match.data_hora).split(' ')[0]}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {formatTime(match.data_hora)}
                      </p>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`flex-1 ${isHome ? 'font-bold' : ''}`}>
                          <p className="text-sm truncate text-foreground">
                            {match.casa}
                            {isHome && (
                              <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                Home
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Score / VS */}
                        <div className="flex-shrink-0">
                          {match.status === 'finished' && match.resultado ? (
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm">
                              {match.resultado}
                            </div>
                          ) : (
                            <div className="text-xs font-semibold text-muted-foreground">
                              vs
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex-1 text-right ${
                            !isHome ? 'font-bold' : ''
                          }`}
                        >
                          <p className="text-sm truncate text-foreground">
                            {match.status === 'finished' && (
                              <span className="mr-2 inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                                FIM
                              </span>
                            )}
                            {match.fora}
                          </p>
                        </div>
                      </div>

                      {/* Stadium */}
                      {match.estadio && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{match.estadio}</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Actions */}
                    {canEdit && (
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => onEditMatch?.(match)}
                          className="text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          color="danger"
                          size="small"
                          onClick={() => {
                            setMatchToDelete(match);
                            setShowDeleteAlert(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IonButton>
                      </div>
                    )}

                    {/* Status Badge */}
                    {match.status === 'live' && (
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-300 rounded-full"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-600">AO VIVO</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => {
          setShowDeleteAlert(false);
          setMatchToDelete(null);
        }}
        header="Confirmar eliminação"
        message={
          matchToDelete
            ? `Tem a certeza que deseja apagar o jogo entre ${matchToDelete.casa} e ${matchToDelete.fora}?`
            : ''
        }
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              setShowDeleteAlert(false);
              setMatchToDelete(null);
            },
          },
          {
            text: 'Apagar',
            role: 'destructive',
            handler: handleDeleteMatch,
          },
        ]}
      />
    </>
  );
}
