import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { arrayOf, shape, string } from 'prop-types';

import { HeadingUI, LinkFooterUI } from '~/ui';
import { EN_US, FR } from '~/config';

function FooterLinkList({ data }) {
  const { language } = useParams();

  return (
    <>
      <HeadingUI as="h5">{data.titles[language]}</HeadingUI>

      <ListUI>
        {data.links[language].map((item, index) => (
          <ItemUI key={index}>
            <LinkFooterUI
              to={`/${language}${data.links.links[index]}`}
              $type="main"
            >
              {item}
            </LinkFooterUI>
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
  margin-bottom: 1.2rem;
`;

FooterLinkList.propTypes = {
  data: shape({
    titles: shape({
      [EN_US]: string.isRequired,
      [FR]: string.isRequired,
    }),
    links: shape({
      links: arrayOf(string).isRequired,
      [EN_US]: arrayOf(string).isRequired,
      [FR]: arrayOf(string).isRequired,
    }),
  }),
};

export default FooterLinkList;
