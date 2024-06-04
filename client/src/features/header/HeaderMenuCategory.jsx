import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { TYPE_ART } from '~/config';
import { menuContents } from '~/dataUI/header';
import { Image } from '~/components';

function HeaderMenuCategory() {
  const { language } = useParams();
  const { mainLink, subLink, posters } = menuContents[TYPE_ART];

  return (
    <StyledHeaderMenuCategory>
      <BoxUI>
        <LinkUI to={`${language}${mainLink.link}`}>
          {mainLink.title[language]}
        </LinkUI>

        <ListUI>
          {subLink.links.map((link, index) => (
            <ItemUI key={index}>
              <LinkUI to={`${language}${link}`}>
                {subLink.titles[language][index]}
              </LinkUI>
            </ItemUI>
          ))}
        </ListUI>
      </BoxUI>

      <BoxUI>
        {posters.map(({ type, image, description }, index) => (
          <PosterUI key={index}>
            <Image
              UI={PosterImageUI}
              $type={type}
              src={image}
              alt={description}
            />
          </PosterUI>
        ))}
      </BoxUI>
    </StyledHeaderMenuCategory>
  );
}

const StyledHeaderMenuCategory = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const BoxUI = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
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

const PosterUI = styled.div`
  width: 18.2rem;
  height: 24rem;
  background-color: var(--color-neutral-200);
  position: relative;
  overflow: hidden;
`;

const PosterImageUI = styled.img`
  display: block;
  width: 18rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${props =>
    props.$type === 'comic' &&
    css`
      transform: scale(1.32);
      transform-origin: 206% 206%;
    `};
`;

export default HeaderMenuCategory;
