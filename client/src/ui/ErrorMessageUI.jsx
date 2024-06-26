import styled from 'styled-components';
import { px1024, px624 } from '~/styles/GlobalStyles';

const ErrorMessageUI = styled.span`
  color: ${props => (props.$isDarkMode ? '#b91c1c' : '#ef4444')};
  font-family: var(--font-sono);
  word-spacing: 1px;

  @media only screen and (max-width: ${px1024}) {
    font-size: 1.4rem;
  }

  @media only screen and (max-width: ${px624}) {
    font-size: 1.2rem;
  }
`;

export default ErrorMessageUI;
