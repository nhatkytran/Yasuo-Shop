import { createGlobalStyle } from 'styled-components';

export const px1024 = '64em';
export const px924 = '57.75em';
export const px624 = '39em';
export const px524 = '32.75em';

const GlobalStyles = createGlobalStyle`
  :root {
    &, &.light-mode {
    --color-black: #000;
    --color-white: #fff;

    --color-neutral-50: #fafafa;
    --color-neutral-100: #f5f5f5;
    --color-neutral-200: #e5e5e5;
    --color-neutral-300: #d4d4d4;
    --color-neutral-400: #a3a3a3;
    --color-neutral-500: #737373;
    --color-neutral-600: #525252;
    --color-neutral-700: #404040;
    --color-neutral-800: #262626;
    --color-neutral-900: #171717;

    --color-red-50: #fef2f2;
    --color-red-100: #fee2e2;
    --color-red-200: #fecaca;
    --color-red-300: #fca5a5;
    --color-red-400: #f87171;
    --color-red-500: #ef4444;
    --color-red-600: #dc2626;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;
    --color-red-900: #7f1d1d;

    --backdrop-color: rgba(255, 255, 255, 0.1);

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
    
    --image-grayscale: 0;
    --image-opacity: 100%;
    }
    
    &.dark-mode {
      --color-black: #fff;
      --color-white: #000;

      --color-neutral-50: #171717;
      --color-neutral-100: #262626;
      --color-neutral-200: #404040;
      --color-neutral-300: #525252;
      --color-neutral-400: #737373;
      --color-neutral-500: #a3a3a3;
      --color-neutral-600: #d4d4d4;
      --color-neutral-700: #e5e5e5;
      --color-neutral-800: #f5f5f5;
      --color-neutral-900: #fafafa;

      --color-red-50: #7f1d1d;
      --color-red-100: #991b1b;
      --color-red-200: #b91c1c;
      --color-red-300: #dc2626;
      --color-red-400: #ef4444;
      --color-red-500: #f87171;
      --color-red-600: #fca5a5;
      --color-red-700: #fecaca;
      --color-red-800: #fee2e2;
      --color-red-900: #fef2f2;

      --backdrop-color: rgba(0, 0, 0, 0.3);

      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
      --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

      --image-grayscale: 10%;
      --image-opacity: 90%;
    }

    --width-main-layout: 110rem;
    --width-sub-layout: 60rem;

    --px-1024: 64em;

    --font-sono: Sono, monospace, sans-serif;
    --font-poppins: Poppins, monospace, sans-serif;

    --font-riotsans-bold: RiotSans-Bold, monospace, sans-serif;
    --font-riotsans-regular: RiotSans-Regular, monospace, sans-serif;

    --font-inter-bold: Inter-Bold, monospace, sans-serif;
    --font-inter-medium: Inter-Medium, monospace, sans-serif;
    --font-inter-light: Inter-Light, monospace, sans-serif;
    
    --border-radius-tiny: 3px;
    --border-radius-sm: 5px;
    --border-radius-md: 7px;
    --border-radius-lg: 9px;
  }

  @font-face {
    font-family: RiotSans-Bold;
    src: url('/fonts/RiotSans-Bold.woff2');
    font-display: fallback;
  }

  @font-face {
    font-family: RiotSans-Regular;
    src: url('/fonts/RiotSans-Regular.woff2');
    font-display: fallback;
  }

  @font-face {
    font-family: Inter-Bold;
    src: url('/fonts/Inter-Bold.woff2');
    font-display: fallback;
  }

  @font-face {
    font-family: Inter-Medium;
    src: url('/fonts/Inter-Medium.woff2');
    font-display: fallback;
  }

  @font-face {
    font-family: Inter-Light;
    src: url('/fonts/Inter-Light.woff2');
    font-display: fallback;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    transition: background-color 0.3s, border 0.3s; /* Creating animations for dark mode */
  }

  html {
    font-size: 62.5%;
  }

  body {
    min-height: 100vh;
    background-color: var(--color-neutral-100);
    color: var(--color-grey-800);
    font-family: var(--font-inter-regular);
    font-size: 1.6rem;
    line-height: 1.5;
    transition: color 0.3s, background-color 0.3s;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar {
      width: 0.6rem;
    }
    &::-webkit-scrollbar-track {
      background-color: var(--color-neutral-400);
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--color-neutral-500);
      box-shadow: 0 3px 13px 1px rgba(0, 0, 0, 0.12);
      -webkit-box-shadow: 0 3px 13px 1px rgba(0, 0, 0, 0.12);
    }
  }

  *:disabled {
    cursor: not-allowed;
  }

  button, input {
    outline: none;
    border: none;
    background-color: transparent;
  }

  img {
    max-width: 100%;

    /* For dark mode */
    filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
  }

  @keyframes open {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default GlobalStyles;
