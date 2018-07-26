import React from 'react';
import Modal from './Modal';

const ModalContainer = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  return (
    <div className={showHideClassName}>
        <Modal show={show} handleClose={handleClose}>
            {children}
        </Modal>
    </div>
  );
};

export default ModalContainer;
