// components/MovieCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Movie } from '../types/movie';
import { storage } from '../lib/storage';

interface MovieCardProps {
  movie: Movie;
}

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

  &:hover .overlay {
    opacity: 1;
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

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
`;

const Info = styled.div`
  padding: 15px;
  background: #1a1a1a;
`;

const Title = styled.h3`
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

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.$isFavorite ? '#e50914' : 'rgba(0,0,0,0.6)'};
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
    background: ${props => props.$isFavorite ? '#ff0a16' : 'rgba(0,0,0,0.8)'};
  }
`;

const OverlayContent = styled.div`
  color: #fff;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Genres = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Genre = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(storage.isFavorite(movie.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <Link href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <FavoriteButton 
          $isFavorite={isFavorite} 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </FavoriteButton>
        
        <ImageContainer>
          <Image 
            src={movie.primaryImage} 
            alt={movie.primaryTitle}
            loading="lazy"
          />
          <Overlay className="overlay">
            <OverlayContent>
              <Description>{movie.description}</Description>
              <Genres>
                {movie.genres?.slice(0, 3).map((genre) => (
                  <Genre key={genre}>{genre}</Genre>
                ))}
              </Genres>
            </OverlayContent>
          </Overlay>
        </ImageContainer>
        
        <Info>
          <Title>{movie.primaryTitle}</Title>
          <Meta>
            <Year>{movie.startYear}</Year>
            <Rating>
              ⭐ {movie.averageRating?.toFixed(1)}
            </Rating>
          </Meta>
        </Info>
      </Card>
    </Link>
  );
}