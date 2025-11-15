import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrendingMovies = async () => {
  const response = await tmdbApi.get('/trending/movie/week');
  return response.data.results;
};

export const getMovieDetails = async (id: string) => {
  const response = await tmdbApi.get(`/movie/${id}`);
  return response.data;
};

export const searchMovies = async (query: string) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query },
  });
  return response.data.results;
};

export const getRecommendations = async (id: string) => {
  const response = await tmdbApi.get(`/movie/${id}/recommendations`);
  return response.data.results;
};