import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { px924 } from '~/styles/GlobalStyles';

import {
  HeaderSearchInput,
  SearchAllResultsLink,
  SearchProduct,
  SearchTitle,
} from '~/components';

import {
  customScrollbar,
  flexBetween,
  inputSearchSVG,
} from '~/styles/reuseStyles';

const products = [
  {
    image:
      'https://d2sqjidnnr8set.cloudfront.net/images/product/LC2655-00-00?type=base_image&resize=336:420',
    name: 'Hot Toys Ashe 1/6 Scale Figure',
    price: 299.99,
  },
  {
    image:
      'https://d2sqjidnnr8set.cloudfront.net/images/product/LC2655-00-00?type=base_image&resize=336:420',
    name: 'Hot Toys Ashe 1/6 Scale Figure',
    price: 299.99,
  },
];

const links = ['Accessories', 'Art', 'Posters', 'League of Legends'];

function HeaderSearchSidebar() {
  return (
    <StyledHeaderSearchSidebar>
      <SearchBoxUI>
        <HeaderSearchInput type="sidebar" />
      </SearchBoxUI>

      <SearchProductsUI>
        {products.map((product, index) => (
          <SearchProduct key={index} product={product} />
        ))}
      </SearchProductsUI>

      <SearchLinksUI>
        <SearchTitle type="sidebar" />

        <ListUI>
          {links.map((link, index) => (
            <ItemUI key={index}>
              <LinkUI href="">{link}</LinkUI>
            </ItemUI>
          ))}
        </ListUI>

        <SearchAllResultsLink type="sidebar" />
      </SearchLinksUI>
    </StyledHeaderSearchSidebar>
  );
}

const StyledHeaderSearchSidebar = styled.div`
  display: none;
  position: fixed;
  top: 6rem;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 46rem;
  background-color: #282828;
  padding: 3.2rem 2rem;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  overflow-y: scroll;
  ${customScrollbar};

  @media only screen and (max-width: ${px924}) {
    display: block;
  }
`;

const SearchBoxUI = styled.div`
  background-color: #333;
  margin-bottom: 3.2rem;
  padding: 0.5rem 1.4rem;
  border-radius: 1.6rem;
  ${flexBetween};

  svg {
    ${inputSearchSVG};
  }
`;

const SearchProductsUI = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.4rem;
  font-family: var(--font-riotsans-regular);
  letter-spacing: 1px;
  margin-bottom: 4.6rem;
`;

const SearchLinksUI = styled.div`
  color: #f5f5f5;
`;

const ListUI = styled.ul`
  list-style: none;
`;

const ItemUI = styled.li`
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: inherit;
    font-family: var(--font-inter-medium);
    font-size: 1.5rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

export default HeaderSearchSidebar;
