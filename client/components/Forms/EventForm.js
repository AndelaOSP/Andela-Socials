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
    imgUrl: {
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
    }
  };

  state = {
    formData: this.props.formData,
    errors: this.errors,
    category: '',
    categoryIsValid: true,
    timezone: '',
    timezoneIsValid: true,
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
          {...this.commonProps(id, type, label, formData, error)} />);
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


  renderTimePicker = (type) => (
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
    const { category, timezone } = this.state;
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
    const {
      formMode,
      dismiss,
    } = this.props;
    const {
      formData,
      category,
      timezone,
    } = this.state;

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
          categoryId: category,
          timezone,
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
    const dateTime = {...this.state.formData[type]};
    const formDataCopy = {...this.state.formData};
    dateTime[name] = value;
    formDataCopy[type] = dateTime;
    this.setState({
      formData: formDataCopy 
    })
  };

  getTimeValues = (type) => (
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
    const { title, description, venue } = this.state.formData
    const categoryClass = categoryIsValid ? 'category-label' : 'category-label category-error';
    const timezoneClass = timezoneIsValid ? 'category-label' : 'category-label category-error';
    return (
      <form
        id={formId}
        className="create-event-form"
        onSubmit={this.formSubmitHandler}
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
        {this.renderField('input', 'file', 'featuredImage', 'Featured Image', formData, errors.imgUrl)}
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
            inputProps={{ name: 'timezone', placeholder: 'Select Timezone...' }}
          />
        </div>
        <div className='date-time-picker-wrapper'>
          <DateTimePicker 
            type="start"
            label="start-date"
            time={this.renderTimePicker("start")} 
            timeValue={this.getTimeValues("start")}
            dateSelected={this.timeSelectHandler}
            dateValue={this.state.formData.start.date}
          />
          <DateTimePicker 
            type="end"
            label="end-date"
            time={this.renderTimePicker("end")} 
            timeValue={this.getTimeValues("end")}
            dateSelected={this.timeSelectHandler}
            dateValue={this.state.formData.end.date}
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
    imgUrl: '',
    start: {
      hour: "17",
      minute: "00",
      date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    },
    end: {
      hour: "18",
      minute: "00",
      date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    },
  },
};

EventForm.propTypes = {
  formMode: PropTypes.oneOf(['create', 'update']).isRequired,
  createEvent: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  formData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    venue: PropTypes.string,
    imgUrl: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
  }),
};

export default EventForm;
