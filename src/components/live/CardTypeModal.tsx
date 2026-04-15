// components/live/CardTypeModal.tsx
import React from 'react';
import './CardTypeModal.css';
import { motion } from 'framer-motion';

interface CardTypeModalProps {
  isOpen: boolean;
  onSelectCardType: (cardType: 'yellow_card' | 'red_card') => void;
  onClose: () => void;
}

export const CardTypeModal: React.FC<CardTypeModalProps> = ({
  isOpen,
  onSelectCardType,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="card-type-modal-overlay" onClick={onClose}>
      <motion.div 
        className="card-type-modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className="card-type-modal-title">Qual cartão?</h2>
        
        <div className="card-options">
          <button
            className="card-option yellow-card-btn"
            onClick={() => onSelectCardType('yellow_card')}
            title="Cartão Amarelo"
          >
            <span className="card-icon">🟨</span>
            <span className="card-label">Cartão Amarelo</span>
          </button>
          
          <button
            className="card-option red-card-btn"
            onClick={() => onSelectCardType('red_card')}
            title="Cartão Vermelho"
          >
            <span className="card-icon">🟥</span>
            <span className="card-label">Cartão Vermelho</span>
          </button>
        </div>

        <button className="card-modal-close" onClick={onClose}>
          Cancelar
        </button>
      </motion.div>
    </div>
  );
};

export default CardTypeModal;
