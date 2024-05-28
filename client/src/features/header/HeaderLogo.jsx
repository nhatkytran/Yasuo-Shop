import styled from 'styled-components';
import { MainLogo } from '~/components';

function HeaderLogo() {
  return (
    <StyledHeaderLogo>
      <MainLogo isLink={true} type="main" />
    </StyledHeaderLogo>
  );
}

const StyledHeaderLogo = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
`;

export default HeaderLogo;
