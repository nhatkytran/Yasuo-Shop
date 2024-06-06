import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Image } from '~/components';

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
      {products.map((product, index) => {
        return (
          <LinkUI key={index}>
            <ImageBackgroundUI>
              <Image UI={ImageUI} src={product.image} alt={product.name} />
            </ImageBackgroundUI>

            <NameUI>{product.name}</NameUI>
            <PriceUI>${product.price}</PriceUI>
          </LinkUI>
        );
      })}
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

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #f5f5f5;
    font-size: 1.3rem;
    text-decoration: none;
    letter-spacing: 1px;
  }
`;

const ImageBackgroundUI = styled.div`
  background-color: var(--color-neutral-200);
  margin-bottom: 1.2rem;
  padding: 2rem 0;
`;

const ImageUI = styled.img`
  display: block;
`;

const NameUI = styled.p`
  margin-bottom: 0.4rem;
`;

const PriceUI = styled.p`
  color: #e5e5e5;
`;

export default HeaderSearchMenuProducts;
