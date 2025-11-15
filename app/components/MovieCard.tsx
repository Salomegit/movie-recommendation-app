
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import FavoriteButton from './FavoriteButton';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 text-sm">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
          <FavoriteButton movieId={movie.id} />
        </div>
      </div>
    </div>
  );
}