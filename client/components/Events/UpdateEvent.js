import React, { Component } from 'react';


class UpdateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: require('../../assets/img/insert-image.jpg')
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      console.log('You clicked outside of me!');
    }
  }

  previewImage(e) {
    const image = e.target.files[0];
    const imgReader = new FileReader();
    imgReader.addEventListener('load', () => {
      this.setState({
        imgSrc: imgReader.result
      });
    });
    if (image) {
      imgReader.readAsDataURL(image);
    }
  }

  render() {
    return (
      <div>
        <form className="event_form">
        <h4>UPDATE EVENT</h4>
        <hr/>
        <label htmlFor="event_title">Title:</label>
        <input id="event_title" className="event_title _event full_width" type="text" placeholder="Enter the event title"/>
        <label htmlFor="event_description">Description:</label>
        <textarea id="event_description" className="event_description _event full_width" placeholder="Enter the event description"/>
        <label htmlFor="event_venue">Venue:</label>
        <input id="event_venue" className="event_venue _event full_width" type="text" placeholder="Enter the event venue"/>
        <label htmlFor="event_date" className="date_label">Date:</label>
        <input id="event_date" className="event_date _event" type="date"/>
        <label>Featured Image:</label>
        <div className="image-upload">
          <label htmlFor="file-input">
            <img className="uploadPreview" id="uploadPreview" src={this.state.imgSrc}/>
          </label>
          <input className="uploadImage" id="file-input" type="file" onChange={(e) => { this.previewImage(e); }}/>
        </div>
        <button type="submit" className="event_button _event">SUBMIT</button>
        </form>
      </div>
    );
  }
}

export default UpdateEvent;
