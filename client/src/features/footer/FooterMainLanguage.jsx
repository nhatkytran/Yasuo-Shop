import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillCaretDown, AiOutlineGlobal } from 'react-icons/ai';

import { HeadingUI } from '~/ui';
import { useModal } from '../modal';
import { countryContents } from '~/dataUI/footer';
import { px524 } from '~/styles/GlobalStyles';

function FooterMainLanguage() {
  const { language } = useParams();
  const { openModal, ModalPortal } = useModal();

  return (
    <div>
      <HeadingUI as="h5">{countryContents.titles[language]}</HeadingUI>

      <LanguageBoxUI onClick={openModal}>
        <AiOutlineGlobalUI />
        <LanguageUI>{countryContents.countries[language]}</LanguageUI>
        <AiFillCaretDownUI />
      </LanguageBoxUI>

      <ModalPortal title={countryContents.subTitles[language]}>
        <>
          <HeadingUI as="h6">
            {countryContents.subTitleSmalls[language]}
          </HeadingUI>
          <CountryBoxUI>
            {countryContents.links.links.map((link, index) => (
              <LinkUI href={`${link}`} key={index}>
                {countryContents.links[language][index]}
              </LinkUI>
            ))}
          </CountryBoxUI>
        </>
      </ModalPortal>
    </div>
  );
}

const LanguageBoxUI = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;

  &:hover :nth-child(2) {
    text-decoration: underline;
  }
`;

const AiOutlineGlobalUI = styled(AiOutlineGlobal)`
  width: 2rem;
  height: 2rem;
`;

const LanguageUI = styled.div`
  font-family: var(--font-inter-medium);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0.6rem;
`;

const AiFillCaretDownUI = styled(AiFillCaretDown)`
  width: 1.2rem;
  height: 1.2rem;
  fill: #737373;
`;

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

export default FooterMainLanguage;
