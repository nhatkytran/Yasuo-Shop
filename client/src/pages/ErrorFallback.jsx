import PropTypes from 'prop-types';
import styled from 'styled-components';

import GlobalStyles from '~/styles/GlobalStyles';
import { flexCenter } from '~/styles/reuseStyles';
import { ErrorContainerUI, ErrorMessageUI, HeadingUI } from '~/ui';
import { ButtonMain } from '~/components';

function ErrorFallback({ error }) {
  //resetErrorBoundary
  return (
    <>
      <GlobalStyles />

      <StyledErrorFallback>
        <ErrorContainerUI>
          <ErrorMessageUI>{error.message}</ErrorMessageUI>

          <HeadingUI as="h2">Something went wrong!</HeadingUI>

          <ButtonMain content="Go Home" />
        </ErrorContainerUI>
      </StyledErrorFallback>
    </>
  );
}

const StyledErrorFallback = styled.div`
  width: 100vw;
  height: 100vh;
  ${flexCenter};
`;

ErrorFallback.propTypes = {
  error: PropTypes.any,
  resetErrorBoundary: PropTypes.func,
};

export default ErrorFallback;
