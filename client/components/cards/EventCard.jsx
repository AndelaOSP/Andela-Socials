import React from 'react';
import PropTypes from 'prop-types';


const EventCard = (props) => {
  document.title = 'Events page';
  const {
    eventTitle, eventDate, eventTags,
  } = props;
  return (
    <div className="event-card">
      <img src="/assets/img/img_group_selfie.jpg" alt="event img" className="event-card__picture" />
      <div className="event-card__caption-group">
        <p className="event-card__caption event-card__caption--title">{eventTitle || 'Swimming Meetup'}</p>
        <p className="event-card__caption event-card__caption--date">{eventDate || 'Saturday, July 22nd 2018'}</p>
        <p className="event-card__caption event-card__caption--tags">{eventTags || '#swimming #meetup'}</p>
      </div>
    </div>

  );
};
EventCard.propTypes = {
  eventDate: PropTypes.string,
  eventTags: PropTypes.string,
  eventTitle: PropTypes.string,
};

EventCard.defaultProps = {
  eventDate: '',
  eventTags: '',
  eventTitle: '',
};


export default EventCard;
