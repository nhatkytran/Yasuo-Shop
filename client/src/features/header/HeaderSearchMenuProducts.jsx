import styled from 'styled-components';
import { SearchProduct } from '~/components';

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

function HeaderSearchMenuProducts() {
  return (
    <StyledHeaderSearchMenuProducts>
      {products.map((product, index) => (
        <SearchProduct key={index} product={product} />
      ))}
    </StyledHeaderSearchMenuProducts>
  );
}

const StyledHeaderSearchMenuProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.4rem;
  font-family: var(--font-riotsans-regular);
  letter-spacing: 1px;
`;

export default HeaderSearchMenuProducts;
