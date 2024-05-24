import styled, { css } from 'styled-components';
import { px1024, px624 } from '~/styles/GlobalStyles';

const HeadingUI = styled.h1`
  font-family: var(--font-riotsans-bold);
  line-height: 1.2;

  ${props =>
    props.as === 'h2' &&
    css`
      font-size: 4.8rem;
      margin: 2rem 0 2.4rem;

      @media only screen and (max-width: ${px1024}) {
        font-size: 4rem;
      }

      @media only screen and (max-width: ${px624}) {
        font-size: 3.2rem;
      }
    `}
`;

export default HeadingUI;
