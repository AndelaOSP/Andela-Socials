import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// defaultProps
import { baseFormProps } from '../../../utils/defaultProps';


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
  error: {
    hasError,
    message,
  },
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
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      className="as-form-group__input"
      disabled={disabled}
      defaultValue={defaultValue}
      onChange={onChange}
    />
    {
      hasError && <span className="as-form-group__error">{message}</span>
    }
  </div>
);

InputField.defaultProps = baseFormProps;

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password']).isRequired,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    message: PropTypes.string,
  }).isRequired,
};

export default InputField;
