import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

interface ValidationErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onGoBack: () => void;
  onContinueSave: () => void;
}

export function ValidationErrorModal({
  isOpen,
  errorMessage,
  onGoBack,
  onContinueSave,
}: ValidationErrorModalProps) {
  if (!isOpen) return null;

  const isGoalkeeperError = errorMessage.toLowerCase().includes('guarda-rede');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-4 bg-amber-100 rounded-full"
            >
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            {isGoalkeeperError ? '🥅 Guarda-Redes Obrigatório' : 'Aviso na Escalação'}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-700 text-lg mb-8 leading-relaxed">
            {errorMessage}
          </p>

          {/* Additional Info for Goalkeeper */}
          {isGoalkeeperError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                <strong>Informação:</strong> Idealmente deve ter um guarda-redes no banco de suplentes, mas pode continuar mesmo assim.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 w-full flex-col-reverse sm:flex-row">
            {/* Go Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoBack}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </motion.button>

            {/* Continue Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinueSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md whitespace-nowrap"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Eu sei, guardar</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
