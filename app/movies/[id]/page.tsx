'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { movieApi } from '../../lib/api';
import { storage } from '../../lib/storage';
import { MovieTM } from '../../types/movie';
import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';

interface MovieDetails extends MovieTM {
  runtime?: number;
  budget?: number;
  revenue?: number;
  production_companies?: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages?: Array<{ iso_639_1: string; name: string }>;
  status?: string;
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<MovieTM[]>([]);
  const [genresList, setGenresList] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadMovieData(Number(params.id));
    }
  }, [params.id]);

  useEffect(() => {
    if (movie) {
      setIsFavorite(storage.isFavorite(movie.id));
    }
  }, [movie]);

  const loadMovieData = async (id: number) => {
    try {
      setLoading(true);
      
      // Load genres list
      const genresData = await movieApi.getGenres();
      setGenresList(genresData.genres);
      
      // Load movie details
      const movieData = await movieApi.getMovieDetails(id);
      setMovie(movieData);
      
      // Load similar movies
      const similarData = await movieApi.getSimilarMovies(id);
      setSimilarMovies(similarData.results.slice(0, 8));
    } catch (err) {
      console.error('Error loading movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite) {
      storage.removeFavorite(movie.id);
      setIsFavorite(false);
    } else {
      storage.addFavorite({
        id: movie.id,
        title: movie.title,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg',
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
        savedAt: new Date().toISOString(),
      });
      setIsFavorite(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-5">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-5">
          <button 
            onClick={() => router.back()}
            className="bg-white/10 border-none text-white px-6 py-3 rounded-lg cursor-pointer text-base my-5 flex items-center gap-2 transition-all duration-300 hover:bg-white/20"
          >
            ← Back
          </button>
          <p className="text-white text-center">Movie not found</p>
        </main>
      </div>
    );
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder.jpg';
  
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-5">
        <button 
          onClick={() => router.back()}
          className="bg-white/10 border-none text-white px-6 py-3 rounded-lg cursor-pointer text-base my-5 flex items-center gap-2 transition-all duration-300 hover:bg-white/20"
        >
          ← Back
        </button>

        {/* Hero Section */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 mb-10">
          {/* Poster */}
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-full h-auto block"
            />
          </div>

          {/* Info Section */}
          <div className="text-white">
            {/* Title Section */}
            <div className="flex justify-between items-start gap-5 mb-5">
              <div>
                <h1 className="text-4xl lg:text-[42px] font-extrabold m-0 mb-2.5">
                  {movie.title}
                </h1>
                {movie.original_title !== movie.title && (
                  <p className="text-lg text-[#999] m-0 mb-5 italic">
                    {movie.original_title}
                  </p>
                )}
                {movie.tagline && (
                  <p className="text-lg text-[#999] m-0 mb-5 italic">
                    "{movie.tagline}"
                  </p>
                )}
              </div>
              <button 
                onClick={handleFavoriteToggle}
                className={`${
                  isFavorite 
                    ? 'bg-[#e50914] border-[#e50914] hover:bg-[#ff0a16]' 
                    : 'bg-white/10 border-[#333] hover:bg-white/20'
                } border-2 text-white px-6 py-3 rounded-full cursor-pointer text-base flex items-center gap-2 transition-all duration-300 whitespace-nowrap hover:scale-105`}
              >
                {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-5 mb-7 p-5 bg-white/5 rounded-xl">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#999] uppercase tracking-wider">Rating</span>
                <span className="text-lg font-semibold text-[#ffd700]">
                  ⭐ {movie.vote_average?.toFixed(1)}/10
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#999] uppercase tracking-wider">Votes</span>
                <span className="text-lg font-semibold text-white">
                  {movie.vote_count?.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#999] uppercase tracking-wider">Year</span>
                <span className="text-lg font-semibold text-white">{year}</span>
              </div>
              {movie.runtime && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#999] uppercase tracking-wider">Runtime</span>
                  <span className="text-lg font-semibold text-white">{movie.runtime} min</span>
                </div>
              )}
              {movie.status && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#999] uppercase tracking-wider">Status</span>
                  <span className="text-lg font-semibold text-white">{movie.status}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg leading-[1.8] text-[#ccc] mb-7">
              {movie.overview}
            </p>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-7">
                <h2 className="text-2xl font-bold m-0 mb-4 text-white">Genres</h2>
                <div className="flex flex-wrap gap-2.5">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="bg-[#e50914]/20 border border-[#e50914] text-white px-4 py-2 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Production Companies
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                {movie.production_companies.map(c => c.name).join(', ')}
              </p>
            </div>
          )}

          {movie.production_countries && movie.production_countries.length > 0 && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Countries
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                {movie.production_countries.map(c => c.name).join(', ')}
              </p>
            </div>
          )}

          {movie.spoken_languages && movie.spoken_languages.length > 0 && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Languages
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                {movie.spoken_languages.map(l => l.name).join(', ')}
              </p>
            </div>
          )}

          {movie.budget && movie.budget > 0 && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Budget
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                ${movie.budget.toLocaleString()}
              </p>
            </div>
          )}

          {movie.revenue && movie.revenue > 0 && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Revenue
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                ${movie.revenue.toLocaleString()}
              </p>
            </div>
          )}

          {movie.popularity && (
            <div className="bg-white/5 p-5 rounded-xl">
              <h3 className="text-base text-[#999] m-0 mb-3 uppercase tracking-wider">
                Popularity
              </h3>
              <p className="text-base text-white m-0 leading-[1.6]">
                {movie.popularity.toFixed(0)}
              </p>
            </div>
          )}
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section className="mt-15 pt-10 border-t-2 border-white/10">
            <h2 className="text-3xl font-bold text-white m-0 mb-7 flex items-center gap-3 before:content-['🎬'] before:text-[32px]">
              Similar Movies You Might Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarMovies.map((similarMovie) => (
                <MovieCard 
                  key={similarMovie.id} 
                  movie={similarMovie}
                  genres={genresList}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}