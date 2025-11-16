// app/movies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { movieApi } from '../../lib/api';
import { storage } from '../../lib/storage';
import { Movie } from '../../types/movie';
import Navbar from '../../components/Navbar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Hero = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const PosterContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const InfoSection = styled.div`
  color: #fff;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const OriginalTitle = styled.p`
  font-size: 18px;
  color: #999;
  margin: 0 0 20px 0;
  font-style: italic;
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: ${props => props.$isFavorite ? '#e50914' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$isFavorite ? '#e50914' : '#333'};
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: scale(1.05);
    background: ${props => props.$isFavorite ? '#ff0a16' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
`;

const Rating = styled(MetaValue)`
  color: #ffd700;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #ccc;
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #fff;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
`;

const DetailTitle = styled.h3`
  font-size: 16px;
  color: #999;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.p`
  font-size: 16px;
  color: #fff;
  margin: 0;
  line-height: 1.6;
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

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadMovie(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (movie) {
      setIsFavorite(storage.isFavorite(movie.id));
    }
  }, [movie]);

  const loadMovie = async (id: string) => {
    try {
      setLoading(true);
      const data = await movieApi.getMovieDetails(id);
      setMovie(data);
    } catch (err) {
      console.error('Error loading movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite) {
      storage.removeFavorite(movie.id);
      setIsFavorite(false);
    } else {
      storage.addFavorite({
        id: movie.id,
        title: movie.primaryTitle,
        image: movie.primaryImage,
        rating: movie.averageRating,
        year: movie.startYear,
        savedAt: new Date().toISOString(),
      });
      setIsFavorite(true);
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

  if (!movie) {
    return (
      <PageContainer>
        <Navbar />
        <Container>
          <BackButton onClick={() => router.back()}>
            ← Back
          </BackButton>
          <p style={{ color: '#fff', textAlign: 'center' }}>Movie not found</p>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>

        <Hero>
          <PosterContainer>
            <Poster src={movie.primaryImage} alt={movie.primaryTitle} />
          </PosterContainer>

          <InfoSection>
            <TitleSection>
              <div>
                <Title>{movie.primaryTitle}</Title>
                {movie.originalTitle !== movie.primaryTitle && (
                  <OriginalTitle>{movie.originalTitle}</OriginalTitle>
                )}
              </div>
              <FavoriteButton 
                $isFavorite={isFavorite}
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </FavoriteButton>
            </TitleSection>

            <MetaInfo>
              <MetaItem>
                <MetaLabel>Rating</MetaLabel>
                <Rating>⭐ {movie.averageRating?.toFixed(1)}/10</Rating>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Votes</MetaLabel>
                <MetaValue>{movie.numVotes?.toLocaleString()}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Year</MetaLabel>
                <MetaValue>{movie.startYear}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Runtime</MetaLabel>
                <MetaValue>{movie.runtimeMinutes} min</MetaValue>
              </MetaItem>
              {movie.metascore && (
                <MetaItem>
                  <MetaLabel>Metascore</MetaLabel>
                  <MetaValue>{movie.metascore}/100</MetaValue>
                </MetaItem>
              )}
            </MetaInfo>

            <Description>{movie.description}</Description>

            {movie.genres && movie.genres.length > 0 && (
              <Section>
                <SectionTitle>Genres</SectionTitle>
                <TagList>
                  {movie.genres.map((genre) => (
                    <Tag key={genre}>{genre}</Tag>
                  ))}
                </TagList>
              </Section>
            )}
          </InfoSection>
        </Hero>

        <DetailGrid>
          {movie.productionCompanies && movie.productionCompanies.length > 0 && (
            <DetailCard>
              <DetailTitle>Production Companies</DetailTitle>
              <DetailValue>
                {movie.productionCompanies.map(c => c.name).join(', ')}
              </DetailValue>
            </DetailCard>
          )}

          {movie.countriesOfOrigin && movie.countriesOfOrigin.length > 0 && (
            <DetailCard>
              <DetailTitle>Countries</DetailTitle>
              <DetailValue>{movie.countriesOfOrigin.join(', ')}</DetailValue>
            </DetailCard>
          )}

          {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
            <DetailCard>
              <DetailTitle>Languages</DetailTitle>
              <DetailValue>{movie.spokenLanguages.join(', ')}</DetailValue>
            </DetailCard>
          )}

          {movie.contentRating && (
            <DetailCard>
              <DetailTitle>Content Rating</DetailTitle>
              <DetailValue>{movie.contentRating}</DetailValue>
            </DetailCard>
          )}

          {movie.budget && (
            <DetailCard>
              <DetailTitle>Budget</DetailTitle>
              <DetailValue>${movie.budget.toLocaleString()}</DetailValue>
            </DetailCard>
          )}

          {movie.grossWorldwide && (
            <DetailCard>
              <DetailTitle>Worldwide Gross</DetailTitle>
              <DetailValue>${movie.grossWorldwide.toLocaleString()}</DetailValue>
            </DetailCard>
          )}
        </DetailGrid>
      </Container>
    </PageContainer>
  );
}