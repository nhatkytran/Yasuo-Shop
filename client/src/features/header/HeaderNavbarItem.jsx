import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

import { flexCenter } from '~/styles/reuseStyles';
import { ArrowDownUI } from '~/ui';

function HeaderNavbarItem({ navbarLink, onOpenMenu, onCloseMenu }) {
  const { language } = useParams();
  const navItem = useRef(null);

  const { type, title, hasMenuOpen, mainLink } = navbarLink;
  const toLink = mainLink ? `/${language}${mainLink}` : null;

  const handleOpenMenu = () => hasMenuOpen && onOpenMenu(type);

  const handleCloseMenu = event => {
    const { clientX, clientY } = event;
    const { width, right } = navItem.current.getBoundingClientRect();

    if (clientY < 0 || clientX < right - width || clientX > right - 1)
      onCloseMenu();
  };

  return (
    <StyledHeaderNavbarItem
      ref={navItem}
      onMouseEnter={handleOpenMenu}
      onMouseLeave={handleCloseMenu}
    >
      <LinkUI to={toLink} $pointer={!!mainLink}>
        <LinkContentUI>{title[language]}</LinkContentUI>
        {hasMenuOpen && <ArrowDownUI />}
      </LinkUI>
    </StyledHeaderNavbarItem>
  );
}

const StyledHeaderNavbarItem = styled.li`
  height: 100%;

  &:not(:first-child) {
    padding-left: 4.2rem;
  }

  &:not(:last-child) a::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    height: 0.2rem;
    width: 100%;
    background-color: #fff;
    opacity: 0;
    transform: translateY(25%);
  }

  &:hover a::before {
    opacity: 1;
  }
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
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
    ${props =>
      !props.$pointer &&
      css`
        cursor: default;
      `};
  }
`;

export const LinkContentUI = styled.span`
  display: block;
  margin-right: 0.8rem;
`;

HeaderNavbarItem.propTypes = {
  navbarLink: PropTypes.any.isRequired,
  onOpenMenu: PropTypes.func.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
};

export default HeaderNavbarItem;
