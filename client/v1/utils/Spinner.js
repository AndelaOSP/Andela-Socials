import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description Displays a spinner. Note: you can pass spinner height
 * and width as props.
 * @function Spinner
 * @param {object} props
 * @returns {views} Spinner
 */
const Spinner = (props) => {
  const {
    spinnerHeight, spinnerWidth,
  } = props;
  const height = spinnerHeight === 0 ? '100vh' : spinnerHeight;
  const width = spinnerWidth === 0 ? '100%' : spinnerWidth;
  return (
    <div className="spinner_container"
      style={{
        height,
        width,
      }} >
      <div className="spinner"/>
    </div >
  );
};

Spinner.propTypes = {
  spinnerHeight: PropTypes.number,
  spinnerWidth: PropTypes.number,
};

Spinner.defaultProps = {
  spinnerHeight: 0,
  spinnerWidth: 0,
};

export default Spinner;
