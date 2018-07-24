import React, { Component } from 'react';
import ModalContainer from '../common/Modal/ModalContainer';
import UpdateEvent from './UpdateEvent';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showModal(event, toChange) {
    event.preventDefault();
    toChange.setState({
      show: true
    });
  }

  hideModal(event, toChange) {
    event.preventDefault();
    toChange.setState({
      show: false
    });
  }

  render() {
    return (
      <div>
        <br/><br/><br/><br/><br/><br/><br/>
        <ModalContainer show={ this.state.show } handleClose={event => this.hideModal(event, this)}>
          <UpdateEvent/>
        </ModalContainer>
        <button type="button" onClick={event => this.showModal(event, this)}>
          Open
        </button>
      </div>
    );
  }
}

export default EventDetails;
