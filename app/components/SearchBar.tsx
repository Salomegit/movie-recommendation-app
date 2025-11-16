// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 50px 16px 20px;
  font-size: 16px;
  border: 2px solid #333;
  border-radius: 50px;
  background: #1a1a1a;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #e50914;
    box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
  }

  &::placeholder {
    color: #666;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #e50914;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff0a16;
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 56px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

export default function SearchBar({ onSearch, placeholder = 'Search movies...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        {query && (
          <ClearButton type="button" onClick={handleClear}>
            ✕
          </ClearButton>
        )}
        <SearchButton type="submit">
          🔍
        </SearchButton>
      </form>
    </SearchContainer>
  );
}