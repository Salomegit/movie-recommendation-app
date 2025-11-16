// lib/api.ts
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
const BASE_URL = `https://${RAPIDAPI_HOST}/api/imdb`;

interface ApiFetchOptions {
  endpoint: string;
  method?: string;
  params?: Record<string, string>;
}

export async function apiFetch<T>({ endpoint, method = 'GET', params }: ApiFetchOptions): Promise<T> {
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    throw new Error('API keys are not configured. Please check your .env.local file.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export const movieApi = {
  
  getTop250Movies: () => apiFetch<any>({ endpoint: `/top250-movies` }),
  
  
  getMovieDetails: (imdbId: string) => 
    apiFetch<any>({ endpoint: `/${imdbId}` }),
  
 
  searchMovies: (query: string) => 
    apiFetch<any>({ 
      endpoint: '/imdb/search',
      params: { query }
    }),
  
  // Get Top Box Office
  getTopBoxOffice: () => 
    apiFetch<any>({ endpoint: '/imdb/top-box-office' }),
  
  // Get Most Popular Movies
  getMostPopularMovies: () => 
    apiFetch<any>({ endpoint: '/most-popular-movies' }),
};