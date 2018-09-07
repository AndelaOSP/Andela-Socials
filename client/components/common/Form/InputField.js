import React, { Fragment } from 'react';
import classNames from 'classnames';

import {
  baseDefaultProps,
  basePropTypes,
} from './propsDefs';


const InputField = ({
  id,
  name,
  placeholder,
  type,
  label,
  onChange,
  className,
  defaultValue,
  disabled,
  children,
  error: {
    hasError,
    message,
  },
  required,
  value,
}) => (
  <div className={
    classNames('as-form-group as-form-group--input-field', {
      'has-error': hasError,
      [className]: className,
    })
  }>
    {
      label && <label htmlFor={id} className="as-form-group__label">{label}</label>
    }
    { children && <Fragment>{children}</Fragment> }
    <input
      id={id}
      name={name}
      type={type}
      className="as-form-group__input"
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      required={required}
      value={value}
    />
    {
      hasError && <span className="as-form-group__error">{message}</span>
    }
  </div>
);

InputField.defaultProps = { ...baseDefaultProps };

InputField.propTypes = { ...basePropTypes };

export default InputField;
