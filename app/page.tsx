// app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { movieApi } from '../app/lib/api';
import { MovieTM, Genre } from '../app/types/movie';
import Navbar from '../app/components/Navbar';
import SearchBar from '../app/components/SearchBar';
import GenreFilter from '../app/components/GenreFilter';
import MovieGrid from '../app/components/MovieGrid';

const MOVIES_PER_PAGE = 10;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
`;

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: 16px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #999;
  margin: 0 0 40px 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #999;
`;

const Spinner = styled.div`
  border: 4px solid #333;
  border-top: 4px solid #e50914;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid #e50914;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #ff6b6b;
  margin: 20px 0;
`;

const ActiveFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const FilterTag = styled.div`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #e50914;
  }
`;

export default function Home() {
  const [allMovies, setAllMovies] = useState<MovieTM[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MovieTM[]>([]);
  const [displayCount, setDisplayCount] = useState(MOVIES_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);

  // Get genre names for filter dropdown
  const availableGenres = useMemo(() => {
    return genres.map(g => g.name).sort();
  }, [genres]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    let filtered = allMovies;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      const genreId = genres.find(g => g.name === selectedGenre)?.id;
      if (genreId) {
        filtered = filtered.filter(movie =>
          movie.genre_ids?.includes(genreId)
        );
      }
    }

    setFilteredMovies(filtered);
    setDisplayCount(MOVIES_PER_PAGE); // Reset display count when filters change
  }, [searchQuery, selectedGenre, allMovies, genres]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load genres first
      const genresData = await movieApi.getGenres();
      setGenres(genresData.genres);
      
      // Load movies
      const moviesData = await movieApi.getMovies();
      
      if (moviesData.results && Array.isArray(moviesData.results)) {
        setAllMovies(moviesData.results);
        setFilteredMovies(moviesData.results);
      } else {
        setError('Invalid data format received from API');
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + MOVIES_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
  };

  const hasActiveFilters = searchQuery || selectedGenre;
  const hasMore = displayCount < filteredMovies.length;

  const getGridTitle = () => {
    if (searchQuery && selectedGenre) {
      return `${selectedGenre} Movies - Search Results (${filteredMovies.length})`;
    } else if (searchQuery) {
      return `Search Results (${filteredMovies.length})`;
    } else if (selectedGenre) {
      return `${selectedGenre} Movies (${filteredMovies.length})`;
    } else {
      return 'Popular Movies';
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <Hero>
          <Title>The Ultimate Movie Collection</Title>
          <Subtitle>
            Discover the most popular movies • Powered by The Movie Database
          </Subtitle>
          <SearchBar onSearch={handleSearch} />
        </Hero>

        {!loading && (
          <FiltersSection>
            <GenreFilter 
              genres={availableGenres}
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
            />
            
            {hasActiveFilters && (
              <ActiveFilters>
                {searchQuery && (
                  <FilterTag>
                    Search: "{searchQuery}"
                    <ClearButton onClick={() => setSearchQuery('')}>×</ClearButton>
                  </FilterTag>
                )}
                {selectedGenre && (
                  <FilterTag>
                    Genre: {selectedGenre}
                    <ClearButton onClick={() => setSelectedGenre('')}>×</ClearButton>
                  </FilterTag>
                )}
                <ClearButton 
                  onClick={clearFilters}
                  style={{ 
                    textDecoration: 'underline', 
                    fontSize: '14px',
                    color: '#e50914'
                  }}
                >
                  Clear All Filters
                </ClearButton>
              </ActiveFilters>
            )}
          </FiltersSection>
        )}

        {loading && (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {!loading && !error && (
          <MovieGrid 
            movies={filteredMovies} 
            displayCount={displayCount}
            title={getGridTitle()}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loadingMore}
            // genres={genres}
          />
        )}
      </Container>
    </PageContainer>
  );
}