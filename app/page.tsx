// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { movieApi } from '../app/lib/api';
import { Movie } from '../app/types/movie';
import Navbar from '../app/components/Navbar';
import SearchBar from '../app/components/SearchBar';
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

export default function Home() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [displayCount, setDisplayCount] = useState(MOVIES_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allMovies.filter(movie =>
        movie.primaryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMovies(filtered);
      setDisplayCount(MOVIES_PER_PAGE); // Reset display count on search
    } else {
      setFilteredMovies(allMovies);
    }
  }, [searchQuery, allMovies]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieApi.getTop250Movies();
      
      // The API returns an array directly
      if (Array.isArray(data)) {
        setAllMovies(data);
        setFilteredMovies(data);
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
    // Simulate a slight delay for better UX
    setTimeout(() => {
      setDisplayCount(prev => prev + MOVIES_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const hasMore = displayCount < filteredMovies.length;

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <Hero>
          <Title>Discover Amazing Movies</Title>
          <Subtitle>
            Browse through the top-rated movies of all time
          </Subtitle>
          <SearchBar onSearch={handleSearch} />
        </Hero>

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
            title={searchQuery ? `Search Results (${filteredMovies.length})` : 'Top 250 Movies'}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loadingMore}
          />
        )}
      </Container>
    </PageContainer>
  );
}