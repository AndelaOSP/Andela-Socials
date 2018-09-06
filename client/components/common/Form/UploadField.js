import React, { Component, Fragment } from 'react';

// Components
import { InputField } from '.';
import { UploadIcon, CloseIcon } from '../../../assets/icons';

class UploadField extends Component {
  state = { imagePreviewUrl: '' };

  handleImageChange = (e) => {
    e.preventDefault();

    // FileReader allows reading of files stored on user's computer
    const reader = new FileReader();
    const uploadedFile = e.target.files;
    reader.onloadend = () => {
      this.setState({ imagePreviewUrl: reader.result });
    };

    reader.readAsDataURL(uploadedFile[0]);
  };

  removeUploaded = () => {
    this.setState({ imagePreviewUrl: null });
  }

  render() {
    const { imagePreviewUrl } = this.state;

    return (
      <InputField className="upload-field" onChange={this.handleImageChange} {...this.props}>
        <div className={`upload-field__image-preview ${imagePreviewUrl && 'image-preview'}`}>

          {imagePreviewUrl && (
            <Fragment>
              <button className="image-preview__close" type="button" onClick={this.removeUploaded}>{CloseIcon}</button>
              <img src={imagePreviewUrl} className="image-preview__display" alt="" />
            </Fragment>
          )}

          <div className="upload-field__placeholder">
            {UploadIcon}
            <span className="upload-field__placeholder--description">Click to upload file</span>
          </div>
        </div>
      </InputField>
    );
  }
}

export default UploadField;
