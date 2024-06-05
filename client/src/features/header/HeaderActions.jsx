import styled from 'styled-components';

import { flexBetween } from '~/styles/reuseStyles';
import { px924 } from '~/styles/GlobalStyles';

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

  @media only screen and (max-width: ${px924}) {
    gap: 0.2rem;
    margin-right: 0;
  }
`;

export default HeaderActions;
