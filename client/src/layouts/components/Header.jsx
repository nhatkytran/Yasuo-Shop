import styled from 'styled-components';

import { flexCenter } from '~/styles/reuseStyles';
// import HeaderSearchMenu from '~/features/header/HeaderSearchMenu';
import { px924 } from '~/styles/GlobalStyles';

import {
  HeaderMenuProvider,
  HeaderSearchProvider,
  HeaderSidebarProvider,
} from '~/contexts';

import {
  HeaderMain,
  HeaderMenu,
  HeaderSearchSidebar,
  HeaderSidebar,
} from '~/features/header';

function Header() {
  return (
    <StyledHeader>
      <HeaderMenuProvider>
        <HeaderSidebarProvider>
          <HeaderSearchProvider>
            <HeaderMain />

            <HeaderMenu />
            {/* <HeaderSearchMenu /> */}

            <HeaderSidebar />
            <HeaderSearchSidebar />
          </HeaderSearchProvider>
        </HeaderSidebarProvider>
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

  @media only screen and (max-width: ${px924}) {
    height: 6rem;
  }
`;

export default Header;
