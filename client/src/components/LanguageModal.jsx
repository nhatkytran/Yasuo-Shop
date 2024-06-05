import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { countryContents } from '~/dataUI/footer';
import { HeadingUI } from '~/ui';
import { px524 } from '~/styles/GlobalStyles';

function LanguageModal({ ModalPortal }) {
  const { language } = useParams();

  return (
    <ModalPortal title={countryContents.subTitles[language]}>
      <HeadingUI as="h6">{countryContents.subTitleSmalls[language]}</HeadingUI>

      <CountryBoxUI>
        {countryContents.links.links.map((link, index) => (
          <LinkUI href={`${link}`} key={index}>
            {countryContents.links[language][index]}
          </LinkUI>
        ))}
      </CountryBoxUI>
    </ModalPortal>
  );
}

const CountryBoxUI = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media only screen and (max-width: ${px524}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const LinkUI = styled.a`
  &:link,
  &:visited {
    display: block;
    color: var(--color-black);
    font-family: var(--font-riotsans-regular);
    font-size: 1.5rem;
    text-decoration: none;
    line-height: 1.2;
    letter-spacing: 1px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

LanguageModal.propTypes = { ModalPortal: PropTypes.func.isRequired };

export default LanguageModal;
