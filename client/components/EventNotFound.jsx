import React from 'react';
import PropTypes from 'prop-types';


const EventNotFound = (props) => {
  const {
    statusMessage, mainMessage, subMessage,
  } = props;
  return (

    <div className="no-events">
      <div className="no-events__container">
        <h1 className="no-events__status-message">
          {statusMessage}
        </h1>
        <h3 className="no-events__main-message">
          {mainMessage}
        </h3>
        <p>
          {subMessage}
        </p>
      </div>
    </div>
  );
};


EventNotFound.propTypes = {
  mainMessage: PropTypes.string,
  statusMessage: PropTypes.string,
  subMessage: PropTypes.string,
};

EventNotFound.defaultProps = {
  mainMessage: '',
  statusMessage: '',
  subMessage: '',
};


export default EventNotFound;
