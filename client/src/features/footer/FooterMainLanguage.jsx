import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { AiOutlineGlobalUI, ArrowDownUI, HeadingUI, LanguageUI } from '~/ui';
import { useModal } from '~/features/modal';
import { countryContents } from '~/dataUI/footer';
import { LanguageModal } from '~/components';

function FooterMainLanguage() {
  const { language } = useParams();
  const { openModal, ModalPortal } = useModal();

  return (
    <div>
      <HeadingUI as="h5">{countryContents.titles[language]}</HeadingUI>

      <LanguageBoxUI onClick={openModal}>
        <AiOutlineGlobalUI />
        <LanguageUI>{countryContents.countries[language]}</LanguageUI>
        <ArrowDownUI />
      </LanguageBoxUI>

      <LanguageModal ModalPortal={ModalPortal} />
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

export default FooterMainLanguage;
