import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DeleteForm extends Component {
  formSubmitHandler = (e) => {
    e.preventDefault();
    this.handleDelete();
  }
  
  handleDelete() {
    // To be implemented in next PR
    const { eventId } = this.props;
    const {
      deleteEvent,
      dismiss,
      back,
    } = this.props;
    deleteEvent(eventId);
    back();
    dismiss();
  }

  render() {
    const { formText } = this.props;
    return (
      <form
        id="delete-event-form"
        className="delete-form"
        onSubmit={this.formSubmitHandler}
      >
        <div>{formText}</div>
      </form>
    );
  }
}

DeleteForm.defaultProps = { formText: 'Are you sure you want to delete?' };

DeleteForm.propTypes = {
  formText: PropTypes.string,
  eventId: PropTypes.string.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  dismiss: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
};

export default DeleteForm;
