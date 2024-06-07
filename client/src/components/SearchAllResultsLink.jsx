import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function SearchAllResultsLink({ type }) {
  return (
    <StyledSearchAllResultsLink $type={type}>
      View All Results (202)
    </StyledSearchAllResultsLink>
  );
}

const styles = {
  menu: css`
    font-family: var(--font-inter-light);
    font-size: 1.2rem;
  `,
  sidebar: css`
    font-family: var(--font-inter-medium);
    font-size: 1.4rem;
    margin-top: 2.2rem;
  `,
};

const StyledSearchAllResultsLink = styled(Link)`
  &:link,
  &:visited {
    display: block;
    color: #e5e5e5;
    letter-spacing: 1px;
    ${props => styles[props.$type]};
  }
`;

SearchAllResultsLink.propTypes = {
  type: PropTypes.oneOf(['menu', 'sidebar']).isRequired,
};

export default SearchAllResultsLink;
