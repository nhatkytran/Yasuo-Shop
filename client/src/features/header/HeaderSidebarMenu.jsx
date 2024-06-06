import styled, { css } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowDownUI } from '~/ui';
import { navbarLinks } from '~/dataUI/header';
import { flexBetween } from '~/styles/reuseStyles';
import { useHeaderSidebar } from '~/hooks';

function HeaderSidebarMenu() {
  const { language } = useParams();
  const navigate = useNavigate();

  const {
    sidebarSubmenuName,
    closeHeaderSidebar,
    openHeaderSidebarSubmenu,
    closeHeaderSidebarSubmenu,
  } = useHeaderSidebar();

  const handleChooseMenuOptions = navbarLink => {
    if (!navbarLink.hasMenuOpen) {
      navigate(`/${language}${navbarLink.mainLink}`);
      return closeHeaderSidebar();
    }

    if (navbarLink.type !== sidebarSubmenuName)
      openHeaderSidebarSubmenu(navbarLink.type);
    else closeHeaderSidebarSubmenu();
  };

  return (
    <StyledHeaderSidebarMenu>
      {navbarLinks.map((navbarLink, index) => {
        const active = navbarLink.type === sidebarSubmenuName;

        return (
          <ItemUI key={index}>
            <ButtonUI onClick={() => handleChooseMenuOptions(navbarLink)}>
              <ButtonContentUI $active={active}>
                {navbarLink.title[language]}
              </ButtonContentUI>

              {navbarLink.hasMenuOpen && (
                <ArrowDownUI $side={active ? 'left' : 'right'} />
              )}
            </ButtonUI>
          </ItemUI>
        );
      })}
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

const ButtonContentUI = styled.p`
  ${props =>
    props.$active &&
    css`
      text-decoration: underline;
    `};
`;

export default HeaderSidebarMenu;
