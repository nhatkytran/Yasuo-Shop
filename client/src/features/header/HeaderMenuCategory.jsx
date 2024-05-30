import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { TYPE_ART } from '~/config';
import { menuContents } from '~/dataUI/header';

const data = menuContents[TYPE_ART];

function HeaderMenuCategory() {
  const { language } = useParams();

  return (
    <StyledHeaderMenuCategory>
      <BoxUI>
        <LinkUI to={`${language}${data.mainLink.link}`}>
          {data.mainLink.title[language]}
        </LinkUI>

        <ListUI>
          {data.subLink.links.map((link, index) => (
            <ItemUI key={index}>
              <LinkUI to={`${language}${link}`}>
                {data.subLink.titles[language][index]}
              </LinkUI>
            </ItemUI>
          ))}
        </ListUI>
      </BoxUI>

      <BoxUI>
        <PosterUI>
          <PosterImageUI
            src="https://images.contentstack.io/v3/assets/blt5bbf09732528de36/blt56e2a48585027aa2/62b20d3a482ba357e65de59a/VLRNTAlphaThreat_2560x2560.png?auto=webp&width=258&quality=85"
            alt="League of Legends poster"
            $type="comic"
          />
        </PosterUI>

        <PosterUI>
          <PosterImageUI
            src="https://images.contentstack.io/v3/assets/blt5bbf09732528de36/blt155572da8dfe826a/62d98d495b080e77825d3d99/SGMangaPOD_Ecomm2560x2560.png?auto=webp&width=258&quality=85"
            alt="League of Legends poster"
          />
        </PosterUI>
      </BoxUI>
    </StyledHeaderMenuCategory>
  );
}

const PosterUI = styled.div`
  width: 18.2rem;
  height: 24rem;
  background-color: var(--color-neutral-200);
  position: relative;
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

//

const StyledHeaderMenuCategory = styled.div`
  display: flex;
  justify-content: space-between;
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

export default HeaderMenuCategory;
