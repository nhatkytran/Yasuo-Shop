import styled from 'styled-components';

import { AiOutlineCloseUI } from '~/ui';
import { useHeaderSidebar } from '~/hooks';
import { px924 } from '~/styles/GlobalStyles';

function HeaderSidebarToggle() {
  const { isSidebarOpened, openHeaderSidebar, closeHeaderSidebar } =
    useHeaderSidebar();

  return (
    <StyledHeaderSidebarToggle>
      {!isSidebarOpened && (
        <svg
          onClick={openHeaderSidebar}
          width="22"
          height="11"
          viewBox="0 0 22 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Menu Icon"
        >
          <rect y="8.62109" width="22" height="2" fill="white"></rect>
          <rect y="0.621094" width="22" height="2" fill="white"></rect>
        </svg>
      )}

      {isSidebarOpened && (
        <AiOutlineCloseUI $color="white" onClick={closeHeaderSidebar} />
      )}
    </StyledHeaderSidebarToggle>
  );
}

const StyledHeaderSidebarToggle = styled.button`
  display: none;
  cursor: pointer;

  @media only screen and (max-width: ${px924}) {
    display: block;
  }

  svg {
    width: 2.3rem;
    height: 2.3rem;
  }
`;

export default HeaderSidebarToggle;
