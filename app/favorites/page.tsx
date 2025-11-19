// app/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { storage } from '../lib/storage';
import { FavoriteMovie } from '../types/movie';
import Navbar from '../components/Navbar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
`;

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin: 0;
`;

const ClearButton = styled.button`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: #e50914;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const Card = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 150%;
  overflow: hidden;
  background: #2a2a2a;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(229, 9, 20, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    background: #ff0a16;
  }
`;

const Info = styled.div`
  padding: 15px;
  background: #1a1a1a;
`;

const MovieTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #999;
`;

const Year = styled.span`
  color: #999;
`;

const Rating = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffd700;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
`;

const EmptyText = styled.p`
  font-size: 24px;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

const EmptySubtext = styled.p`
  font-size: 16px;
  margin: 0 0 32px 0;
  color: #666;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  background: #e50914;
  color: #fff;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #ff0a16;
    transform: translateY(-2px);
  }
`;

const Count = styled.p`
  color: #999;
  font-size: 16px;
  margin: 0 0 24px 0;
`;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = storage.getFavorites();
    // Sort by most recently added
    setFavorites(favs.sort((a, b) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    ));
  };

  const handleRemove = (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();
    e.stopPropagation();
    storage.removeFavorite(movieId);
    loadFavorites();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      storage.clearFavorites();
      loadFavorites();
    }
  };

  if (favorites.length === 0) {
    return (
      <PageContainer>
        <Navbar />
        <Container>
          <EmptyState>
            <EmptyIcon>💔</EmptyIcon>
            <EmptyText>No Favorites Yet</EmptyText>
            <EmptySubtext>
              Start adding movies to your favorites to see them here
            </EmptySubtext>
            <BrowseButton href="/">
              Browse Movies
            </BrowseButton>
          </EmptyState>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <Header>
          <div>
            <Title>My Favorites</Title>
            <Count>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}</Count>
          </div>
          <ClearButton onClick={handleClearAll}>
            Clear All
          </ClearButton>
        </Header>

        <Grid>
          {favorites.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/movies/${movie.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card>
                <RemoveButton 
                  onClick={(e) => handleRemove(e, movie.id)}
                  aria-label="Remove from favorites"
                >
                  ✕
                </RemoveButton>
                
                <ImageContainer>
                  <Image 
                    src={movie.image} 
                    alt={movie.title}
                    loading="lazy"
                  />
                </ImageContainer>
                
                <Info>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <Meta>
                    <Year>{movie.year}</Year>
                    <Rating>
                      ⭐ {movie.rating?.toFixed(1)}
                    </Rating>
                  </Meta>
                </Info>
              </Card>
            </Link>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
}