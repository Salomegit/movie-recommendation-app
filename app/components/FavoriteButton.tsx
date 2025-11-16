'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '../lib/storage';

interface FavoriteButtonProps {
  movieId: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  movieId,
  size = 'md',
  showLabel = false,
  className = '',
  onToggle
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if movie is favorite on mount and when movieId changes
  useEffect(() => {
    setFavorite(isFavorite(movieId));
  }, [movieId]);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'p-1.5',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavoriteState = !favorite;
    
    // Update localStorage
    if (newFavoriteState) {
      addFavorite(movieId);
    } else {
      removeFavorite(movieId);
    }

    // Update state
    setFavorite(newFavoriteState);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Call optional callback
    if (onToggle) {
      onToggle(newFavoriteState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${currentSize.button}
        rounded-full
        bg-black/50
        backdrop-blur-sm
        hover:bg-black/70
        active:scale-95
        transition-all
        duration-200
        flex
        items-center
        gap-2
        ${className}
      `}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          ${currentSize.icon}
          transition-all
          duration-300
          ${favorite ? 'fill-red-500 text-red-500' : 'text-white'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
      />
      
      {showLabel && (
        <span className={`${currentSize.text} text-white font-medium`}>
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
}

// Alternative version with different styles
export function FavoriteButtonOutline({
  movieId,
  className = ''
}: Pick<FavoriteButtonProps, 'movieId' | 'className'>) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(movieId));
  }, [movieId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !favorite;
    newState ? addFavorite(movieId) : removeFavorite(movieId);
    setFavorite(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        px-4 py-2 rounded-lg
        border-2
        ${favorite 
          ? 'border-red-500 bg-red-500 text-white' 
          : 'border-gray-500 text-gray-300 hover:border-red-500 hover:text-red-500'
        }
        transition-all duration-200
        flex items-center gap-2
        font-medium
        ${className}
      `}
    >
      <Heart className={`w-5 h-5 ${favorite ? 'fill-white' : ''}`} />
      {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
}

// Icon-only compact version
export function FavoriteIcon({ movieId }: Pick<FavoriteButtonProps, 'movieId'>) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(movieId));
  }, [movieId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !favorite;
    newState ? addFavorite(movieId) : removeFavorite(movieId);
    setFavorite(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="group"
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          w-6 h-6
          transition-all
          duration-300
          ${favorite 
            ? 'fill-red-500 text-red-500 scale-110' 
            : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
          }
        `}
      />
    </button>
  );
}