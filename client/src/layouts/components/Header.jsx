import styled from 'styled-components';
import { useDarkMode } from '~/hooks';

function Header() {
  const { toggleDarkMode } = useDarkMode();

  return <StyledHeader onClick={toggleDarkMode}>Header</StyledHeader>;
}

const StyledHeader = styled.header`
  height: 8rem;
  background-color: var(--color-neutral-900);
  color: var(--color-neutral-100);
`;

export default Header;
