import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useDarkMode } from '~/hooks';
import { flexCenter } from '~/styles/reuseStyles';
import { ErrorContainerUI, ErrorMessageUI, HeadingUI } from '~/ui';
import { ButtonMain } from '~/components';

function ErrorFallback({ error, resetErrorBoundary }) {
  const { isDarkMode } = useDarkMode();

  return (
    <StyledErrorFallback>
      <ErrorContainerUI>
        <ErrorMessageUI $isDarkMode={isDarkMode}>
          {error.message}
        </ErrorMessageUI>

        <HeadingUI as="h2">Something went wrong!</HeadingUI>

        <ButtonMain content="Go Home" onClick={resetErrorBoundary} />
      </ErrorContainerUI>
    </StyledErrorFallback>
  );
}

const StyledErrorFallback = styled.div`
  width: 100vw;
  height: 100vh;
  ${flexCenter};
`;

ErrorFallback.propTypes = {
  error: PropTypes.any.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;
