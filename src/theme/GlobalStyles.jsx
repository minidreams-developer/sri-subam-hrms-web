import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Metropolis-Thin';
    src: url('/fonts/Metropolis-Thin.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-ThinItalic';
    src: url('/fonts/Metropolis-ThinItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-ExtraLight';
    src: url('/fonts/Metropolis-ExtraLight.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-ExtraLightItalic';
    src: url('/fonts/Metropolis-ExtraLightItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-Light';
    src: url('/fonts/Metropolis-Light.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-LightItalic';
    src: url('/fonts/Metropolis-LightItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-Regular';
    src: url('/fonts/Metropolis-Regular.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-RegularItalic';
    src: url('/fonts/Metropolis-RegularItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-Medium';
    src: url('/fonts/Metropolis-Medium.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-MediumItalic';
    src: url('/fonts/Metropolis-MediumItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-SemiBold';
    src: url('/fonts/Metropolis-SemiBold.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-SemiBoldItalic';
    src: url('/fonts/Metropolis-SemiBoldItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-Bold';
    src: url('/fonts/Metropolis-Bold.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-BoldItalic';
    src: url('/fonts/Metropolis-BoldItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-ExtraBold';
    src: url('/fonts/Metropolis-ExtraBold.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-ExtraBoldItalic';
    src: url('/fonts/Metropolis-ExtraBoldItalic.otf') format('opentype');
    font-style: italic;
  }

  @font-face {
    font-family: 'Metropolis-Black';
    src: url('/fonts/Metropolis-Black.otf') format('opentype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Metropolis-BlackItalic';
    src: url('/fonts/Metropolis-BlackItalic.otf') format('opentype');
    font-style: italic;
  }

  body {
    font-family: 'Metropolis-Regular', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f5f5f5;
  }
`;

export default GlobalStyles;