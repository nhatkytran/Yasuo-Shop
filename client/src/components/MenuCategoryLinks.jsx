import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function MenuCategoryLinks({ mainLink, subLink }) {
  const { language } = useParams();

  return (
    <>
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
    </>
  );
}

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

const mainLinkShape = { title: PropTypes.object, link: PropTypes.string };

const subLinkShape = {
  links: PropTypes.arrayOf(PropTypes.string),
  titles: PropTypes.object,
};

MenuCategoryLinks.propTypes = {
  mainLink: PropTypes.shape(mainLinkShape).isRequired,
  subLink: PropTypes.shape(subLinkShape).isRequired,
};

export default MenuCategoryLinks;
