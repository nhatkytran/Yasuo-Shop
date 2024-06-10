import { AiOutlineSearch } from 'react-icons/ai';
import styled from 'styled-components';

import { HeaderSearchInput } from '~/components';
import { px924 } from '~/styles/GlobalStyles';
import { flexBetween, inputSearchSVG } from '~/styles/reuseStyles';

function HeaderActionsSearch() {
  return (
    <>
      <StyledHeaderActionsSearch>
        <HeaderSearchInput type="menu" />
      </StyledHeaderActionsSearch>

      <StyledHeaderActionsSearchMobile>
        <AiOutlineSearchMobileUI />
      </StyledHeaderActionsSearchMobile>
    </>
  );
}

// Desktop //////////

const StyledHeaderActionsSearch = styled.div`
  position: relative;
  top: 1px;
  background-color: #333;
  padding: 0.4rem 1.4rem;
  border-radius: 1.6rem;
  ${flexBetween};

  @media only screen and (max-width: ${px924}) {
    display: none;
  }

  svg {
    ${inputSearchSVG};
  }
`;

// Mobile //////////

const StyledHeaderActionsSearchMobile = styled.button`
  display: none;
  padding: 0.6rem;
  cursor: pointer;

  @media only screen and (max-width: ${px924}) {
    display: block;
  }
`;

const AiOutlineSearchMobileUI = styled(AiOutlineSearch)`
  display: block;
  width: 2.4rem;
  height: 2.4rem;
  fill: #fff;
`;

export default HeaderActionsSearch;
