// src/components/Header.tsx
import styled from 'styled-components';
import Logo from '../assets/logo.jpg';
import { Instagram, Phone } from 'lucide-react';

const Container = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  border-radius: 12px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-family: 'Rajdhani', sans-serif;
  color: ${(props) => props.theme.colors.primary};
  margin: 0.25rem 0;
`;

const IconRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
`;

const IconLink = styled.a`
  color: #fff;
  transition: color 0.3s;

  &:hover {
    color: #e50914;
  }
`;

export const Header = () => (
  <Container>
    <LogoImg src={Logo} alt="Logo VTR Studio Car" />

    <IconRow>
      <IconLink
        href="https://instagram.com/vtrstudiocar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <Instagram size={24} />
      </IconLink>

      <IconLink
        href="https://wa.me/5511975773175"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <Phone size={24} />
      </IconLink>
    </IconRow>
  </Container>
);
