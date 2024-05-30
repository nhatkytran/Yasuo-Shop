import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { navbarLinks } from '~/dataUI/header';
import { flexCenter, flexStart } from '~/styles/reuseStyles';
import { ArrowDownUI } from '~/ui';

function HeaderNavbar({ onOpenMenu }) {
  const { language } = useParams();

  const handleOpenMenu = navbarLink =>
    navbarLink.hasMenuOpen && onOpenMenu(navbarLink.type);

  return (
    <StyledHeaderNavbar>
      <ListUI>
        {navbarLinks.map((navbarLink, index) => {
          return (
            <ItemUI key={index}>
              <LinkUI to="" onMouseEnter={() => handleOpenMenu(navbarLink)}>
                <LinkContentUI>{navbarLink.title[language]}</LinkContentUI>
                {navbarLink.hasMenuOpen && <ArrowDownUI />}
              </LinkUI>
            </ItemUI>
          );
        })}
      </ListUI>
    </StyledHeaderNavbar>
  );
}

const StyledHeaderNavbar = styled.div`
  flex: 1;
  height: 100%;
  padding-left: 6rem;
  position: relative;
`;

const ListUI = styled.ul`
  height: 100%;
  list-style: none;
  ${flexStart};
  gap: 4rem;
`;

const ItemUI = styled.li`
  height: 100%;

  &:not(:last-child) a::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    height: 0.2rem;
    width: 100%;
    background-color: #fff;
    opacity: 0;
    transform: translateY(25%);
  }
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    height: 100%;
    color: #fff;
    font-family: var(--font-inter-bold);
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 1px;
    padding-bottom: 0.4rem;
    position: relative;
    ${flexCenter};

    &:hover::before {
      opacity: 1;
    }
  }
`;

export const LinkContentUI = styled.span`
  display: block;
  margin-right: 0.8rem;
`;

HeaderNavbar.propTypes = { onOpenMenu: PropTypes.func.isRequired };

export default HeaderNavbar;
