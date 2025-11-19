// lib/recommendation.ts
import { MovieTM } from '../types/movie';

export interface RecommendationResult {
  movie: MovieTM;
  score: number;
  reason: string;
}

function calculateGenreSimilarity(movie1: MovieTM, movie2: MovieTM): number {
  if (!movie1.genre_ids || !movie2.genre_ids) return 0;
  
  const genres1 = new Set(movie1.genre_ids);
  const genres2 = new Set(movie2.genre_ids);
  
  const intersection = new Set([...genres1].filter(g => genres2.has(g)));
  const union = new Set([...genres1, ...genres2]);
  
  return intersection.size / union.size; // Jaccard similarity
}

function calculateRatingSimilarity(movie1: MovieTM, movie2: MovieTM): number {
  if (!movie1.vote_average || !movie2.vote_average) return 0;
  
  const diff = Math.abs(movie1.vote_average - movie2.vote_average);
  return Math.max(0, 1 - (diff / 10)); // Normalize to 0-1
}

function calculateYearSimilarity(movie1: MovieTM, movie2: MovieTM): number {
  const year1 = movie1.release_date ? new Date(movie1.release_date).getFullYear() : 0;
  const year2 = movie2.release_date ? new Date(movie2.release_date).getFullYear() : 0;
  
  if (!year1 || !year2) return 0;
  
  const yearDiff = Math.abs(year1 - year2);
  return Math.max(0, 1 - (yearDiff / 50)); 
}

export function getRecommendationsForMovie(
  targetMovie: MovieTM,
  allMovies: MovieTM[],
  genres: Array<{ id: number; name: string }>,
  limit: number = 10
): RecommendationResult[] {
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    // Skip the target movie itself
    if (movie.id === targetMovie.id) continue;
    
    // Calculate different similarity scores
    const genreSim = calculateGenreSimilarity(targetMovie, movie);
    const ratingSim = calculateRatingSimilarity(targetMovie, movie);
    const yearSim = calculateYearSimilarity(targetMovie, movie);
    
    // Weighted combination (genres are most important)
    const score = (genreSim * 0.5) + (ratingSim * 0.3) + (yearSim * 0.2);
    
    if (score > 0.3) { // Minimum threshold
      const commonGenreIds = targetMovie.genre_ids?.filter(g => 
        movie.genre_ids?.includes(g)
      ) || [];
      
      const commonGenreNames = commonGenreIds
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2);
      
      recommendations.push({
        movie,
        score,
        reason: commonGenreNames.length > 0 
          ? `Similar ${commonGenreNames.join(', ')} movie`
          : 'Similar style and era'
      });
    }
  }
  
  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get recommendations based on user's favorite movies
 */
export function getRecommendationsFromFavorites(
  favoriteMovieIds: number[],
  allMovies: MovieTM[],
  genres: Array<{ id: number; name: string }>,
  limit: number = 10
): RecommendationResult[] {
  if (favoriteMovieIds.length === 0) return [];
  
  const favoriteMovies = allMovies.filter(m => favoriteMovieIds.includes(m.id));
  if (favoriteMovies.length === 0) return [];
  
  // Analyze user preferences
  const genreFrequency = new Map<number, number>();
  let totalRating = 0;
  
  favoriteMovies.forEach(movie => {
    movie.genre_ids?.forEach((genreId: number) => {
      genreFrequency.set(genreId, (genreFrequency.get(genreId) || 0) + 1);
    });
    totalRating += movie.vote_average || 0;
  });
  
  const avgRating = totalRating / favoriteMovies.length;
  const topGenreIds = Array.from(genreFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genreId]) => genreId);
  
  const topGenreNames = topGenreIds
    .map(id => genres.find(g => g.id === id)?.name)
    .filter(Boolean);
  
  // Score each movie based on user preferences
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    // Skip if already in favorites
    if (favoriteMovieIds.includes(movie.id)) continue;
    
    let score = 0;
    let reasons: string[] = [];
    
    // Genre matching (most important)
    const matchingGenreIds = movie.genre_ids?.filter((g: number) => topGenreIds.includes(g)) || [];
    if (matchingGenreIds.length > 0) {
      score += matchingGenreIds.length * 0.4;
      const matchingGenreNames = matchingGenreIds
        .map((id: number) => genres.find(g => g.id === id)?.name)
        .filter(Boolean);
      reasons.push(`${matchingGenreNames.join(', ')} fan favorite`);
    }
    
    // Rating similarity
    if (movie.vote_average) {
      const ratingDiff = Math.abs(movie.vote_average - avgRating);
      if (ratingDiff < 1.5) {
        score += 0.3;
      }
    }
    
    // High rating bonus
    if (movie.vote_average && movie.vote_average >= 8.0) {
      score += 0.2;
      reasons.push('Highly rated');
    }
    
    // Popularity bonus
    if (movie.vote_count && movie.vote_count > 5000) {
      score += 0.1;
      reasons.push('Popular choice');
    }
    
    if (score > 0.4) {
      recommendations.push({
        movie,
        score,
        reason: reasons.length > 0 ? reasons.join(' • ') : 'Recommended for you'
      });
    }
  }
  
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get recommendations based on genre preferences
 */
