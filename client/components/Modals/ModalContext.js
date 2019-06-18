import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SLACK_TOKEN } from '../../actions/constants';

export const ModalContextCreator = React.createContext();

class ModalContext extends Component {
  modalTypes = [
    'CREATE_EVENT',
    'UPDATE_EVENT',
    'DELETE_EVENT',
<<<<<<< HEAD
<<<<<<< HEAD
    'SUBMIT_INVITE',
    'SLACK_MODAL',
=======
    'SUBMIT_INVITE'
>>>>>>> feat(interests): add google calendar access (#210)
=======
    'SUBMIT_INVITE',
    'SLACK_MODAL',
>>>>>>> feat(slack-modal): implement slack token callback (#217)
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

  closeSlackModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: SLACK_TOKEN,
      payload: { slackToken: true },
    });
  }

  closeModal = () => {
    const { activeModal } = this.state;
    if (activeModal === 'SLACK_MODAL') this.closeSlackModal();
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

export default connect()(ModalContext);
