import React from 'react';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import eventFixtureList from '../../fixtures/events';

/**
 * @description Currently contains events page layout
 *
 * @function EventsPage
 *
 * @returns {JSX} Eventspage
 */

const EventsPage = (props) => {
  const { eventList } = props;
  const events = eventList || eventFixtureList;

  const eventCards = events.map(eventListItem => (<EventCard key={eventListItem.id} {...eventListItem} />));
  return (
    <div className="event__container">
      <div className="event__sidebar">
        <EventFilter />
        <Calendar />
      </div>
      <div className="event__gallery">
        {eventCards}
      </div>
      <div className="event__footer">
        footer
    </div>
    </div>
  );
};

export default EventsPage;