export function getRecommendationsByGenres(
  preferredGenreIds: number[],
  allMovies: MovieTM[],
  genres: Array<{ id: number; name: string }>,
  limit: number = 10
): RecommendationResult[] {
  if (preferredGenreIds.length === 0) return [];
  
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    const matchingGenreIds = movie.genre_ids?.filter(g => 
      preferredGenreIds.includes(g)
    ) || [];
    
    if (matchingGenreIds.length > 0) {
      // Score based on number of matching genres and rating
      const genreScore = matchingGenreIds.length / preferredGenreIds.length;
      const ratingScore = (movie.vote_average || 0) / 10;
      const score = (genreScore * 0.6) + (ratingScore * 0.4);
      
      const matchingGenreNames = matchingGenreIds
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean);
      
      recommendations.push({
        movie,
        score,
        reason: `Top ${matchingGenreNames.join(', ')} pick`
      });
    }
  }
  
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get trending recommendations (popular + recent + highly rated)
 */
export function getTrendingRecommendations(
  allMovies: MovieTM[],
  limit: number = 10
): RecommendationResult[] {
  const currentYear = new Date().getFullYear();
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    let score = 0;
    let reasons: string[] = [];
    
    // Rating component
    if (movie.vote_average) {
      score += (movie.vote_average / 10) * 0.4;
      if (movie.vote_average >= 8.5) {
        reasons.push('Exceptional rating');
      }
    }
    
    // Popularity component (using popularity score from TMDB)
    if (movie.popularity) {
      const popularityScore = Math.min(movie.popularity / 1000, 1);
      score += popularityScore * 0.3;
      if (movie.popularity > 500) {
        reasons.push('Highly popular');
      }
    }
    
    // Vote count component
    if (movie.vote_count && movie.vote_count > 10000) {
      score += 0.1;
    }
    
    // Recency component
    if (movie.release_date) {
      const movieYear = new Date(movie.release_date).getFullYear();
      const yearDiff = currentYear - movieYear;
      if (yearDiff <= 5) {
        score += 0.3;
        reasons.push('Recent release');
      } else if (yearDiff <= 10) {
        score += 0.15;
      }
    }
    
    recommendations.push({
      movie,
      score,
      reason: reasons.length > 0 ? reasons.join(' • ') : 'Trending now'
    });
  }
  
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get "Because you watched X" recommendations
 */
export function getBecauseYouWatchedRecommendations(
  watchedMovieId: number,
  allMovies: MovieTM[],
  genres: Array<{ id: number; name: string }>,
  limit: number = 6
): RecommendationResult[] {
  const watchedMovie = allMovies.find(m => m.id === watchedMovieId);
  if (!watchedMovie) return [];
  
  return getRecommendationsForMovie(watchedMovie, allMovies, genres, limit);
}