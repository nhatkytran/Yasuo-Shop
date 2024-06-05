import styled from 'styled-components';
import { px924 } from '~/styles/GlobalStyles';

function HeaderSidebarToggle() {
  return (
    <StyledHeaderSidebarToggle>
      <svg
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
    width: 2.2rem;
    height: 2.2rem;
  }
`;

export default HeaderSidebarToggle;
