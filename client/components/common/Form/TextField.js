import React from 'react';
import classNames from 'classnames';

import {
  baseDefaultProps,
  basePropTypes,
} from './propsDefs';

const TextField = ({
  id,
  name,
  placeholder,
  label,
  onChange,
  className,
  value,
  disabled,
  error: {
    hasError,
    message,
  },
  required,
}) => (
  <div className={
    classNames('as-form-group as-form-group--text-field', {
      'has-error': hasError,
      [className]: className,
    })
  }>
    {
      label && <label htmlFor={id} className="as-form-group__label">{label}</label>
    }
    <textarea
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      className="as-form-group__input as-form-group__input--text_area"
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
    {
      hasError && <span className="as-form-group__error">{message}</span>
    }
  </div>
);

TextField.defaultProps = { ...baseDefaultProps };

TextField.propTypes = { ...basePropTypes };

export default TextField;
