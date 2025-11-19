// app/recommendations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { movieApi } from '../lib/api';
import { storage } from '../lib/storage';
import { MovieTM, Genre } from '../types/movie';
import { 
  getRecommendationsFromFavorites,
  getTrendingRecommendations,
  RecommendationResult 
} from '../lib/recommendation';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';

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
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(229, 9, 20, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #999;
  margin: 0 0 20px 0;
`;

const EmptyLink = styled.a`
  color: #e50914;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
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

export default function RecommendationsPage() {
  const [allMovies, setAllMovies] = useState<MovieTM[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [personalizedRecs, setPersonalizedRecs] = useState<RecommendationResult[]>([]);
  const [trendingRecs, setTrendingRecs] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load genres
      const genresData = await movieApi.getGenres();
      setGenres(genresData.genres);

      // Load movies (get multiple pages for better recommendations)
      const page1 = await movieApi.getMovies(1);
      const page2 = await movieApi.getMovies(2);
      const page3 = await movieApi.getMovies(3);
      
      const allMoviesData = [
        ...page1.results,
        ...page2.results,
        ...page3.results
      ];
      
      if (!Array.isArray(allMoviesData)) {
        setError('Invalid data format received from API');
        return;
      }

      setAllMovies(allMoviesData);

      // Get user's favorites
      const favorites = storage.getFavorites();
      const favoriteIds = favorites.map(f => f.id);

      // Generate personalized recommendations
      if (favoriteIds.length > 0) {
        const personalized = getRecommendationsFromFavorites(
          favoriteIds,
          allMoviesData,
          genresData.genres,
          12
        );
        setPersonalizedRecs(personalized);
      }

      // Generate trending recommendations
      const trending = getTrendingRecommendations(allMoviesData, 12);
      setTrendingRecs(trending);

    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Container>
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Navbar />
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <Hero>
          <IconContainer>🎯</IconContainer>
          <Title>Recommended For You</Title>
          <Subtitle>
            Personalized picks based on your taste
          </Subtitle>
        </Hero>

        {/* Personalized Recommendations */}
        {personalizedRecs.length > 0 && (
          <Section>
            <SectionHeader>
              <div>
                <SectionTitle>
                  ❤️ Based On Your Favorites
                </SectionTitle>
                <SectionSubtitle>
                  Movies we think you'll love
                </SectionSubtitle>
              </div>
            </SectionHeader>
            <Grid>
              {personalizedRecs.map(({ movie }) => (
                <MovieCard key={movie.id} movie={movie} genres={genres} />
              ))}
            </Grid>
          </Section>
        )}

        {/* Empty state if no favorites */}
        {personalizedRecs.length === 0 && (
          <Section>
            <EmptyState>
              <EmptyIcon>💡</EmptyIcon>
              <EmptyText>
                Add movies to your favorites to get personalized recommendations!
              </EmptyText>
              <EmptyLink href="/">Browse Movies</EmptyLink>
            </EmptyState>
          </Section>
        )}

        {/* Trending Recommendations */}
        <Section>
          <SectionHeader>
            <div>
              <SectionTitle>
                🔥 Trending Now
              </SectionTitle>
              <SectionSubtitle>
                Popular picks from the community
              </SectionSubtitle>
            </div>
          </SectionHeader>
          <Grid>
            {trendingRecs.map(({ movie }) => (
              <MovieCard key={movie.id} movie={movie} genres={genres} />
            ))}
          </Grid>
        </Section>
      </Container>
    </PageContainer>
  );
}