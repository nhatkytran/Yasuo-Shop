import styled from 'styled-components';

import { SignIn } from '~/components';
import { px924 } from '~/styles/GlobalStyles';

function HeaderToAuth() {
  return (
    <StyledHeaderToAuth>
      <SignIn />
    </StyledHeaderToAuth>
  );
}

const StyledHeaderToAuth = styled.div`
  width: 10rem;
  text-align: right;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);

  @media only screen and (max-width: ${px924}) {
    display: none;
  }
`;

export default HeaderToAuth;
