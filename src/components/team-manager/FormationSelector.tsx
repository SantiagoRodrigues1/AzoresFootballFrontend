import { motion } from 'framer-motion';
import { FormationName } from '@/types';
import { FORMATION_NAMES } from '@/utils/formations';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

interface FormationSelectorProps {
  selectedFormation: FormationName;
  onFormationChange: (formation: FormationName) => void;
  disabled?: boolean;
}

export function FormationSelector({
  selectedFormation,
  onFormationChange,
  disabled = false,
}: FormationSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-200"
    >
      <h3 className="text-lg font-bold text-foreground mb-4">Escolha a Formação</h3>

      <div className="grid grid-cols-3 gap-2">
        {FORMATION_NAMES.map((formation) => (
          <motion.button
            key={formation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !disabled && onFormationChange(formation)}
            disabled={disabled}
            className={`py-3 px-4 rounded-lg font-bold text-sm transition-all ${
              selectedFormation === formation
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-foreground border-2 border-gray-300 hover:border-primary hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {formation}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
