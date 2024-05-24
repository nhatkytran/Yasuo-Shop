import styled from 'styled-components';

import { FooterRibbon } from '~/features/footer';

function Footer() {
  return (
    <>
      <StyledFooter>
        <div>Footer</div>

        <FooterRibbon />
      </StyledFooter>
    </>
  );
}

const StyledFooter = styled.footer`
  background-color: var(--color-neutral-800);
  color: var(--color-neutral-50);
  padding: 8rem 0 16rem;
  position: relative;
`;

export default Footer;
