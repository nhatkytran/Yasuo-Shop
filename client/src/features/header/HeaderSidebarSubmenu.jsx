import styled from 'styled-components';

import { TYPE_FEATURED } from '~/config';
import { useHeaderSidebar } from '~/hooks';

import {
  HeaderSidebarSubmenuCategory,
  HeaderSidebarSubmenuFeatured,
} from '~/features/header';

function HeaderSidebarSubmenu() {
  const { sidebarSubmenuName, closeHeaderSidebar } = useHeaderSidebar();

  if (!sidebarSubmenuName) return <StyledHeaderSidebarSubmenu />;

  return (
    <StyledHeaderSidebarSubmenu
      onClick={event => event.target.closest('a') && closeHeaderSidebar()}
    >
      {sidebarSubmenuName === TYPE_FEATURED && <HeaderSidebarSubmenuFeatured />}
      {sidebarSubmenuName !== TYPE_FEATURED && <HeaderSidebarSubmenuCategory />}
    </StyledHeaderSidebarSubmenu>
  );
}

const StyledHeaderSidebarSubmenu = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #737373;
`;

export default HeaderSidebarSubmenu;
