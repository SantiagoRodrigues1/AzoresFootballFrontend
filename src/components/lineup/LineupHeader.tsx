import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LineupHeaderProps {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  matchStatus: string;
  onBack: () => void;
  isEditing: boolean;
}

export const LineupHeader: React.FC<LineupHeaderProps> = ({
  homeTeam,
  awayTeam,
  matchDate,
  matchStatus,
  onBack,
  isEditing,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'live':
        return 'bg-green-500';
      case 'halftime':
        return 'bg-orange-500';
      case 'finished':
        return 'bg-gray-500';
      case 'postponed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendado',
      live: 'Em Direto',
      halftime: 'Intervalo',
      finished: 'Finalizado',
      postponed: 'Adiado',
    };
    return labels[status] || status;
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-lg mb-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">
          {isEditing ? '✏️ Editar Escalação' : 'Visualizar Escalação'}
        </h1>
      </div>

      {/* Match info */}
      <div className="space-y-3">
        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-sm font-semibold text-gray-300">{homeTeam}</div>
            <div className="text-2xl font-bold">🏠</div>
          </div>

          <div className="px-4 py-2 bg-white/10 rounded-lg mx-2">
            <div className="text-xs text-gray-300 font-semibold">VS</div>
          </div>

          <div className="text-center flex-1">
            <div className="text-sm font-semibold text-gray-300">{awayTeam}</div>
            <div className="text-2xl font-bold">✈️</div>
          </div>
        </div>

        {/* Date and Status */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-gray-400">{matchDate}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(matchStatus)} text-white`}>
            {getStatusLabel(matchStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};
