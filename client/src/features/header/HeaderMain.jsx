import styled from 'styled-components';

import { flexBetween } from '~/styles/reuseStyles';
import { px924 } from '~/styles/GlobalStyles';

import {
  HeaderActions,
  HeaderLogo,
  HeaderNavbar,
  HeaderSidebarToggle,
  HeaderToAuth,
} from '~/features/header';

function HeaderMain() {
  return (
    <StyledHeaderMain>
      <HeaderLogo />

      <HeaderMainUI>
        <HeaderSidebarToggle />
        <HeaderNavbar />
        <HeaderActions />
      </HeaderMainUI>

      <HeaderToAuth />
    </StyledHeaderMain>
  );
}

const StyledHeaderMain = styled.div`
  width: 100%;
  max-width: calc(var(--width-main-layout) - 4rem);
  height: 100%;
  margin: 0 10rem;
  position: relative;

  @media only screen and (max-width: ${px924}) {
    margin: 0 2rem;
  }
`;

const HeaderMainUI = styled.div`
  height: 100%;
  ${flexBetween};
`;

export default HeaderMain;
