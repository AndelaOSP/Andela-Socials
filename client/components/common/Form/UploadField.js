import React, { Component, Fragment } from 'react';

// Components
import { InputField } from '.';
import { UploadIcon, CloseIcon } from '../../../assets/icons';

class UploadField extends Component {
  state = {
    imagePreviewUrl: '',
    error: {
      hasError: false,
      message: 'Upload an image for the event',
    },
  };

  handleImageChange = (e) => {
    e.preventDefault();

    // FileReader allows reading of files stored on user's computer
    const reader = new FileReader();
    const uploadedFile = e.target.files;
    const acceptedFormats = ['image/jpeg', 'image/png'];
    const validFormat = acceptedFormats.includes(e.target.files[0].type);

    if (validFormat === false) {
      this.setState({
        error: {
          hasError: true,
          message: 'Unsupported file format, we support PNG and JPG',
        },
      });
    } else {
      reader.onloadend = () => {
        this.setState({
          imagePreviewUrl: reader.result,
          error: { hasError: false },
        });
      };

      reader.readAsDataURL(uploadedFile[0]);
    }
  };

  removeUploaded = () => {
    this.setState({ imagePreviewUrl: null });
  };

  render() {
    const {
      imagePreviewUrl,
      error,
    } = this.state;

    return (
      <InputField {...this.props} className="upload-field" onChange={this.handleImageChange} error={error.hasError && error}>
        <div className={`upload-field__image-preview ${imagePreviewUrl && 'image-preview'}`}>
          {imagePreviewUrl && (
            <Fragment>
              <button className="image-preview__close" type="button" onClick={this.removeUploaded}>
                {CloseIcon}
              </button>
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
