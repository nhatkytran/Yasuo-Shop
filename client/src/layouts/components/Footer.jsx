import styled from 'styled-components';

import { FooterMain, FooterRibbon } from '~/features/footer';
import { useDarkMode } from '~/hooks';

function Footer() {
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <StyledFooter $isDarkMode={isDarkMode}>
        <FooterMain />
        <FooterRibbon />
      </StyledFooter>
    </>
  );
}

const StyledFooter = styled.footer`
  background-color: ${props => (props.$isDarkMode ? '#171717' : '#262626')};
  color: #fafafa;
  padding: 7.6rem 0 17rem;
  position: relative;
`;

export default Footer;
