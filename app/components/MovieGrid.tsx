// components/MovieGrid.tsx
'use client';

import styled from 'styled-components';
import { MovieTM } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: MovieTM[];
  title?: string;
  displayCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

const Section = styled.section`
  margin-bottom: 50px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px 0;
  padding-left: 4px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin: 0 0 20px 0;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin: 0 0 16px 0;
    padding-left: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;

  /* Large Desktop - 5 columns */
  @media (min-width: 1400px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 28px;
  }

  /* Desktop - 4-5 columns */
  @media (min-width: 1024px) and (max-width: 1399px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }

  /* Tablet Landscape - 4 columns */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  /* Tablet Portrait - 3 columns */
  @media (min-width: 640px) and (max-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* Mobile Large - 3 columns */
  @media (min-width: 480px) and (max-width: 639px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  /* Mobile Medium - 2 columns */
  @media (min-width: 360px) and (max-width: 479px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* Mobile Small - 2 columns */
  @media (max-width: 359px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 32px;
  }

  @media (max-width: 480px) {
    margin-top: 24px;
  }
`;

const LoadMoreButton = styled.button`
  background: #e50914;
  color: #fff;
  border: none;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;

  &:hover {
    background: #f40612;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(229, 9, 20, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 12px 32px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 28px;
    font-size: 14px;
    width: 100%;
    max-width: 280px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;

  @media (max-width: 768px) {
    padding: 48px 20px;
  }

  @media (max-width: 480px) {
    padding: 40px 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 56px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 48px;
    margin-bottom: 10px;
  }
`;

const EmptyText = styled.p`
  font-size: 18px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid #333;
  border-top: 3px solid #e50914;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
`;

export default function MovieGrid({ 
  movies, 
  title, 
  displayCount, 
  onLoadMore, 
  hasMore = false,
  loading = false 
}: MovieGridProps) {
  const displayedMovies = displayCount ? movies.slice(0, displayCount) : movies;

  if (movies.length === 0) {
    return (
      <Section>
        {title && <SectionTitle>{title}</SectionTitle>}
        <EmptyState>
          <EmptyIcon>🎬</EmptyIcon>
          <EmptyText>No movies found</EmptyText>
        </EmptyState>
      </Section>
    );
  }

  return (
    <Section>
      {title && <SectionTitle>{title}</SectionTitle>}
      <Grid>
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Grid>
      
      {hasMore && onLoadMore && (
        <LoadMoreContainer>
          <LoadMoreButton onClick={onLoadMore} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Load More Movies'}
          </LoadMoreButton>
        </LoadMoreContainer>
      )}
    </Section>
  );
}