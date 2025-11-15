import { getMovieDetails, getRecommendations } from '@/lib/api';
import Image from 'next/image';
import MovieGrid from '@/components/MovieGrid';

export default async function MovieDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovieDetails(params.id);
  const recommendations = await getRecommendations(params.id);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh]">
        <Image
          src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex gap-8">
          <div className="w-1/3">
            <Image
              src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-xl shadow-2xl"
            />
          </div>
          
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            <div className="flex gap-4 mb-6">
              <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.runtime} min</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
            
            <div className="flex gap-2 mb-6">
              {movie.genres.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-purple-600 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-lg leading-relaxed mb-8">{movie.overview}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">You May Also Like</h2>
          <MovieGrid movies={recommendations.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}