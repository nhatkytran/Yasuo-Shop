import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { px924 } from '~/styles/GlobalStyles';

function HeaderToAuth() {
  const { language } = useParams();

  return (
    <StyledHeaderToAuth>
      <LinkUI to={`/${language}/authentication/sign-in`}>Sign in</LinkUI>
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

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: inline-block;
    color: #fff;
    font-family: var(--font-inter-medium);
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 1px;
    padding: 2rem;
  }
`;

export default HeaderToAuth;
