import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

function SearchTitle({ type }) {
  return (
    <StyledSearchTitle $type={type}>RECOMMENDED CATEGORIES</StyledSearchTitle>
  );
}

const styles = {
  menu: css`
    font-family: var(--font-riotsans-regular);
    font-size: 1.2rem;
    margin-bottom: 3.2rem;
  `,
  sidebar: css`
    font-family: var(--font-riotsans-bold);
    font-size: 1.4rem;
    margin-bottom: 2.2rem;
  `,
};

const StyledSearchTitle = styled.div`
  line-height: 0.8;
  letter-spacing: 1px;
  ${props => styles[props.$type]};
`;

SearchTitle.propTypes = {
  type: PropTypes.oneOf(['menu', 'sidebar']).isRequired,
};

export default SearchTitle;
