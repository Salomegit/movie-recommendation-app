'use client';

import { useState } from 'react';
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

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 60px;
  }
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
  flex-shrink: 0;
  z-index: 101;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    box-shadow: ${props => props.$isOpen ? '-5px 0 20px rgba(0, 0, 0, 0.5)' : 'none'};
    border-left: 1px solid rgba(255, 255, 255, 0.1);
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
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: rgba(229, 9, 20, 0.1);
    color: #e50914;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 200px;
    padding: 16px 24px;
    font-size: 18px;
    justify-content: flex-start;
    
    &:hover {
      transform: translateX(-5px);
    }
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const BurgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
  position: relative;
  width: 40px;
  height: 40px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }
`;

const BurgerLine = styled.span<{ $isOpen: boolean; $position: 'top' | 'middle' | 'bottom' }>`
  width: 28px;
  height: 3px;
  background: ${props => props.$isOpen ? '#e50914' : '#fff'};
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;

  ${props => props.$position === 'top' && props.$isOpen && `
    transform: translateY(9px) rotate(45deg);
  `}

  ${props => props.$position === 'middle' && props.$isOpen && `
    opacity: 0;
    transform: translateX(20px);
  `}

  ${props => props.$position === 'bottom' && props.$isOpen && `
    transform: translateY(-9px) rotate(-45deg);
  `}
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: ${props => props.$isOpen ? '1' : '0'};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 99;
  }
`;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <Nav>
        <Container>
          <Logo href="/" onClick={closeMenu}>
            🎬 MovieHub
          </Logo>
          
          <BurgerButton 
            onClick={toggleMenu} 
            $isOpen={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <BurgerLine $isOpen={isOpen} $position="top" />
            <BurgerLine $isOpen={isOpen} $position="middle" />
            <BurgerLine $isOpen={isOpen} $position="bottom" />
          </BurgerButton>

          <NavLinks $isOpen={isOpen}>
            <NavLink 
              href="/" 
              $isActive={pathname === '/'}
              onClick={closeMenu}
            >
              <Icon>🏠</Icon>
              <span>Home</span>
            </NavLink>
            <NavLink 
              href="/recommendations" 
              $isActive={pathname === '/recommendations'}
              onClick={closeMenu}
            >
              <Icon>🎯</Icon>
              <span>For You</span>
            </NavLink>
            <NavLink 
              href="/favorites" 
              $isActive={pathname === '/favorites'}
              onClick={closeMenu}
            >
              <Icon>❤️</Icon>
              <span>Favorites</span>
            </NavLink>
          </NavLinks>
        </Container>
      </Nav>
      <Overlay $isOpen={isOpen} onClick={closeMenu} />
    </>
  );
}