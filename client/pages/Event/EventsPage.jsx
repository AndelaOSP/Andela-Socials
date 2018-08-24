import React from 'react';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import eventFixtureList from '../../fixtures/events';


/**
 * @description Currently contains events page layout
 *
 * @class EventsPage
 * @extends {React.Component}
 */
class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventList: [] };
  }

  /**
 * React Lifecycle hook
 *
 * @memberof EventsPage
 * @returns {null}
 */
  componentDidMount() {
    this.setState({ eventList: this.getEvents().length ? this.getEvents() : eventFixtureList });
  }

  /**
  * @description Gets list of events
   *
   * @memberof EventsPage
   */
  getEvents = () => {
    // Todo: Implement a call to get events
    const eventList = [];
    return eventList;
  }

  /**
  * @description It loads more list of events
  *
   * @memberof EventsPage
   */
  loadMoreEvents = () => {
    // Todo: Implement a call to load more events
  }

  /**
  * @description It renders list of event card
  *
   * @memberof EventsPage
   */
  renderEventGallery = () => {
    const { eventList } = this.state;
    return eventList.map(eventItem => (<EventCard key={eventItem.id} {...eventItem} />));
  }

  render() {
    return (
      <div className="event__container">
        <div className="event__sidebar">
          <EventFilter />
          <Calendar />
        </div>
        <div className="event__gallery">
          {this.renderEventGallery()}
        </div>
        <div className="event__footer">
          <button onClick={this.loadMoreEvents} type="button" className="btn-blue event__load-more-button">
            Load more
          </button>
        </div>
      </div>
    );
  }
}

export default EventsPage;
