import React, { useState } from 'react';
import { Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerOption {
  id: string;
  name: string;
  number: number;
  position: string;
}

interface CaptainSelectorProps {
  players: PlayerOption[];
  currentCaptain: string | null;
  currentViceCaptain: string | null;
  onCaptainChange: (playerId: string | null) => void;
  onViceCaptainChange: (playerId: string | null) => void;
  isEditing: boolean;
}

export const CaptainSelector: React.FC<CaptainSelectorProps> = ({
  players,
  currentCaptain,
  currentViceCaptain,
  onCaptainChange,
  onViceCaptainChange,
  isEditing,
}) => {
  const [showCaptainDropdown, setShowCaptainDropdown] = useState(false);
  const [showViceCaptainDropdown, setShowViceCaptainDropdown] = useState(false);

  const getCaptainName = (id: string | null) => {
    if (!id) return 'Sem capitão';
    return players.find(p => p.id === id)?.name || 'Desconhecido';
  };

  const getCaptainNumber = (id: string | null) => {
    if (!id) return null;
    return players.find(p => p.id === id)?.number || null;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Crown className="w-4 h-4 text-amber-600" />
        Capitães & Vice-Capitão
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Capitão */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
            👑 Capitão
          </label>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between text-left text-sm"
              onClick={() => {
                if (isEditing) setShowCaptainDropdown(!showCaptainDropdown);
              }}
              disabled={!isEditing}
            >
              <span className="truncate">
                {currentCaptain ? `#${getCaptainNumber(currentCaptain)} ${getCaptainName(currentCaptain)}` : 'Seleccionar'}
              </span>
              <Crown className="w-3 h-3 text-amber-600 flex-shrink-0" />
            </Button>

            {showCaptainDropdown && isEditing && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b"
                  onClick={() => {
                    onCaptainChange(null);
                    setShowCaptainDropdown(false);
                  }}
                >
                  Limpar seleção
                </button>
                {players.map(player => (
                  <button
                    key={player.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 border-b last:border-0"
                    onClick={() => {
                      onCaptainChange(player.id);
                      setShowCaptainDropdown(false);
                    }}
                  >
                    <div className="font-semibold">#{player.number} {player.name}</div>
                    <div className="text-xs text-gray-500">{player.position}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vice-Capitão */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
            🛡️ Vice-Capitão
          </label>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between text-left text-sm"
              onClick={() => {
                if (isEditing) setShowViceCaptainDropdown(!showViceCaptainDropdown);
              }}
              disabled={!isEditing}
            >
              <span className="truncate">
                {currentViceCaptain ? `#${getCaptainNumber(currentViceCaptain)} ${getCaptainName(currentViceCaptain)}` : 'Seleccionar'}
              </span>
              <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
            </Button>

            {showViceCaptainDropdown && isEditing && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b"
                  onClick={() => {
                    onViceCaptainChange(null);
                    setShowViceCaptainDropdown(false);
                  }}
                >
                  Limpar seleção
                </button>
                {players.map(player => (
                  <button
                    key={player.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b last:border-0"
                    onClick={() => {
                      onViceCaptainChange(player.id);
                      setShowViceCaptainDropdown(false);
                    }}
                  >
                    <div className="font-semibold">#{player.number} {player.name}</div>
                    <div className="text-xs text-gray-500">{player.position}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {currentCaptain && (
        <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-gray-600">
          <div className="font-semibold">👑 Capitão Designado</div>
          <div className="text-gray-700">{getCaptainName(currentCaptain)}</div>
        </div>
      )}
    </div>
  );
};
