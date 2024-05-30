import styled from 'styled-components';
import PropTypes from 'prop-types';

import { TYPE_ART, TYPE_FEATURED } from '~/config';
import { HeaderMenuCategory, HeaderMenuFeatured } from '~/features/header';

function HeaderMenu({ openName, onCloseMenu }) {
  return (
    <StyledHeaderMenu onMouseLeave={onCloseMenu}>
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
`;

const MenuBoxUI = styled.div`
  max-width: var(--width-main-layout);
  margin: 4rem auto;
  padding: 0 2rem;
`;

HeaderMenu.propTypes = {
  openName: PropTypes.string.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
};

export default HeaderMenu;
