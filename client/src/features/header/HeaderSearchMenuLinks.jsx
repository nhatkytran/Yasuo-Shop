import styled from 'styled-components';
import { Link } from 'react-router-dom';

const links = ['Accessories', 'Art', 'Posters', 'League of Legends'];

function HeaderSearchMenuLinks() {
  return (
    <StyledHeaderSearchMenuLinks>
      <div>
        <TitleUI>RECOMMENDED CATEGORIES</TitleUI>
        <ListUI>
          {links.map((link, index) => {
            return (
              <ItemUI key={index}>
                <LinkUI href="">{link}</LinkUI>
              </ItemUI>
            );
          })}
        </ListUI>
      </div>

      <AllResultsLinkUI>View All Results (202)</AllResultsLinkUI>
    </StyledHeaderSearchMenuLinks>
  );
}

const StyledHeaderSearchMenuLinks = styled.div`
  height: 100%;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleUI = styled.div`
  font-family: var(--font-riotsans-regular);
  font-size: 1.2rem;
  line-height: 0.8;
  letter-spacing: 1px;
  margin-bottom: 3.2rem;
`;

const ListUI = styled.ul`
  list-style: none;
`;

const ItemUI = styled.li`
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: inherit;
    font-family: var(--font-inter-medium);
    font-size: 1.5rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

const AllResultsLinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #e5e5e5;
    font-family: var(--font-inter-light);
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
`;

export default HeaderSearchMenuLinks;
