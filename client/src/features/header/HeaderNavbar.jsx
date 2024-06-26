import styled from 'styled-components';

import { useHeaderMenu } from '~/hooks';
import { navbarLinks } from '~/dataUI/header';
import { flexStart } from '~/styles/reuseStyles';
import { HeaderNavbarItem } from '~/features/header';
import { px924 } from '~/styles/GlobalStyles';

function HeaderNavbar() {
  const { openHeaderMenu, closeHeaderMenu } = useHeaderMenu();

  return (
    <StyledHeaderNavbar>
      <ListUI>
        {navbarLinks.map((navbarLink, index) => (
          <HeaderNavbarItem
            key={index}
            navbarLink={navbarLink}
            onOpenMenu={openHeaderMenu}
            onCloseMenu={closeHeaderMenu}
          />
        ))}
      </ListUI>
    </StyledHeaderNavbar>
  );
}

const StyledHeaderNavbar = styled.div`
  flex: 1;
  height: 100%;
  padding-left: 6rem;
  position: relative;

  @media only screen and (max-width: ${px924}) {
    display: none;
  }
`;

const ListUI = styled.ul`
  height: 100%;
  list-style: none;
  ${flexStart};
`;

export default HeaderNavbar;
