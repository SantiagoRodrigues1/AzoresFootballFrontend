import { Star } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from '@/services/api';
import { motion } from 'framer-motion';

interface FavoriteTeamButtonProps {
  teamId: string;
  teamName: string;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  token?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export function FavoriteTeamButton({
  teamId,
  teamName,
  isFavorite = false,
  onToggle,
  token,
  size = 'md',
  variant = 'icon'
}: FavoriteTeamButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(isFavorite);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!token) {
      console.warn('Sem token para mudar favorito');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL_LOCAL = API_URL;
      
      const response = await fetch(`${API_URL_LOCAL}/user/favorites/toggle/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newFavoriteStatus = data.data.isFavorite;
        setIsFav(newFavoriteStatus);
        onToggle?.(newFavoriteStatus);
      }
    } catch (error) {
      console.error('Erro ao toggle favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const buttonPadding = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`${buttonPadding[size]} hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isFav ? `Remover ${teamName} dos favoritos` : `Adicionar ${teamName} aos favoritos`}
      >
        <Star
          className={`${sizeClasses[size]} ${
            isFav
              ? 'fill-yellow-400 stroke-yellow-500'
              : 'stroke-gray-400 fill-none'
          } transition-all`}
        />
      </motion.button>
    );
  }

  // Button variant
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isFav
          ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Star
        className={`w-5 h-5 ${
          isFav ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-current fill-none'
        }`}
      />
      {isFav ? 'Nos Favoritos' : 'Adicionar aos Favoritos'}
    </motion.button>
  );
}
