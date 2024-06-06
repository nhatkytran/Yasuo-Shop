import styled, { css } from 'styled-components';
import { flexCenter } from '~/styles/reuseStyles';

const HeaderMenuBoxUI = styled.div`
  max-width: var(--width-main-layout);
  min-height: 32rem;
  margin: 0 auto;
  padding: 0 2rem;
  ${flexCenter};
  ${props =>
    props.$minHeight &&
    css`
      min-height: ${props.$minHeight};
    `}
`;

export default HeaderMenuBoxUI;
