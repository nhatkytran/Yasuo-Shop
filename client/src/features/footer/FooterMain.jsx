import styled from 'styled-components';

import { MainLogo } from '~/components';
import FooterMainShop from './FooterMainShop';
import FooterMainSupport from './FooterMainSupport';
import FooterMainLanguage from './FooterMainLanguage';

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
  max-width: 110rem;
  padding: 0 2rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4.8rem 2.4rem;
`;

export default FooterMain;
