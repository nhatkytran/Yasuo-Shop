import styled from 'styled-components';
import { AiFillCaretDown, AiOutlineGlobal } from 'react-icons/ai';

import { HeadingUI } from '~/ui';

function FooterMainLanguage() {
  return (
    <div>
      <HeadingUI as="h5">Language</HeadingUI>

      <LanguageBoxUI>
        <AiOutlineGlobalUI />
        <LanguageUI>United States</LanguageUI>
        <AiFillCaretDownUI />
      </LanguageBoxUI>
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
  fill: var(--color-neutral-500);
`;

export default FooterMainLanguage;
