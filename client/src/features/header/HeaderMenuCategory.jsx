import styled, { css } from 'styled-components';

import { Image, MenuCategoryLinks } from '~/components';
import { menuContents } from '~/dataUI/header';
import { useHeaderMenu } from '~/hooks';

function HeaderMenuCategory() {
  const { openName } = useHeaderMenu();
  const { mainLink, subLink, posters } = menuContents[openName];

  return (
    <StyledHeaderMenuCategory>
      <BoxUI>
        <MenuCategoryLinks mainLink={mainLink} subLink={subLink} />
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
