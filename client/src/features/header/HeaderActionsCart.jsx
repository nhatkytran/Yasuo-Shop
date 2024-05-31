import styled from 'styled-components';
import { AiOutlineShoppingCart } from 'react-icons/ai';

function HeaderActionsCart() {
  return (
    <StyledHeaderActionsCart>
      <AiOutlineShoppingCart />
      {/* <DotUI /> */}
    </StyledHeaderActionsCart>
  );
}

const StyledHeaderActionsCart = styled.div`
  padding: 0.6rem;
  position: relative;
  cursor: pointer;

  svg {
    /* fill: #fff; */
    fill: #e8e8e8;
    display: block;
    width: 2.4rem;
    height: 2.4rem;
  }
`;

// const DotUI = styled.span`
//   width: 0.8rem;
//   height: 0.8rem;
//   background-color: #ef4444;
//   border-radius: 100%;
//   position: absolute;
//   top: 0.6rem;
//   right: 0.4rem;
// `;

export default HeaderActionsCart;
