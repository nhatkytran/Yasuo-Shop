import styled from 'styled-components';

import { HeaderMenuBoxUI, HeaderMenuUI } from '~/ui';
import { px1024 } from '~/styles/GlobalStyles';

import {
  HeaderSearchMenuLinks,
  HeaderSearchMenuProducts,
} from '~/features/header';

function HeaderSearchMenu() {
  return (
    <HeaderMenuUI>
      <HeaderMenuBoxUI $minHeight="40rem">
        <StyledHeaderSearchMenu>
          <HeaderSearchMenuProducts />
          <HeaderSearchMenuLinks />
        </StyledHeaderSearchMenu>
      </HeaderMenuBoxUI>
    </HeaderMenuUI>
  );
}

const StyledHeaderSearchMenu = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2.6fr 1fr;
  gap: 8rem;

  @media only screen and (max-width: ${px1024}) {
    gap: 6rem;
  }
`;

export default HeaderSearchMenu;
