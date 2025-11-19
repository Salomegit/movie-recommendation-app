// components/GenreFilter.tsx
'use client';

import styled from 'styled-components';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const FilterContainer = styled.div`
  margin-bottom: 30px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const FilterWrapper = styled.div`
  position: relative;
  max-width: 300px;
  margin: 0 auto;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 40px 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(229, 9, 20, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #e50914;
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: #1a1a1a;
    color: #fff;
    padding: 10px;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #999;
  font-size: 12px;
`;

export default function GenreFilter({ genres, selectedGenre, onGenreChange }: GenreFilterProps) {
  return (
    <FilterContainer>
      <FilterLabel>Filter by Genre</FilterLabel>
      <FilterWrapper>
        <Select 
          value={selectedGenre} 
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
        <SelectIcon>▼</SelectIcon>
      </FilterWrapper>
    </FilterContainer>
  );
}