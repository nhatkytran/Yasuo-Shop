import styled from 'styled-components';

import { HeaderMenuProvider } from '~/contexts';
import { HeaderMain, HeaderMenu } from '~/features/header';
import { flexCenter } from '~/styles/reuseStyles';

function Header() {
  return (
    <StyledHeader>
      <HeaderMenuProvider>
        <HeaderMain />
        <HeaderMenu />
      </HeaderMenuProvider>
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
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  ${flexCenter};
`;

export default Header;
