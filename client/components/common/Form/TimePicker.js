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

const renderIncrementalSelect = (
  type,
  onChange,
  style,
  name,
  values,
  errors) => (
  <IncrementalSelect 
    {...timeProps[name]} 
    {...commonProps(type, onChange)}
    value={values[name]}
    error={errors[name]}
    style={style}
  />
)

const TimePicker = ({
  onChange,
  errors,
  values,
  type
}) => {
  return (
    <div className="liner">
      {renderIncrementalSelect(type, onChange, "time-left", "hour", values, errors)}
      {renderIncrementalSelect(type, onChange, "time-right", "minute", values, errors)}
    </div>
  )};

export default TimePicker;

TimePicker.propTypes = {
  onChange: PropTypes.func,
  errors: PropTypes.object,
  values: PropTypes.object,
  type: PropTypes.string
}
