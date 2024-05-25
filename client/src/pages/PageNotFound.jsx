import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import { ButtonMain } from '~/components';
import {
  buttonContents,
  errorHeadings,
  errorMessages,
} from '~/dataUI/pageNotFound';
import { px1024, px624 } from '~/styles/GlobalStyles';
import { ErrorContainerUI, ErrorMessageUI, HeadingUI } from '~/ui';

function PageNotFound() {
  const { language } = useParams();
  const navigate = useNavigate();

  return (
    <StyledPageNotFound>
      <ErrorContainerUI>
        <ErrorMessageUI>{errorMessages[language]}</ErrorMessageUI>

        <HeadingUI as="h2">{errorHeadings[language]}</HeadingUI>

        <ButtonMain
          content={buttonContents[language]}
          onClick={() => navigate(`/${language}`)}
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
