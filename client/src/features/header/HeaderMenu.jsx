import styled from 'styled-components';

import { TYPE_ART, TYPE_FEATURED } from '~/config';
import { useHeaderMenu } from '~/hooks';
import { HeaderMenuCategory, HeaderMenuFeatured } from '~/features/header';
import { flexCenter } from '~/styles/reuseStyles';

function HeaderMenu() {
  const { openName, closeHeaderMenu } = useHeaderMenu();

  if (!openName) return null;

  return (
    <StyledHeaderMenu onMouseLeave={closeHeaderMenu}>
      <MenuBoxUI>
        {openName === TYPE_FEATURED && <HeaderMenuFeatured />}
        {openName === TYPE_ART && <HeaderMenuCategory />}
      </MenuBoxUI>
    </StyledHeaderMenu>
  );
}

const StyledHeaderMenu = styled.div`
  width: 100%;
  background-color: #282828;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  z-index: -1;
  animation: 0.15s cubic-bezier(0.42, 0, 0.002, 1) 0s 1 normal none running open;
`;

const MenuBoxUI = styled.div`
  max-width: var(--width-main-layout);
  min-height: 32rem;
  margin: 0 auto;
  padding: 0 2rem;
  ${flexCenter};
`;
export default HeaderMenu;
