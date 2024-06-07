import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

import { flexBetween } from '~/styles/reuseStyles';
import { searchPlaceholders } from '~/dataUI/header';
import { px924 } from '~/styles/GlobalStyles';
import { SearchInputUI } from '~/ui';

function HeaderActionsSearch() {
  const { language } = useParams();

  return (
    <>
      <StyledHeaderActionsSearch>
        <SearchInputUI
          $width="9.2rem"
          type="text"
          placeholder={searchPlaceholders[language]}
        />
        <AiOutlineSearchUI />
      </StyledHeaderActionsSearch>

      <StyledHeaderActionsSearchMobile>
        <AiOutlineSearchMobileUI />
      </StyledHeaderActionsSearchMobile>
    </>
  );
}

// Desktop //////////

const StyledHeaderActionsSearch = styled.div`
  background-color: #333;
  padding: 0.4rem 1.4rem;
  border-radius: 1.6rem;
  ${flexBetween};

  @media only screen and (max-width: ${px924}) {
    display: none;
  }
`;

const AiOutlineSearchUI = styled(AiOutlineSearch)`
  width: 2rem;
  height: 2rem;
  margin-left: 0.4rem;
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
