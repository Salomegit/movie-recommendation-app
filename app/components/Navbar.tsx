// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #333;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #e50914;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#fff' : '#999'};
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #e50914;
    transform: scaleX(${props => props.$isActive ? 1 : 0});
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Nav>
      <Container>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo>
            🎬 MovieHub
          </Logo>
        </Link>
        
        <NavLinks>
          <NavLink href="/" $isActive={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/favorites" $isActive={pathname === '/favorites'}>
            Favorites
          </NavLink>
        </NavLinks>
      </Container>
    </Nav>
  );
}