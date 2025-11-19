// lib/api.ts
const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
import {MoviesResponse,GenresResponse} from "../types/movie"

interface ApiFetchOptions {
  endpoint: string;
  method?: string;
  params?: Record<string, string>;
}

export async function apiFetch<T>({ endpoint, method = 'GET', params }: ApiFetchOptions): Promise<T> {
  if (!TMDB_ACCESS_TOKEN) {
    throw new Error('TMDB access token is not configured. Please check your .env.local file.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const movieApi = {
  // Get popular movies
  getMovies: (page: number = 1) => 
    apiFetch<MoviesResponse>({ 
      endpoint: '/discover/movie',
      params: {
        include_adult: 'false',
        include_video: 'false',
        language: 'en-US',
        page: page.toString(),
        sort_by: 'popularity.desc'
      }
    }),
  
  // Get movie recommendations
  getRecommendations: (movieId: number, page: number = 1) =>
    apiFetch<MoviesResponse>({
      endpoint: `/movie/${movieId}/recommendations`,
      params: {
        language: 'en-US',
        page: page.toString()
      }
    }),
  
  // Get similar movies
  getSimilarMovies: (movieId: number, page: number = 1) =>
    apiFetch<MoviesResponse>({
      endpoint: `/movie/${movieId}/similar`,
      params: {
        language: 'en-US',
        page: page.toString()
      }
    }),
  
  // Get movie genres
  getGenres: () =>
    apiFetch<GenresResponse>({
      endpoint: '/genre/movie/list',
      params: {
        language: 'en-US'
      }
    }),
};

