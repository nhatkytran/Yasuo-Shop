import styled from 'styled-components';

import { LanguageModal, SignIn } from '~/components';
import { useModal } from '~/features/modal';
import { flexBetween } from '~/styles/reuseStyles';
import { AiOutlineGlobalUI, LanguageUI } from '~/ui';

function HeaderSidebarFooter() {
  const { openModal, ModalPortal } = useModal();

  return (
    <StyledHeaderSidebarFooter>
      <LanguageBoxUI onClick={openModal}>
        <AiOutlineGlobalUI />
        <LanguageUI>United States</LanguageUI>
      </LanguageBoxUI>

      <LanguageModal ModalPortal={ModalPortal} />

      <SignIn />
    </StyledHeaderSidebarFooter>
  );
}

const StyledHeaderSidebarFooter = styled.div`
  width: 100%;
  height: 6rem;
  background-color: #171717;
  padding: 0 2rem;
  position: absolute;
  left: 0;
  bottom: 0;
  ${flexBetween};
`;

const LanguageBoxUI = styled.div`
  ${flexBetween};
  cursor: pointer;
`;

export default HeaderSidebarFooter;
