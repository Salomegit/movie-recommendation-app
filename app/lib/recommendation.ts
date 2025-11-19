// lib/recommendations.ts
import { Movie } from '../types/movie';

export interface RecommendationResult {
  movie: Movie;
  score: number;
  reason: string;
}


function calculateGenreSimilarity(movie1: Movie, movie2: Movie): number {
  if (!movie1.genres || !movie2.genres) return 0;
  
  const genres1 = new Set(movie1.genres);
  const genres2 = new Set(movie2.genres);
  
  const intersection = new Set([...genres1].filter(g => genres2.has(g)));
  const union = new Set([...genres1, ...genres2]);
  
  return intersection.size / union.size; // Jaccard similarity
}


function calculateRatingSimilarity(movie1: Movie, movie2: Movie): number {
  if (!movie1.averageRating || !movie2.averageRating) return 0;
  
  const diff = Math.abs(movie1.averageRating - movie2.averageRating);
  return Math.max(0, 1 - (diff / 10)); // Normalize to 0-1
}


function calculateYearSimilarity(movie1: Movie, movie2: Movie): number {
  if (!movie1.startYear || !movie2.startYear) return 0;
  
  const yearDiff = Math.abs(movie1.startYear - movie2.startYear);
  return Math.max(0, 1 - (yearDiff / 50)); // Movies within 50 years are considered
}


export function getRecommendationsForMovie(
  targetMovie: Movie,
  allMovies: Movie[],
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
      const commonGenres = targetMovie.genres?.filter(g => 
        movie.genres?.includes(g)
      ) || [];
      
      recommendations.push({
        movie,
        score,
        reason: commonGenres.length > 0 
          ? `Similar ${commonGenres.slice(0, 2).join(', ')} movie`
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
  favoriteMovieIds: string[],
  allMovies: Movie[],
  limit: number = 10
): RecommendationResult[] {
  if (favoriteMovieIds.length === 0) return [];
  
  const favoriteMovies = allMovies.filter(m => favoriteMovieIds.includes(m.id));
  if (favoriteMovies.length === 0) return [];
  
  // Analyze user preferences
  const genreFrequency = new Map<string, number>();
  let totalRating = 0;
  
  favoriteMovies.forEach(movie => {
    movie.genres?.forEach(genre => {
      genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + 1);
    });
    totalRating += movie.averageRating || 0;
  });
  
  const avgRating = totalRating / favoriteMovies.length;
  const topGenres = Array.from(genreFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
  
  // Score each movie based on user preferences
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    // Skip if already in favorites
    if (favoriteMovieIds.includes(movie.id)) continue;
    
    let score = 0;
    let reasons: string[] = [];
    
    // Genre matching (most important)
    const matchingGenres = movie.genres?.filter(g => topGenres.includes(g)) || [];
    if (matchingGenres.length > 0) {
      score += matchingGenres.length * 0.4;
      reasons.push(`${matchingGenres.join(', ')} fan favorite`);
    }
    
    // Rating similarity
    if (movie.averageRating) {
      const ratingDiff = Math.abs(movie.averageRating - avgRating);
      if (ratingDiff < 1.5) {
        score += 0.3;
      }
    }
    
    // High rating bonus
    if (movie.averageRating && movie.averageRating >= 8.0) {
      score += 0.2;
      reasons.push('Highly rated');
    }
    
    // Popularity bonus
    if (movie.numVotes && movie.numVotes > 500000) {
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
  preferredGenres: string[],
  allMovies: Movie[],
  limit: number = 10
): RecommendationResult[] {
  if (preferredGenres.length === 0) return [];
  
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    const matchingGenres = movie.genres?.filter(g => 
      preferredGenres.includes(g)
    ) || [];
    
    if (matchingGenres.length > 0) {
      // Score based on number of matching genres and rating
      const genreScore = matchingGenres.length / preferredGenres.length;
      const ratingScore = (movie.averageRating || 0) / 10;
      const score = (genreScore * 0.6) + (ratingScore * 0.4);
      
      recommendations.push({
        movie,
        score,
        reason: `Top ${matchingGenres.join(', ')} pick`
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
  allMovies: Movie[],
  limit: number = 10
): RecommendationResult[] {
  const currentYear = new Date().getFullYear();
  const recommendations: RecommendationResult[] = [];
  
  for (const movie of allMovies) {
    let score = 0;
    let reasons: string[] = [];
    
    // Rating component
    if (movie.averageRating) {
      score += (movie.averageRating / 10) * 0.4;
      if (movie.averageRating >= 8.5) {
        reasons.push('Exceptional rating');
      }
    }
    
    // Popularity component
    if (movie.numVotes) {
      const popularityScore = Math.min(movie.numVotes / 1000000, 1);
      score += popularityScore * 0.3;
      if (movie.numVotes > 1000000) {
        reasons.push('Highly popular');
      }
    }
    
    // Recency component
    if (movie.startYear) {
      const yearDiff = currentYear - movie.startYear;
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
  watchedMovieId: string,
  allMovies: Movie[],
  limit: number = 6
): RecommendationResult[] {
  const watchedMovie = allMovies.find(m => m.id === watchedMovieId);
  if (!watchedMovie) return [];
  
  return getRecommendationsForMovie(watchedMovie, allMovies, limit);
}