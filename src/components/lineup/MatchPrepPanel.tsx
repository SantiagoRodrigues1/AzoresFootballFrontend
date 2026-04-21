import React from 'react';
import { CheckCircle, Users, Clock, Trophy, Crown } from 'lucide-react';

interface MatchPrepPanelProps {
  formation: string;
  selectedCount: number;
  totalRequired: number;
  captainName?: string;
  formationDescription?: string;
  matchTime?: string;
}

export const MatchPrepPanel: React.FC<MatchPrepPanelProps> = ({
  formation,
  selectedCount,
  totalRequired,
  captainName,
  formationDescription,
  matchTime,
}) => {
  const isComplete = selectedCount === totalRequired;
  const progressPercentage = Math.round((selectedCount / totalRequired) * 100);

  const getFormationDescription = (formation: string): string => {
    const descriptions: Record<string, string> = {
      '4-3-3': 'Atacante com 2 alas',
      '4-4-2': 'Clássico com 2 avançados',
      '3-5-2': 'Posse de bola agressiva',
      '4-2-3-1': 'Defensivo equilibrado',
      '5-3-2': 'Defesa reforçada',
    };
    return formationDescription || descriptions[formation] || 'Formação personalizada';
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-4">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-green-600" />
        Preparação do Jogo
      </h3>

      <div className="space-y-4">
        {/* Formation Card */}
        <div className="bg-card rounded-lg p-3 border border-green-100 dark:border-green-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Formação</span>
            <span className="text-lg font-bold text-green-600">{formation}</span>
          </div>
          <p className="text-xs text-muted-foreground">{getFormationDescription(formation)}</p>
        </div>

        {/* Players Selection Progress */}
        <div className="bg-card rounded-lg p-3 border border-green-100 dark:border-green-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-muted-foreground uppercase">Jogadores</span>
            </div>
            <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
              {selectedCount}/{totalRequired}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Status message */}
          {isComplete ? (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-700 dark:text-green-400 font-semibold">
              <CheckCircle className="w-3 h-3" />
              Escalação completa!
            </div>
          ) : (
            <div className="mt-2 text-xs text-orange-700 dark:text-orange-400 font-semibold">
              Faltam {totalRequired - selectedCount} jogador{totalRequired - selectedCount !== 1 ? 'es' : ''}
            </div>
          )}
        </div>

        {/* Captain Info */}
        {captainName && (
          <div className="bg-card rounded-lg p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xs font-semibold text-muted-foreground">CAPITÃO</div>
                <div className="text-sm font-bold text-amber-900 dark:text-amber-300">{captainName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Match Time */}
        {matchTime && (
          <div className="bg-card rounded-lg p-3 border border-blue-100 dark:border-blue-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs font-semibold text-muted-foreground">HORA DO JOGO</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-300">{matchTime}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
