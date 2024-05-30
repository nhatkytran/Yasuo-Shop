import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { TYPE_FEATURED } from '~/config';
import { menuContents } from '~/dataUI/header';

function HeaderMenuFeatured() {
  const { language } = useParams();

  return (
    <StyledHeaderMenuFeatured>
      {menuContents[TYPE_FEATURED].map((collection, index) => (
        <LinkUI to={`${language}${collection.link}`} key={index}>
          <ImageUI src={collection.image} alt="League of Legends collection" />
          <TitleUI>{collection.title}</TitleUI>
        </LinkUI>
      ))}
    </StyledHeaderMenuFeatured>
  );
}

const StyledHeaderMenuFeatured = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #fff;
    font-family: var(--font-inter-medium);
    font-size: 1.2rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

const ImageUI = styled.img`
  display: block;
`;

const TitleUI = styled.p`
  margin-top: 1rem;
`;

export default HeaderMenuFeatured;
