// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 800;
  color: #e50914;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#e50914' : '#fff'};
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  font-size: 15px;
  transition: all 0.3s ease;
  background: ${props => props.$isActive ? 'rgba(229, 9, 20, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(229, 9, 20, 0.3)' : 'transparent'};
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(229, 9, 20, 0.1);
    color: #e50914;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 13px;
    
    span {
      display: none;
    }
  }
`;

const Icon = styled.span`
  font-size: 18px;
`;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Nav>
      <Container>
        <Logo href="/">
          🎬 MovieHub
        </Logo>
        <NavLinks>
          <NavLink href="/" $isActive={pathname === '/'}>
            <Icon>🏠</Icon>
            <span>Home</span>
          </NavLink>
          {/* <NavLink href="/popular" $isActive={pathname === '/popular'}>
            <Icon>🔥</Icon>
            <span>Popular</span>
          </NavLink> */}
          <NavLink href="/recommendations" $isActive={pathname === '/recommendations'}>
            <Icon>🎯</Icon>
            <span>For You</span>
          </NavLink>
          <NavLink href="/favorites" $isActive={pathname === '/favorites'}>
            <Icon>❤️</Icon>
            <span>Favorites</span>
          </NavLink>
        </NavLinks>
      </Container>
    </Nav>
  );
}