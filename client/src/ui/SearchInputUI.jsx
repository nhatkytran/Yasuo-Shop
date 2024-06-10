import styled, { css } from 'styled-components';

const styles = {
  menu: css`
    width: 10.2rem;
  `,
  sidebar: css`
    width: 100%;
  `,
};

const SearchInputUI = styled.input`
  background-color: transparent;
  color: #fff;
  font-family: var(--font-inter-bold);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props => styles[props.$type]};

  &::placeholder {
    color: #a3a3a3;
  }
`;

export default SearchInputUI;
