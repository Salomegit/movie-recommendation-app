// app/popular/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { movieApi } from '../lib/api';
import { Movie } from '../types/movie';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';

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

const IconContainer = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
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
  margin: 0 0 30px 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 120px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
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

export default function PopularMoviesPage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayCount, setDisplayCount] = useState(MOVIES_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieApi.getMostPopularMovies();
      
      if (Array.isArray(data)) {
        setAllMovies(data);
      } else {
        setError('Invalid data format received from API');
      }
    } catch (err) {
      console.error('Error loading popular movies:', err);
      setError('Failed to load popular movies. Please check your API configuration.');
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

  const hasMore = displayCount < allMovies.length;
  const totalMovies = allMovies.length;
  const avgRating = totalMovies > 0 
    ? (allMovies.reduce((sum, m) => sum + (m.averageRating || 0), 0) / totalMovies).toFixed(1)
    : '0.0';

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <Hero>
          <IconContainer>🌟</IconContainer>
          <Title>Most Popular Movies</Title>
          <Subtitle>
            Trending now • What everyone's watching
          </Subtitle>
          <StatsBar>
            <StatItem>
              <StatValue>{totalMovies}</StatValue>
              <StatLabel>Movies</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>⭐ {avgRating}</StatValue>
              <StatLabel>Avg Rating</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>🔥</StatValue>
              <StatLabel>Trending</StatLabel>
            </StatItem>
          </StatsBar>
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
            movies={allMovies} 
            displayCount={displayCount}
            title={`Popular Movies (${allMovies.length})`}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loadingMore}
          />
        )}
      </Container>
    </PageContainer>
  );
}