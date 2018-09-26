import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';
import TimezonePicker from 'react-timezone';

import IncrementalSelect from '../common/IncrementalSelect';
import TimePicker from '../common/Form/TimePicker';
import DateTimePicker from '../common/Form/DateTimePicker';
import CustomDropDown from '../common/CustomDropDown';

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
    category: '',
    categoryIsValid: true,
    timezone: '',
    timezoneIsValid: true,
  };

  componentDidUpdate(prevProps) {
    const { imageUploaded } = this.props;
    if (prevProps.imageUploaded !== imageUploaded) {
      this.handleUploadedImages(imageUploaded);
    }
  }

  handleUploadedImages = (imageUploaded) => {
    const {
      error,
      node,
    } = imageUploaded[imageUploaded.length - 1];
    // After the upload is successful, create the actual event
    if (!error && node.responseMessage) {
      this.saveCreatedEvent(node);
    }
  }

  saveCreatedEvent = (imageNode) => {
    const {
      formData,
      category,
      timezone,
    } = this.state;
    const startDate = this.formatDate(formData.start);
    const endDate = this.formatDate(formData.end);
    const {
      createEvent,
      dismiss,
    } = this.props;
    createEvent({
      title: formData.title,
      description: formData.description,
      venue: formData.venue,
      featuredImage: imageNode.imageUrl,
      startDate: dateFns.format(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      endDate: dateFns.format(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      categoryId: category,
      timezone,
    });
    dismiss();
  }

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
    switch(fieldType) {
      case "input":
        if (type === 'file') {
          return (<UploadField
            {...this.commonProps(id, type, label, formData, error)}
            onChange={this.handleFormInput} />);
        }
        return (<InputField
          value={value}
          {...this.commonProps(id, type, label, formData, error)}
          onChange={this.handleFormInput}/>);
      case "timePicker":
        return (<DateTimePicker
                type={type}
                label={label}
                time={this.renderTimePicker(type)}
                timeValue={this.getTimeValues(type)}
                dateSelected={this.timeSelectHandler}
                dateValue={this.state.formData[type].date}/>)
      default:
        return (<TextField
          value={value}
          {...this.commonProps(id, type, label, formData, error)}
          onChange={this.handleFormInput}/>);

    }
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

  handleCategory = (category) => {
    this.setState({ category });
  }

  handleTimezone = (timezone) => {
    this.setState({ timezone });
  }

  validateField = field => field !== '';

  validateFormData = (formData) => {
    const {
      category, timezone,
    } = this.state;
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const errorFields = Object.keys(errors);

    errorFields.forEach((field) => {
      if ((field !== 'time' && field !== 'imgUrl') && formData[field].length === 0) {
        errors[field].hasError = true;
      } else {
        errors[field].hasError = false;
      }
    });

    let isValid = errorFields.every(field => errors[field].hasError === false);
    const categoryIsValid = this.validateField(category);
    const timezoneIsValid = this.validateField(timezone);
    isValid = (timezoneIsValid && categoryIsValid) ? isValid : false;

    return {
      isValid,
      errors,
      categoryIsValid,
      timezoneIsValid,
    };
  };

  formSubmitHandler = (e) => {
    const { formMode } = this.props;
    const { formData } = this.state;

    e.preventDefault();
    const {
      isValid, errors, categoryIsValid, timezoneIsValid,
    } = this.validateFormData(formData);

    this.setState({
      errors,
      categoryIsValid,
      timezoneIsValid,
    });

    if (isValid) {
      if (formMode === 'create') {
        const { uploadImage } = this.props;
        // Upload event feature image and ensure it's uploaded
        uploadImage({ featuredImage: formData.featuredImage });
      } else if (formMode === 'update') {
        // CALL Update endpoint
      }
    }
  };

  getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());

  handleFormInput = (e) => {
    const {
      validity,
      files,
      name,
      value,
    } = e.target;

    const { formData } = this.state;

    const newFormData = Object.assign({}, formData);

    if (validity.valid) {
      if (files) {
        newFormData[name] = files[0];
      } else {
        newFormData[name] = value;
      }
    }

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
    const {
      errors,
      categoryIsValid,
      timezoneIsValid,
      timezone,
    } = this.state;
    const {
      formId,
      formData,
      categories,
    } = this.props;
    const {
      title, description, venue, featuredImage, start, end,
    } = this.state.formData;
    const categoryClass = categoryIsValid ? 'category-label' : 'category-label category-error';
    const timezoneClass = timezoneIsValid ? 'category-label' : 'category-label category-error';
    return (
      <form
        id={formId}
        className="create-event-form"
        onSubmit={this.formSubmitHandler}
        encType="multipart/form-data"
      >
        {this.renderField('input', 'text', 'title', 'Title', formData, errors.title, title)}
        {this.renderField('text', 'text', 'description', 'Description', formData, errors.description, description)}
        <span className={categoryClass}>Category</span>
        <CustomDropDown
          title="Select Category"
          list={categories}
          onSelected={this.handleCategory}
        />
        {this.renderField('input', 'text', 'venue', 'Venue', formData, errors.venue, venue)}
        {this.renderField('input', 'file', 'featuredImage', 'Featured Image', formData, errors.featuredImage, featuredImage)}
        {/* // TODO: Specify the exact measures for uploads, let's approximate for now */}
        <span>Note: A 1600 x 800 image is recommended</span>
        <div className="timezone-label">
          <span className={timezoneClass}>Timezone</span>
        </div>
        <div>
          <TimezonePicker
            value={timezone}
            onChange={this.handleTimezone}
            className="timezone"
            inputProps={{
              name: 'timezone', placeholder: 'Select Timezone...',
            }}
          />
        </div>
        <div className='date-time-picker-wrapper'>
          {this.renderField('timePicker', 'start', '', 'start-date')}
          {this.renderField('timePicker', 'end', '', 'end-date')}
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
  uploadImage: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
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
