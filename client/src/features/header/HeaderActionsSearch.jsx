import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { flexBetween } from '~/styles/reuseStyles';

function HeaderActionsSearch() {
  return (
    <StyledHeaderActionsSearch>
      <SearchInputUI type="text" placeholder="Search" />
      <AiOutlineSearchUI />
    </StyledHeaderActionsSearch>
  );
}

const StyledHeaderActionsSearch = styled.div`
  background-color: #333;
  padding: 0.4rem 1.4rem;
  border-radius: 1.6rem;
  ${flexBetween};
`;

const SearchInputUI = styled.input`
  width: 9.2rem;
  background-color: transparent;
  color: #fff;
  font-family: var(--font-inter-bold);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::placeholder {
    color: inherit;
  }
`;

const AiOutlineSearchUI = styled(AiOutlineSearch)`
  width: 2rem;
  height: 2rem;
  margin-left: 0.4rem;
`;

export default HeaderActionsSearch;
