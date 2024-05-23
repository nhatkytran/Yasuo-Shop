import styled, { css } from 'styled-components';

const HeadingUI = styled.h1`
  font-family: RiotSans-Bold, monospace, sans-serif;
  line-height: 1.2;

  ${props =>
    props.as === 'h2' &&
    css`
      font-size: 4.8rem;
      margin: 2rem 0 2.4rem;
    `}
`;

export default HeadingUI;
