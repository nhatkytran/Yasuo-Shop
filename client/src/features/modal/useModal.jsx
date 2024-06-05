import { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Modal } from '~/features/modal';

function useModal() {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = () => setIsModalOpened(true);
  const closeModal = () => setIsModalOpened(false);

  const ModalPortal = ({ children, title }) =>
    ReactDOM.createPortal(
      <Modal
        isModalOpened={isModalOpened}
        onCloseModal={closeModal}
        title={title}
      >
        {children}
      </Modal>,
      document.getElementById('portal-root')
    );

  ModalPortal.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
    title: PropTypes.string.isRequired,
  };

  return { openModal, ModalPortal };
}

export default useModal;
