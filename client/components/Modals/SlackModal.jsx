import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SlackModal extends Component {
  formSubmitHandler = (e) => {
    const { dismiss } = this.props;
    e.preventDefault();
    dismiss();
    window.location.href = '/api/v1/slack/authorize';
  }

  render() {
    const { formId } = this.props;
    return (
      <form
        id={formId}
        onSubmit={this.formSubmitHandler}>
        <p style={{ fontWeight: 400 }}>
          To add your event to a slack channel we need you to connect to slack first.
        </p>
      </form>
    );
  }
}

SlackModal.propTypes = {
  dismiss: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
};

export default connect()(SlackModal);
