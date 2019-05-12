import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import formatDate from '../../utils/formatDate';
import SlackIcon from '../../assets/icons/SlackIcon';

const EventCard = (props) => {
  document.title = 'Events page';
  const {
    id, title, startDate, socialEvent, featuredImage,
  } = props;
  
  const date = new Date(startDate);
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortMonth = shortMonths[date.getMonth()];

  return (
    <Link className="event-link" to={`/events/${id}`}>
      <div className="event-card">
        <div className="event-card__gradient">
          <img src={featuredImage || '/assets/img/img_group_selfie.jpg'} alt={title} className="event-card__picture" />
        </div>
        <div className="event-card__label">
            <p>Lagos</p>
        </div>
        <div className="event-card__action">
            <p className="event-card__slack">{<SlackIcon width="100%" color="black" />}</p>
        </div>
        <div className="event-card__caption-group">
          <div className="event-card__date">
            <p className="event-card__month">{shortMonth}</p>
            <p className="event-card__day">{date.getDate()}</p>
          </div>
          <div className="event-card__details">
            <p className="event-card__caption event-card__caption--title">{title || 'Swimming Meetup'}</p>
            <p className="event-card__caption event-card__caption--date">{formatDate(startDate) || 'Saturday, July 22nd 2018'}</p>
            <p className="event-card__caption event-card__caption--tags">{`#${socialEvent.name}` || '#swimming #meetup'}</p>
          </div>
        </div>
      </div>
    </Link>

  );
};
EventCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  startDate: PropTypes.string,
  featuredImage: PropTypes.string,
  socialEvent: PropTypes.objectOf(PropTypes.any),
};

EventCard.defaultProps = {
  id: '',
  title: '',
  startDate: '',
  socialEvent: {},
  featuredImage: '',

};


export default EventCard;
