import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SubmitForm extends Component {
  formSubmitHandler = (e) => {
    e.preventDefault();
    this.props.submitForm();
  }

  render() {
    const { formText } = this.props;
    return (
      <form
        id="submit-event-form"
        onSubmit={this.formSubmitHandler}
      >
        <div className="modal__form-text">{formText}</div>
      </form>
    );
  }
}

SubmitForm.propTypes = {
  formText: PropTypes.string,
  submitForm: PropTypes.func.isRequired,
};

export default SubmitForm;
