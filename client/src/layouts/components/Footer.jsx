import styled from 'styled-components';

function Footer() {
  return <StyledFooter>Footer</StyledFooter>;
}

const StyledFooter = styled.footer`
  background-color: var(--color-neutral-800);
  color: var(--color-neutral-50);
  padding: 8rem 0 16rem;
`;

export default Footer;
