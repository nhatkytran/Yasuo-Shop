import { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Modal } from '~/features/modal';

function useModal() {
  const [isModalOpened, setIsModalOpened] = useState(true);

  const ModalPortal = ({ children, title }) =>
    ReactDOM.createPortal(
      <Modal
        isModalOpened={isModalOpened}
        onCloseModal={() => setIsModalOpened(false)}
        title={title}
      >
        {children}
      </Modal>,
      document.getElementById('portal-root')
    );

  ModalPortal.propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
  };

  return {
    openModal: () => setIsModalOpened(true),
    ModalPortal,
  };
}

export default useModal;
