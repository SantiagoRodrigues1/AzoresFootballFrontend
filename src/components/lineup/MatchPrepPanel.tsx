import React from 'react';
import { CheckCircle, Users, Clock, Trophy } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-green-600" />
        Preparação do Jogo
      </h3>

      <div className="space-y-4">
        {/* Formation Card */}
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase">Formação</span>
            <span className="text-lg font-bold text-green-600">{formation}</span>
          </div>
          <p className="text-xs text-gray-600">{getFormationDescription(formation)}</p>
        </div>

        {/* Players Selection Progress */}
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Jogadores</span>
            </div>
            <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
              {selectedCount}/{totalRequired}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Status message */}
          {isComplete ? (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-700 font-semibold">
              <CheckCircle className="w-3 h-3" />
              Escalação completa!
            </div>
          ) : (
            <div className="mt-2 text-xs text-orange-700 font-semibold">
              Faltam {totalRequired - selectedCount} jogador{totalRequired - selectedCount !== 1 ? 'es' : ''}
            </div>
          )}
        </div>

        {/* Captain Info */}
        {captainName && (
          <div className="bg-white rounded-lg p-3 border border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <div>
                <div className="text-xs font-semibold text-gray-600">CAPITÃO</div>
                <div className="text-sm font-bold text-amber-900">{captainName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Match Time */}
        {matchTime && (
          <div className="bg-white rounded-lg p-3 border border-blue-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs font-semibold text-gray-600">HORA DO JOGO</div>
              <div className="text-sm font-bold text-blue-900">{matchTime}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
