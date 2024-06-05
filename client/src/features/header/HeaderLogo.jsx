import styled from 'styled-components';
import { MainLogo } from '~/components';
import { px524, px924 } from '~/styles/GlobalStyles';

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

  @media only screen and (max-width: ${px924}) {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media only screen and (max-width: ${px524}) {
    left: 0;
    transform: translate(0, -50%);
    margin-left: 4rem;
  }
`;

export default HeaderLogo;
