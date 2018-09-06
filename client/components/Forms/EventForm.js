import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  InputField,
  TextField,
  UploadField,
} from '../common/Form';

class EventForm extends Component {
  errors = {
    title: {
      hasError: false,
      message: 'Enter the title for the event',
    },
    description: {
      hasError: false,
      message: 'Enter the description for the event',
    },
    venue: {
      hasError: false,
      message: 'Enter the venue of the event',
    },
    date: {
      hasError: false,
      message: 'Choose the date of the event',
    },
    featuredImage: {
      hasError: false,
      message: 'Upload an image for the event',
    },
  };

  state = {
    formData: this.props.formData,
    errors: this.errors,
  };

  commonProps = (id, type, label, formData, error) => ({
    id: `event-${id}`,
    name: id,
    label,
    placeholder: label,
    defaultValue: formData[id],
    error,
    type,
  });


  renderField = (fieldType, type, id, label, formData, error) => {
    if (fieldType === 'input') {
      if (type === 'file') {
        return (<UploadField
          {...this.commonProps(id, type, label, formData, error)} />);
      }
      return (<InputField
        {...this.commonProps(id, type, label, formData, error)}
        onChange={this.handleFormInput}/>);
    }
    return (<TextField
      {...this.commonProps(id, type, label, formData, error)}
      onChange={this.handleFormInput}/>);
  }


  validateFormData = (formData) => {
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const errorFields = Object.keys(errors);

    errorFields.forEach((field) => {
      if (formData[field].length === 0) {
        errors[field].hasError = true;
      } else {
        errors[field].hasError = false;
      }
    });

    const isValid = errorFields.every(field => errors[field].hasError === false);

    return {
      isValid, errors,
    };
  };

  formSubmitHandler = (e) => {
    const { formMode } = this.props;
    const { formData } = this.state;

    e.preventDefault();
    const {
      isValid, errors,
    } = this.validateFormData(formData);

    this.setState({ errors });

    if (isValid) {
      if (formMode === 'create') {
        // CALL Create endpoint
      } else if (formMode === 'update') {
        // CALL Update endpoint
      }
    }
  };

  handleFormInput = (e) => {
    const { formData } = this.state;
    const newFormData = Object.assign({}, formData);

    newFormData[e.target.name] = e.target.value.trim();

    this.setState({ formData: newFormData });
  };

  render() {
    const { errors } = this.state;
    const {
      formId,
      formData,
    } = this.props;

    return (
      <form
        id={formId}
        className="create-event-form"
        onSubmit={this.formSubmitHandler}
      >
        {this.renderField('input', 'text', 'title', 'Title', formData, errors.title)}
        {this.renderField('text', 'text', 'description', 'Description', formData, errors.description)}
        {this.renderField('input', 'text', 'venue', 'Venue', formData, errors.venue)}
        {this.renderField('input', 'file', 'featuredImage', 'Featured Image', formData, errors.featuredImage)}
      </form>
    );
  }
}
EventForm.defaultProps = {
  formData: {
    title: '',
    description: '',
    venue: '',
    date: '',
    imgURL: '',
  },
};

EventForm.propTypes = {
  formMode: PropTypes.oneOf(['create', 'update']).isRequired,
  formId: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    venue: PropTypes.string,
    date: PropTypes.string,
    imgURL: PropTypes.string,
  }),
};

export default EventForm;
