import styled from 'styled-components';

import { ButtonMain } from '~/components';
import { px1024, px624 } from '~/styles/GlobalStyles';
import { ErrorContainerUI, ErrorMessageUI, HeadingUI } from '~/ui';

function PageNotFound() {
  return (
    <StyledPageNotFound>
      <ErrorContainerUI>
        <ErrorMessageUI>Error 404</ErrorMessageUI>

        <HeadingUI as="h2">
          {"We can't find what you're looking for."}
        </HeadingUI>

        <ButtonMain
          content="Go Home"
          onClick={() => window.location.replace('/')}
        />
      </ErrorContainerUI>

      <PageNotFoundImageUI
        src="https://res.cloudinary.com/dxo1gnffi/image/upload/v1716529741/404_nbibx4.webp"
        alt="League of Legends image"
      />
    </StyledPageNotFound>
  );
}

const StyledPageNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 9rem 0;

  @media only screen and (max-width: ${px1024}) {
    padding: 4rem 0;
  }
`;

const PageNotFoundImageUI = styled.img`
  display: block;
  width: calc(100% - 4rem);
  max-width: 110rem;
  margin: 9rem 2rem 0;

  @media only screen and (max-width: ${px1024}) {
    margin: 6rem 2rem 0;
  }

  @media only screen and (max-width: ${px624}) {
    margin: 5rem 2rem 0;
  }
`;

export default PageNotFound;
