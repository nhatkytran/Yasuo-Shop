import styled, { css } from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

import { px524 } from '~/styles/GlobalStyles';

const fill = {
  default: css`
    fill: var(--color-black);
  `,
  white: css`
    fill: #fff;
  `,
};

const AiOutlineCloseUI = styled(AiOutlineClose)`
  width: 2.8rem;
  height: 2.8rem;
  fill: var(--color-black);
  cursor: pointer;
  ${props => fill[props.$color]};

  @media only screen and (max-width: ${px524}) {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

AiOutlineCloseUI.defaultProps = { $color: 'default' };

export default AiOutlineCloseUI;
