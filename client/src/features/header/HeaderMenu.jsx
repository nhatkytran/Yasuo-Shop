import styled from 'styled-components';

import { HeaderMenuFeatured } from '~/features/header';

function HeaderMenu() {
  return (
    <StyledHeaderMenu>
      <MenuBoxUI>
        <HeaderMenuFeatured />
      </MenuBoxUI>
    </StyledHeaderMenu>
  );
}

const StyledHeaderMenu = styled.div`
  width: 100vw;
  background-color: #282828;
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  z-index: -1;
`;

const MenuBoxUI = styled.div`
  width: var(--width-main-layout);
  background-color: red;
  margin: 4rem auto;
  padding: 0 2rem;
`;

export default HeaderMenu;
