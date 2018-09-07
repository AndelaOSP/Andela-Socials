import React from 'react';
import IncrementalSelect from '../IncrementalSelect';
import PropTypes from 'prop-types';

const options = (count) => {
  const options = [];
  for (let i=0; i < count; i++) {
    options.push(("0" + i).slice(-2));
  }
  return options;
}

const timeProps = {
  hour: {
    name: "hour",
    options: options(24) 
  },
  minute: {
    name: "minute",
    options: options(60) 
  }
};

const commonProps = (type, onChange) => ({
  type,
  onChange
});

const TimePicker = ({
  onChange,
  errors,
  values,
  type
}) => {
  return (
    <div className="liner">
      <IncrementalSelect 
        {...timeProps.hour}
        {...commonProps(type, onChange)}
        value={values.hour}
        error={errors.hour}
        style="time-left"
      />  
      <IncrementalSelect 
        {...timeProps.minute}
        {...commonProps(type, onChange)}
        value={values.minute}
        error={errors.minute}
        style="time-right"
      />  
    </div>
  )};

export default TimePicker;

TimePicker.propTypes = {
  onChange: PropTypes.func,
  errors: PropTypes.object,
  values: PropTypes.object,
  type: PropTypes.string
}
