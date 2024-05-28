import styled from 'styled-components';
import { AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';

import { useDarkMode } from '~/hooks';

function HeaderActionsMode() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <StyledHeaderActionsMode onClick={toggleDarkMode}>
      {isDarkMode ? <AiOutlineSun /> : <AiOutlineMoon />}
    </StyledHeaderActionsMode>
  );
}

const StyledHeaderActionsMode = styled.div`
  padding: 0.6rem;
  cursor: pointer;

  svg {
    display: block;
    width: 2.2rem;
    height: 2.2rem;
  }
`;

export default HeaderActionsMode;
