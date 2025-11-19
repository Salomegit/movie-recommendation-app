// lib/storage.ts
import { FavoriteMovie } from '../types/movie';

const FAVORITES_KEY = 'movie_favorites';

export const storage = {
  // Get all favorite movies
  getFavorites: (): FavoriteMovie[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  // Add a movie to favorites
  addFavorite: (movie: FavoriteMovie): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const favorites = storage.getFavorites();
      
      // Check if already exists
      if (favorites.some(fav => fav.id === movie.id)) {
        return false;
      }
      
      favorites.push(movie);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  // Remove a movie from favorites
  removeFavorite: (movieId: number): boolean => {  // Changed to number
    if (typeof window === 'undefined') return false;
    
    try {
      const favorites = storage.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== movieId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },

  // Check if a movie is in favorites
  isFavorite: (movieId: number): boolean => {  // Changed to number
    if (typeof window === 'undefined') return false;
    
    const favorites = storage.getFavorites();
    return favorites.some(fav => fav.id === movieId);
  },

  // Clear all favorites
  clearFavorites: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(FAVORITES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }
};