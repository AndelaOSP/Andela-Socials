import React from 'react';
import { connect } from 'react-redux';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import formatDate from '../../utils/formatDate';
import { getEventsList } from '../../actions/graphql/eventGQLActions';

/**
 * @description  contains events dashboard page
 *
 * @class EventsPage
 * @extends {React.Component}
 */
class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventStartDate: formatDate(Date.now(), 'YYYY-MM-DD'),
    };
    this.getFilteredEvents = this.getFilteredEvents.bind(this);
  }

  /**
 * React Lifecycle hook
 *
 * @memberof EventsPage
 * @returns {null}
 */
  componentDidMount() {
    const { eventStartDate } = this.state;
    this.getEvents({ startDate: eventStartDate });
  }

  componentWillReceiveProps(nextProps) {
    const { events } = this.props;
    if (events !== nextProps.events) {
      this.setState({ eventList: nextProps.events });
    }
  }

  getFilteredEvents(filterDate, filterLocation, filterCategory) {
    const { eventStartDate } = this.state;
    const startDate = filterDate ? filterDate : eventStartDate;
    this.setState({ eventStartDate: startDate });
    this.getEvents({
      startDate,
      venue: filterLocation,
      category: filterCategory,
    });
  }

  /**
  * @description Gets list of events
   *
   * @memberof EventsPage
   *
   * @param {string} startDate
   * @param {string} venue
   * @param {string} category
   */
  getEvents = ({
    startDate,
    venue,
    category,
  }) => {
    const {
      events,
      getEventsList,
    } = this.props;
    getEventsList({
      startDate, venue, category,
    });
    if (events.length) {
      this.setState({ eventList: events });
    }
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
    if (eventList.length) {
      return eventList.map(eventItem => (<EventCard key={eventItem.node.id}
        {...eventItem.node} />));
    }
    return <div>No Event found</div>;
  }

  render() {
    return (
      <div className="event__container">
        <div className="event__sidebar">
          <EventFilter filterSelected={this.getFilteredEvents}/>
          <Calendar dateSelected={this.getFilteredEvents}/>
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

const mapStateToProps = state => ({ events: state.events });

export default connect(mapStateToProps, { getEventsList })(EventsPage);
