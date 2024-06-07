import styled from 'styled-components';

import { HeaderMenuBoxUI, HeaderMenuUI } from '~/ui';
import { px1024 } from '~/styles/GlobalStyles';
// import { Loader } from '~/components';

import {
  HeaderSearchMenuLinks,
  HeaderSearchMenuProducts,
} from '~/features/header';

function HeaderSearchMenu() {
  return (
    <HeaderMenuUI>
      <HeaderMenuBoxUI $minHeight="40rem">
        {/* <Loader /> */}

        {/* <TextMessageUI>No matches found</TextMessageUI> */}

        {/* <TextMessageUI>
          Something went wrong! Please try again later.
        </TextMessageUI> */}

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

// const TextMessageUI = styled.p`
//   color: #f5f5f5;
//   font-family: var(--font-inter-medium);
//   font-size: 1.5rem;
//   letter-spacing: 1px;
// `;

export default HeaderSearchMenu;
