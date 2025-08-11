import styled from 'styled-components';
import bgImage from '../assets/carback2.png'; 
export const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), 
    url(${bgImage}) no-repeat center;
  background-size: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  font-family: 'Rajdhani', sans-serif;
`;