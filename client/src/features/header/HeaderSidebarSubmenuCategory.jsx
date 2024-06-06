import styled from 'styled-components';

import { menuContents } from '~/dataUI/header';
import { MenuCategoryLinks } from '~/components';
import { useHeaderSidebar } from '~/hooks';

function HeaderSidebarSubmenuCategory() {
  const { sidebarSubmenuName } = useHeaderSidebar();
  const { mainLink, subLink } = menuContents[sidebarSubmenuName];

  return (
    <StyledHeaderSidebarSubmenuCategory>
      <MenuCategoryLinks mainLink={mainLink} subLink={subLink} />
    </StyledHeaderSidebarSubmenuCategory>
  );
}

const StyledHeaderSidebarSubmenuCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export default HeaderSidebarSubmenuCategory;
