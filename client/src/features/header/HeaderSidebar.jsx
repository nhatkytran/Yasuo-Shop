import styled from 'styled-components';

import {
  HeaderSidebarFooter,
  HeaderSidebarMenu,
  HeaderSidebarSubmenu,
} from '~/features/header';

import { px924 } from '~/styles/GlobalStyles';

function HeaderSidebar() {
  return (
    <StyledHeaderSidebar>
      <HeaderSidebarMenu />
      <HeaderSidebarSubmenu />
      <HeaderSidebarFooter />
    </StyledHeaderSidebar>
  );
}

const StyledHeaderSidebar = styled.aside`
  display: none;
  position: fixed;
  left: 0;
  top: 6rem;
  bottom: 0;
  width: 100%;
  max-width: 46rem;
  background-color: #282828;
  padding: 2rem;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  @media only screen and (max-width: ${px924}) {
    display: block;
  }
`;

export default HeaderSidebar;
