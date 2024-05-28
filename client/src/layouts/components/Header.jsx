import styled from 'styled-components';

import { HeaderMain } from '~/features/header';
import { flexCenter } from '~/styles/reuseStyles';

function Header() {
  return (
    <StyledHeader>
      <HeaderMain />
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  height: 8rem;
  background-color: #171717;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 997;
  ${flexCenter}
`;

export default Header;
