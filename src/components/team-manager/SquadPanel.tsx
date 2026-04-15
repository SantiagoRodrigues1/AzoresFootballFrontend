import { motion } from 'framer-motion';
import { Check, AlertCircle, Users } from 'lucide-react';
import { CallUpPlayer, LineupPlayer } from '@/types';

interface SquadPanelProps {
  starters: LineupPlayer[];
  bench: LineupPlayer[];
  available: CallUpPlayer[];
}

export function SquadPanel({ starters, bench, available }: SquadPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Starting XI */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-300">
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-green-900">
            Titulares ({starters.length}/11)
          </h3>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {starters.length === 0 ? (
            <p className="text-sm text-green-700 text-center py-4">Nenhum titular selecionado</p>
          ) : (
            starters.map((player, index) => (
              <motion.div
                key={`starter-${player.playerId || index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-lg p-3 border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {player.playerName}
                    </div>
                    <div className="text-xs text-gray-500">#{player.playerNumber}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                    {player.playerNumber}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Bench */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-300">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-bold text-yellow-900">
            Suplentes ({bench.length}/8)
          </h3>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {bench.length === 0 ? (
            <p className="text-sm text-yellow-700 text-center py-4">Nenhum suplente selecionado</p>
          ) : (
            bench.map((player, index) => (
              <motion.div
                key={`bench-${player.playerId || index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-lg p-3 border border-yellow-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {player.playerName}
                    </div>
                    <div className="text-xs text-gray-500">#{player.playerNumber}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                    {player.playerNumber}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Available */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-blue-900">
            Disponíveis ({available.length})
          </h3>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm text-blue-700 text-center py-4">Todos os jogadores seleccionados</p>
          ) : (
            available.map((player, index) => (
              <motion.div
                key={`available-${player.playerId || index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-lg p-3 border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {player.playerName}
                    </div>
                    <div className="text-xs text-gray-500">#{player.playerNumber}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    {player.playerNumber}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
