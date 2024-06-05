import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { HeadingUI } from '~/ui';
import { flexBetween, flexCenter } from '~/styles/reuseStyles';
import { px524 } from '~/styles/GlobalStyles';

function Modal({ children, isModalOpened, onCloseModal, title }) {
  useEffect(() => {
    document.body.style.overflow = isModalOpened ? 'hidden' : '';

    return () => (document.body.style.overflow = '');
  }, [isModalOpened]);

  if (!isModalOpened) return null;

  return (
    <StyledModal onClick={onCloseModal}>
      <ModalBox onClick={event => event.stopPropagation()}>
        <ModalShapeUI $pos="top" />

        <ModalHeaderUI>
          <HeadingUI as="h4">{title}</HeadingUI>
          <AiOutlineCloseUI onClick={onCloseModal} />
        </ModalHeaderUI>

        {children}

        <ModalShapeUI $pos="bot" />
      </ModalBox>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 0 2rem;
  position: fixed;
  z-index: 9999;
  ${flexCenter};
  animation: 0.25s cubic-bezier(0.42, 0, 0.002, 1) 0s 1 normal none running open;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: var(--width-sub-layout);
  background-color: var(--color-neutral-50);
  padding: 2rem 4rem;
  position: relative;

  @media only screen and (max-width: ${px524}) {
    padding: 1rem 3rem;
  }
`;

const ModalHeaderUI = styled.div`
  ${flexBetween};
  margin-bottom: 2.4rem;
`;

const AiOutlineCloseUI = styled(AiOutlineClose)`
  width: 2.8rem;
  height: 2.8rem;
  fill: var(--color-black);
  cursor: pointer;

  @media only screen and (max-width: ${px524}) {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const ModalShapeUI = styled.div`
  position: absolute;
  background-color: var(--color-neutral-50);
  width: calc(100% - 4rem);
  height: 2rem;
  ${props => props.$pos === 'top' && 'top: -2rem'};
  ${props => props.$pos === 'bot' && 'bottom: -2rem'};
  left: 50%;
  transform: translateX(-50%);

  &::before,
  &::after {
    display: block;
    position: absolute;
    content: '';
    top: 0;
    width: 2rem;
    height: 100%;
    background-color: var(--color-neutral-50);
  }

  &::before {
    left: -1rem;
    ${props => props.$pos === 'top' && 'transform: skew(-45deg);'};
    ${props => props.$pos === 'bot' && 'transform: skew(45deg);'};
  }

  &::after {
    right: -1rem;
    ${props => props.$pos === 'top' && 'transform: skew(45deg);'};
    ${props => props.$pos === 'bot' && 'transform: skew(-45deg);'};
  }
`;

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  isModalOpened: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Modal;
