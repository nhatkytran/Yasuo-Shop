import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const colors = {
  main: css`
    color: #fff;
  `,
  ribbon: css`
    color: #f5f5f5;
  `,
};

const LinkFooterUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    ${props => colors[props.$type]};
    font-family: var(--font-inter-medium);
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 1px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default LinkFooterUI;
