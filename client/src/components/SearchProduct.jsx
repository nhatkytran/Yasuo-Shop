import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Image } from '~/components';

function SearchProduct({ product }) {
  return (
    <LinkUI>
      <ImageBackgroundUI>
        <Image UI={ImageUI} src={product.image} alt={product.name} />
      </ImageBackgroundUI>

      <NameUI>{product.name}</NameUI>
      <PriceUI>${product.price}</PriceUI>
    </LinkUI>
  );
}

const LinkUI = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #f5f5f5;
    font-size: 1.3rem;
    text-decoration: none;
    letter-spacing: 1px;

    &:hover img {
      transform: scale(1.05);
    }
  }
`;

const ImageBackgroundUI = styled.div`
  background-color: var(--color-neutral-200);
  margin-bottom: 1.2rem;
  padding: 2rem 0;
`;

const ImageUI = styled.img`
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0s;
`;

const NameUI = styled.p`
  margin-bottom: 0.4rem;
`;

const PriceUI = styled.p`
  color: #e5e5e5;
`;

SearchProduct.propTypes = { product: PropTypes.any.isRequired };

export default SearchProduct;
