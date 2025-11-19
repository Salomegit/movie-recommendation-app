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
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px 0;
  padding-left: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  margin: 0;
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