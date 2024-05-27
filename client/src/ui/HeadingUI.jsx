import styled, { css } from 'styled-components';
import { px1024, px524, px624 } from '~/styles/GlobalStyles';

const HeadingUI = styled.h1`
  ${props =>
    props.as === 'h2' &&
    css`
      color: var(--color-black);
      font-family: var(--font-riotsans-bold);
      font-size: 4.8rem;
      line-height: 1.2;
      margin: 2rem 0 2.4rem;

      @media only screen and (max-width: ${px1024}) {
        font-size: 4rem;
      }

      @media only screen and (max-width: ${px624}) {
        font-size: 3.2rem;
      }
    `}

  ${props =>
    props.as === 'h4' &&
    css`
      color: var(--color-black);
      font-family: var(--font-riotsans-regular);
      font-size: 2.4rem;

      @media only screen and (max-width: ${px524}) {
        font-size: 2rem;
      }
    `}

  ${props =>
    props.as === 'h5' &&
    css`
      color: #737373;
      font-family: var(--font-riotsans-regular);
      font-size: 1.4rem;
      margin-bottom: 2.5rem;
      line-height: 1.2;
    `}

    ${props =>
    props.as === 'h6' &&
    css`
      color: var(--color-black);
      font-family: var(--font-riotsans-bold);
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1.5rem;
    `}
`;

export default HeadingUI;
