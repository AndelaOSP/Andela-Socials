import React from 'react';
import PropTypes from 'prop-types';

import { ModalContextCreator } from './ModalContext';

/*
  maps a string to a modal child, used to determine 
  which modal child is to be rendered e.g:
  const MODAL_COMPONENTS = {
    'CREATE_EVENT': CreateEventModal,
  };
 */
const MODAL_COMPONENTS = {};

const ModalContainer = (props) => {
  const { activeModal, closeModal, modalProps } = props;
  if (!activeModal) {
    return null;
  }
  const specificModal = MODAL_COMPONENTS[activeModal];
  return (
    <div
      className={`modal modal__${activeModal}`}
      onClick={(e) => {
        if (e.target.classList[0] !== 'modal') {
          return;
        }
        closeModal();
      }}
    >
    <modalContent />
    </div>
  );
};

ModalContainer.defaultProps = {
  activeModal: null,
};

ModalContainer.propTypes = {
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  modalProps: PropTypes.shape({
    modalHeadline: PropTypes.string.isRequired,
  }).isRequired,
};

const ModalContent = () => {
  return (
    <div className="modal__content">
      <header className="modal__header">
        <h3>{modalProps.modalHeadline}</h3>
      </header>
      <div className="modal__body">
        <specificModal {...modalProps}/>
      </div>
      <footer className="modal__btns">
        <button
          className="modal__btn modal__btn-cancel"
          type="button"
          onClick={closeModal}
        >Cancel</button>
        <button
          className="modal__btn modal__btn-submit"
          form="create-event-form"
          type="submit"
        >Submit</button>
      </footer>
    </div>   
 );
}

export default () => (
  <ModalContextCreator.Consumer>
    {
      props => <ModalContainer {...props}/>
    }
  </ModalContextCreator.Consumer>
);
