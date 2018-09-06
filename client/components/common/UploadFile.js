import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

export default class UploadFile extends Component {
  render() {
    return (
      <div className="upload-file">
        <div className="upload-file__header-text">
          <span>FEATURED IMAGE</span>
        </div>
        <div className="upload-file__image-container">
          <input type="file" />
          Some Icon
        </div>
      </div>
    );
  }
}

UploadFile.propTypes = propTypes;
UploadFile.defaultProps = defaultProps;
