import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const ModalContextCreator = React.createContext();

class ModalContext extends Component {
  modalTypes = [
    'CREATE_EVENT',
    'UPDATE_EVENT',
    'DELETE_EVENT',
    'SUBMIT_INVITE'
  ];

  defaultModalProps = { modalHeadline: 'default modal headline' };

  state = {
    activeModal: null,
    modalProps: this.defaultModalProps,
  };

  openModal = (modalType, modalProps = this.defaultModalProps) => {
    if (!this.modalTypes.includes(modalType)) {
      throw new Error(
        `invalid modalType, you can add ${modalType} to this.modalTypes`
      );
    }

    document.getElementsByTagName('body')[0].classList.add('no-scroll');
    this.setState({
      activeModal: modalType,
      modalProps,
    });
  };

  closeModal = () => {
    document.getElementsByTagName('body')[0].classList.remove('no-scroll');
    this.setState({ activeModal: null });
  };

  render() {
    const { children } = this.props;
    const {
      activeModal,
      modalProps,
    } = this.state;

    return (
      <ModalContextCreator.Provider value={{
        activeModal,
        modalProps,
        openModal: this.openModal,
        closeModal: this.closeModal,
      }}>
        { children }
      </ModalContextCreator.Provider>
    );
  }
}

ModalContext.propTypes = { children: PropTypes.node.isRequired };

export default ModalContext;
