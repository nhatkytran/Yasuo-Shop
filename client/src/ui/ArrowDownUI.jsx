import styled, { css } from 'styled-components';
import { AiFillCaretDown } from 'react-icons/ai';

const rotate = {
  down: css`
    transform: rotate(0deg);
  `,
  right: css`
    transform: rotate(-90deg);
  `,
  left: css`
    transform: rotate(90deg);
  `,
};

const ArrowDownUI = styled(AiFillCaretDown)`
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  fill: #737373;
  ${props => rotate[props.$side]};
`;

ArrowDownUI.defaultProps = { $side: 'down' };

export default ArrowDownUI;
