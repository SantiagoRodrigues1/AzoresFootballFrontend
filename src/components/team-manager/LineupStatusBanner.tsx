import { motion } from 'framer-motion';
import { AlertCircle, Clock, Lock, CheckCircle } from 'lucide-react';

interface LineupStatusBannerProps {
  status: 'callup_pending' | 'callup_ready' | 'lineup_pending' | 'lineup_locked';
  hoursUntilKickoff: number;
  minutesUntilKickoff: number;
  matchTime: string;
}

export function LineupStatusBanner({
  status,
  hoursUntilKickoff,
  minutesUntilKickoff,
  matchTime,
}: LineupStatusBannerProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'callup_pending':
        return {
          icon: Clock,
          title: 'Convocação Aberta em Breve',
          message: `Abre em ${hoursUntilKickoff}h ${minutesUntilKickoff}min (Jogo: ${matchTime})`,
          color: 'from-blue-500 to-blue-600',
          textColor: 'text-blue-900 dark:text-blue-200',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700',
        };
      case 'callup_ready':
        return {
          icon: AlertCircle,
          title: 'Convocação Disponível',
          message: `Feche a sua convocação até ${hoursUntilKickoff}h ${minutesUntilKickoff}min do jogo`,
          color: 'from-yellow-500 to-yellow-600',
          textColor: 'text-yellow-900 dark:text-yellow-200',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700',
        };
      case 'lineup_pending':
        return {
          icon: AlertCircle,
          title: 'Escalação Disponível',
          message: `Submeta a escalação até ${minutesUntilKickoff}min antes do jogo`,
          color: 'from-orange-500 to-orange-600',
          textColor: 'text-orange-900 dark:text-orange-200',
          bgColor: 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700',
        };
      case 'lineup_locked':
        return {
          icon: Lock,
          title: 'Escalação Bloqueada',
          message: 'A escalação foi enviada para o árbitro',
          color: 'from-green-500 to-green-600',
          textColor: 'text-green-900 dark:text-green-200',
          bgColor: 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700',
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Estado Desconhecido',
          message: 'Contacte o administrador',
          color: 'from-gray-500 to-gray-600',
          textColor: 'text-gray-900 dark:text-gray-200',
          bgColor: 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
        };
    }
  };

  const info = getStatusInfo();
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl p-4 border-2 ${info.bgColor}
        bg-gradient-to-r ${info.color} bg-opacity-10
      `}
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`p-3 rounded-lg bg-gradient-to-br ${info.color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex-1">
          <h3 className={`font-bold text-lg ${info.textColor}`}>{info.title}</h3>
          <p className={`text-sm mt-1 ${info.textColor} opacity-80`}>{info.message}</p>
        </div>
      </div>
    </motion.div>
  );
}
