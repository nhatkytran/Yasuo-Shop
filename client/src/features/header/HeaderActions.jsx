import styled from 'styled-components';

import { flexBetween } from '~/styles/reuseStyles';
import {
  HeaderActionsCart,
  HeaderActionsMode,
  HeaderActionsSearch,
} from '~/features/header';

function HeaderActions() {
  return (
    <StyledHeaderActions>
      <HeaderActionsMode />
      <HeaderActionsSearch />
      <HeaderActionsCart />
    </StyledHeaderActions>
  );
}

const StyledHeaderActions = styled.div`
  ${flexBetween};
  gap: 0.8rem;
  margin-right: 2rem;
`;

export default HeaderActions;
