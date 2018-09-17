import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';

import IncrementalSelect from '../common/IncrementalSelect';
import TimePicker from '../common/Form/TimePicker';
import DateTimePicker from '../common/Form/DateTimePicker';

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
    featuredImage: {
      hasError: false,
      message: 'Upload an image for the event',
    },
    time: {
      hour: {
        hasError: false,
        message: 'Invalid hour provided',
      },
      minute: {
        hasError: false,
        message: 'Invalid minute provided',
      },
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


  renderField = (fieldType, type, id, label, formData, error, value) => {
    if (fieldType === 'input') {
      if (type === 'file') {
        return (<UploadField
          {...this.commonProps(id, type, label, formData, error)}
          onChange={this.handleFormInput} />);
      }
      return (<InputField
        value={value}
        {...this.commonProps(id, type, label, formData, error)}
        onChange={this.handleFormInput}/>);
    }
    return (<TextField
      value={value}
      {...this.commonProps(id, type, label, formData, error)}
      onChange={this.handleFormInput}/>);
  }


  renderTimePicker = type => (
    <TimePicker
      type={type}
      onChange={this.timeSelectHandler}
      errors={this.state.errors.time}
      values={this.state.formData[type]}
    />
  )

  formatDate = formData => (`${formData.date} ${formData.hour}:${formData.minute}:00`);

  validateFormData = (formData) => {
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const errorFields = Object.keys(errors);

    errorFields.forEach((field) => {
      if ((field !== 'time' && field !== 'imgUrl') && formData[field].length === 0) {
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
    const {
      formMode, dismiss,
    } = this.props;
    const { formData } = this.state;

    e.preventDefault();
    const {
      isValid, errors,
    } = this.validateFormData(formData);

    this.setState({ errors });

    if (isValid) {
      const startDate = this.formatDate(formData.start);
      const endDate = this.formatDate(formData.end);
      if (formMode === 'create') {
        const { createEvent } = this.props;
        createEvent({
          title: formData.title,
          description: formData.description,
          featuredImage: formData.imgUrl,
          venue: formData.venue,
          startDate: dateFns.format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          endDate: dateFns.format(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          categoryId: 'Q2F0ZWdvcnlOb2RlOjI=', // To be populated on eventsform in next PR
          timezone: 'Africa/Algiers', // To be populated on eventsform in next PR
        });
        dismiss();
      } else if (formMode === 'update') {
        // CALL Update endpoint
      }
    }
  };

  handleFormInput = (e) => {
    const { formData } = this.state;
    const newFormData = Object.assign({}, formData);

    newFormData[e.target.name] = e.target.value;

    this.setState({ formData: newFormData });
  };

  timeSelectHandler = (type, name, value) => {
    const dateTime = { ...this.state.formData[type] };
    const formDataCopy = { ...this.state.formData };
    dateTime[name] = value;
    formDataCopy[type] = dateTime;
    this.setState({ formData: formDataCopy });
  };

  getTimeValues = type => (
    `${this.state.formData[type].hour}:${this.state.formData[type].minute}`
  )

  render() {
    const { errors } = this.state;
    const {
      formId,
      formData,
    } = this.props;
    const {
      title, description, venue, featuredImage, start, end,
    } = this.state.formData;

    return (
      <form
        id={formId}
        className="create-event-form"
        onSubmit={this.formSubmitHandler}
      >
        {this.renderField('input', 'text', 'title', 'Title', formData, errors.title, title)}
        {this.renderField('text', 'text', 'description', 'Description', formData, errors.description, description)}
        {this.renderField('input', 'text', 'venue', 'Venue', formData, errors.venue, venue)}
        {this.renderField('input', 'file', 'featuredImage', 'Featured Image', formData, errors.featuredImage, featuredImage)}
        {/* // TODO: Specify the exact measures for uploads, let's approximate for now */}
        <span>Note: A 1600 x 800 image is recommended</span>
        <div className="date-time-picker-wrapper">
          <DateTimePicker
            type="start"
            label="start-date"
            time={this.renderTimePicker('start')}
            timeValue={this.getTimeValues('start')}
            dateSelected={this.timeSelectHandler}
            dateValue={start.date}
          />
          <DateTimePicker
            type="end"
            label="end-date"
            time={this.renderTimePicker('end')}
            timeValue={this.getTimeValues('end')}
            dateSelected={this.timeSelectHandler}
            dateValue={end.date}
          />
        </div>
      </form>
    );
  }
}

EventForm.defaultProps = {
  formData: {
    title: '',
    description: '',
    venue: '',
    featuredImage: '',
    start: {
      hour: '17',
      minute: '00',
      date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    },
    end: {
      hour: '18',
      minute: '00',
      date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    },
  },
};

EventForm.propTypes = {
  formMode: PropTypes.oneOf(['create', 'update']).isRequired,
  createEvent: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    venue: PropTypes.string,
    featuredImage: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
  }),
};

export default EventForm;
