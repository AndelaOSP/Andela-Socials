import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// defaultProps
import { baseFormProps } from '../../../utils/defaultProps';


const TextField = ({
  id,
  name,
  placeholder,
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
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="as-form-group__input as-form-group__input--text_area"
      onChange={onChange}
      disabled={disabled}
    />
    {
      hasError && <span className="as-form-group__error">{message}</span>
    }
  </div>
);

TextField.defaultProps = baseFormProps;

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    message: PropTypes.string,
  }).isRequired,
};

export default TextField;
