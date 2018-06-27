import React, { Component } from 'react';
import { Link } from 'react-router';

const EventList = ({ event }) => {
  const defaultImageUrl = 'https://www.omnihotels.com/-/media/images/hotels/pueave/hotel/pueave-omni-puerto-aventuras-beach-resort.jpg?h=660&la=en&w=1170';

  return (
    <div className="event">
      <div
        className="event-image"
         style={{backgroundImage: `url(${event.featured_image || defaultImageUrl})`}}
      >

      </div>
      <div className="event-details">
        <div className="event-details-wrapper">
          <div className="event-name">{event.venue}</div>
          <div className="event-meta">
            <p>Going down on {event.date}</p>
            <p>{event.attendees_count} are attending</p>
          </div>
        </div>
        <div className="event-meta">
          <Link
            to={`/clubs/${event.social_event}/events/${event.id}`}
            className="btn btn-primary btn-lg"
          >
            See who is going
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventList;
