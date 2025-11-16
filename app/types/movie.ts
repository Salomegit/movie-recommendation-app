// types/movie.ts
export interface MovieThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ProductionCompany {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  url: string;
  primaryTitle: string;
  originalTitle: string;
  type: string;
  description: string;
  primaryImage: string;
  thumbnails: MovieThumbnail[];
  trailer?: string;
  contentRating: string;
  startYear: number;
  endYear: number | null;
  releaseDate: string;
  interests: string[];
  countriesOfOrigin: string[];
  externalLinks: string[];
  spokenLanguages: string[];
  filmingLocations: string[];
  productionCompanies: ProductionCompany[];
  budget?: number;
  grossWorldwide?: number;
  genres: string[];
  isAdult: boolean;
  runtimeMinutes: number;
  averageRating: number;
  numVotes: number;
  metascore?: number;
}

export interface FavoriteMovie {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  savedAt: string;
}