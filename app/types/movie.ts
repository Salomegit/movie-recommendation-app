export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: Company[];
}

export interface Genre {
  id: number;
  name: string;
}