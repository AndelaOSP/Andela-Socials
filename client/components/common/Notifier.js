import React from 'react';
import PropTypes from 'prop-types';

const Notifer = (props) => {
  const { notification } = props;
  return (
    <div className="notifier">
      <div className="notifier__avatar">
        <img src={notification.profile} alt="Notification Avatar" />
      </div>
      <div className="notifier__text">
        <div className="notifier__text--description">
          <span className="notifier__text--description-strong">{notification.creator}</span> just
          created a new event{' '}
          <span className="notifier__text--description-strong">{notification.name}</span>
          <span className="notifier__text--time">{notification.time}</span>
        </div>
      </div>
    </div>
  );
};

Notifer.propTypes = {
  notification: PropTypes.shape({
    name: PropTypes.string,
    creator: PropTypes.string,
    profile: PropTypes.string,
    time: PropTypes.string,
    type: PropTypes.string,
  }),
}.isRequired;

export default Notifer;
