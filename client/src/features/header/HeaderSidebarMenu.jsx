import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { ArrowDownUI } from '~/ui';
import { navbarLinks } from '~/dataUI/header';
import { flexBetween } from '~/styles/reuseStyles';

function HeaderSidebarMenu() {
  const { language } = useParams();

  return (
    <StyledHeaderSidebarMenu>
      {navbarLinks.map((navbarLink, index) => (
        <ItemUI key={index}>
          <ButtonUI>
            <p>{navbarLink.title[language]}</p>
            {navbarLink.hasMenuOpen && <ArrowDownUI $side="right" />}
          </ButtonUI>
        </ItemUI>
      ))}
    </StyledHeaderSidebarMenu>
  );
}

const StyledHeaderSidebarMenu = styled.ul`
  list-style: none;
`;

const ItemUI = styled.li`
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

const ButtonUI = styled.button`
  color: #fff;
  font-family: var(--font-inter-medium);
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0.2rem 0;
  gap: 0.4rem;
  ${flexBetween};
  cursor: pointer;
`;

export default HeaderSidebarMenu;
