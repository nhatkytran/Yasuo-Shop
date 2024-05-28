import styled from 'styled-components';

import { MainLogo } from '~/components';
import FooterMainShop from './FooterMainShop';
import FooterMainSupport from './FooterMainSupport';
import FooterMainLanguage from './FooterMainLanguage';
import { px524, px924 } from '~/styles/GlobalStyles';

function FooterMain() {
  return (
    <StyledFooterMain>
      <MainLogo isLink={false} type="footer" />
      <FooterMainShop />
      <FooterMainSupport />
      <FooterMainLanguage />
    </StyledFooterMain>
  );
}

const StyledFooterMain = styled.div`
  width: 100%;
  max-width: var(--width-main-layout);
  padding: 0 2rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4.8rem 2.4rem;

  @media only screen and (max-width: ${px924}) {
    grid-template-columns: repeat(2, 1fr);

    div:nth-child(4) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  }

  @media only screen and (max-width: ${px524}) {
    grid-template-columns: repeat(1, 1fr);

    div:nth-child(4) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }
`;

export default FooterMain;
