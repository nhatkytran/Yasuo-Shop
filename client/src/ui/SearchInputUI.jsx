import styled, { css } from 'styled-components';

const SearchInputUI = styled.input`
  width: 100%;
  background-color: transparent;
  color: #fff;
  font-family: var(--font-inter-bold);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props =>
    props.$width &&
    css`
      width: ${props.$width};
    `};

  &::placeholder {
    color: #a3a3a3;
  }
`;

export default SearchInputUI;
