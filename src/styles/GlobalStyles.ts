import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, #root {
    height: 100%;
    background-color: #000;
  }
`;
