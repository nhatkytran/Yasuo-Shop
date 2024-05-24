import styled from 'styled-components';

function Header() {
  return <StyledHeader>Header</StyledHeader>;
}

const StyledHeader = styled.header`
  height: 8rem;
  background-color: var(--color-neutral-900);
  color: var(--color-neutral-100);
`;

export default Header;
