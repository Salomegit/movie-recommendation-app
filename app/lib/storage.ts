const FAVORITES_KEY = 'movieFavorites';

export const getFavorites = (): number[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (movieId: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(movieId)) {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...favorites, movieId])
    );
  }
};

export const removeFavorite = (movieId: number): void => {
  const favorites = getFavorites().filter(id => id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = (movieId: number): boolean => {
  return getFavorites().includes(movieId);
};