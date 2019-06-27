import React, { Component } from "react";

/**
 * @description Displays a spinner. Note: you can pass spinner height 
 * and width as props.
 * 
 * @function Spinner
 * 
 * @param {object} props
 * 
 * @returns {views} Spinner
 */
const Spinner = (props) => {
  const { spinnerHeight, spinnerWidth } = props;
  return (
    <div className="spinner_container"
      style={{
        height: spinnerHeight || "100vh",
        width: spinnerWidth || "100%"
      }} >
      <div className="spinner">
        &nbsp;
      </div>
    </div >
  )
}

export default Spinner;
