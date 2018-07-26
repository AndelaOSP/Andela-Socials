import React from 'react';

const Modal = ({ handleClose, show, children }) => (
    <div className="modal-main">
      <section className="modal-details">
        {children}
      </section>
    </div>
);

export default Modal;
