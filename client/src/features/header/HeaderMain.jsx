import styled from 'styled-components';
import PropTypes from 'prop-types';

import { HeaderActions, HeaderLogo, HeaderNavbar, HeaderToAuth } from '.';
import { flexBetween } from '~/styles/reuseStyles';

function HeaderMain({ onOpenMenu }) {
  return (
    <StyledHeaderMain>
      <HeaderLogo />

      <HeaderMainUI>
        <HeaderNavbar onOpenMenu={onOpenMenu} />
        <HeaderActions />
      </HeaderMainUI>

      <HeaderToAuth />
    </StyledHeaderMain>
  );
}

const StyledHeaderMain = styled.div`
  width: 100%;
  max-width: calc(var(--width-main-layout) - 4rem);
  height: 100%;
  margin: 0 10rem;
  position: relative;
`;

const HeaderMainUI = styled.div`
  height: 100%;
  ${flexBetween};
`;

HeaderMain.propTypes = { onOpenMenu: PropTypes.func.isRequired };

export default HeaderMain;
