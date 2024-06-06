import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import { TYPE_FEATURED } from '~/config';
import { menuContents } from '~/dataUI/header';

function HeaderSidebarSubmenuFeatured() {
  const { language } = useParams();

  return (
    <StyledHeaderSidebarSubmenuFeatured>
      {menuContents[TYPE_FEATURED].map((collection, index) => (
        <ItemUI key={index}>
          <LinkUI to={`/${language}${collection.link}`}>
            {collection.title}
          </LinkUI>
        </ItemUI>
      ))}
    </StyledHeaderSidebarSubmenuFeatured>
  );
}

const StyledHeaderSidebarSubmenuFeatured = styled.ul`
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
    color: #fff;
    font-family: var(--font-inter-medium);
    font-size: 1.3rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

export default HeaderSidebarSubmenuFeatured;
