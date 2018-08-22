import PropTypes from 'prop-types';

/**
 * Base default props for form fields
 * @type {object}
 */
export const baseDefaultProps = {
  placeholder: '',
  defaultValue: '',
  className: '',
  label: null,
  disabled: false,
  onChange: () => {},
  required: false,
};

/**
 * Base proptypes definition for form fields
 * @type {object}
 */
export const basePropTypes = {
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
  required: PropTypes.bool,
};
