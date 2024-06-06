import styled from 'styled-components';

import {
  HeaderSidebarSubmenuCategory,
  // HeaderSidebarSubmenuFeatured,
} from '~/features/header';

function HeaderSidebarSubmenu() {
  return (
    <StyledHeaderSidebarSubmenu>
      {/* <HeaderSidebarSubmenuFeatured /> */}
      <HeaderSidebarSubmenuCategory />
    </StyledHeaderSidebarSubmenu>
  );
}

const StyledHeaderSidebarSubmenu = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #737373;
`;

export default HeaderSidebarSubmenu;
