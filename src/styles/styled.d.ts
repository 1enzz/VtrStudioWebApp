import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      muted: string;
      success: string;
      danger: string;
      white: string;
    };
  }
}
