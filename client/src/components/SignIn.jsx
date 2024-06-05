import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

function SignIn() {
  const { language } = useParams();

  return (
    <StyledSignIn to={`/${language}/authentication/sign-in`}>
      Sign in
    </StyledSignIn>
  );
}

const StyledSignIn = styled(Link)`
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

export default SignIn;
