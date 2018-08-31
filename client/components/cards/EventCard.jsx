import React from 'react';
import PropTypes from 'prop-types';

import formatDate from '../../utils/formatDate';

const EventCard = (props) => {
  document.title = 'Events page';
  const {
    title, startDate, socialEvent,
  } = props;

  return (
    <div className="event-card">
      <img src="/assets/img/img_group_selfie.jpg" alt="event img" className="event-card__picture" />
      <div className="event-card__caption-group">
        <p className="event-card__caption event-card__caption--title">{title || 'Swimming Meetup'}</p>
        <p className="event-card__caption event-card__caption--date">{formatDate(startDate) || 'Saturday, July 22nd 2018'}</p>
        <p className="event-card__caption event-card__caption--tags">{`#${socialEvent.name}` || '#swimming #meetup'}</p>
      </div>
    </div>

  );
};
EventCard.propTypes = {
  title: PropTypes.string,
  startDate: PropTypes.string,
  socialEvent: PropTypes.objectOf(PropTypes.any),
};

EventCard.defaultProps = {
  title: '',
  startDate: '',
  socialEvent: {},
};


export default EventCard;
