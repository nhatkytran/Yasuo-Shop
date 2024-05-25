import styled from 'styled-components';
import { FooterMain, FooterRibbon } from '~/features/footer';

function Footer() {
  return (
    <>
      <StyledFooter>
        <FooterMain />
        <FooterRibbon />
      </StyledFooter>
    </>
  );
}

const StyledFooter = styled.footer`
  background-color: var(--color-neutral-800);
  color: var(--color-neutral-50);
  padding: 7.6rem 0 17rem;
  position: relative;
`;

export default Footer;
