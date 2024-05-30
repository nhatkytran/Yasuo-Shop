import styled from 'styled-components';

import { Menu } from '~/components';
import { HeaderMain, HeaderMenu } from '~/features/header';
import { flexCenter } from '~/styles/reuseStyles';

function Header() {
  return (
    <StyledHeader>
      <Menu>
        <Menu.Open
          render={open => <HeaderMain onOpenMenu={open} />}
        ></Menu.Open>
        <Menu.Window
          render={(openName, close) => (
            <HeaderMenu openName={openName} onCloseMenu={close} />
          )}
        ></Menu.Window>
      </Menu>
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
