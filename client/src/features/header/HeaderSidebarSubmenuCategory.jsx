import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import { TYPE_ART } from '~/config';
import { menuContents } from '~/dataUI/header';

function HeaderSidebarSubmenuCategory() {
  const { language } = useParams();
  const { mainLink, subLink } = menuContents[TYPE_ART];

  return (
    <StyledHeaderSidebarSubmenuCategory>
      <LinkUI to={`/${language}${mainLink.link}`}>
        {mainLink.title[language]}
      </LinkUI>

      <ListUI>
        {subLink.links.map((link, index) => (
          <ItemUI key={index}>
            <LinkUI to={`/${language}${link}`}>
              {subLink.titles[language][index]}
            </LinkUI>
          </ItemUI>
        ))}
      </ListUI>
    </StyledHeaderSidebarSubmenuCategory>
  );
}

const StyledHeaderSidebarSubmenuCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const ListUI = styled.ul`
  list-style: none;
`;

const ItemUI = styled.li`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #fff;
    font-family: var(--font-inter-medium);
    font-size: 1.3rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

export default HeaderSidebarSubmenuCategory;
