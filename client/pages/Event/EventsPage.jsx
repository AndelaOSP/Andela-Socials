import React from 'react';
import { connect } from 'react-redux';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import formatDate from '../../utils/formatDate';
import { getEventsList } from '../../actions/graphql/eventGQLActions';
import { getCategoryList } from '../../actions/graphql/categoryGQLActions';
import EventNotFound from '../../components/EventNotFound';

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
      categoryList: [],
      selectedVenue: '',
      selectedCategory: '',
      eventStartDate: formatDate(Date.now(), 'YYYY-MM-DD'),
      lastEventItemCursor: '',
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
    this.getCategories({
      first: 20, last: 20,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      events, socialClubs,
    } = nextProps;

    const eventLength = events.length;
    const lastEventItemCursor = eventLength ? events[eventLength - 1].cursor : '';
    this.setState({
      eventList: events,
      categoryList: socialClubs.socialClubs,
      lastEventItemCursor,
    });
  }

  getFilteredEvents(filterDate, filterLocation, filterCategory) {
    const {
      eventStartDate,
      selectedVenue,
      selectedCategory,
    } = this.state;
    const startDate = filterDate || eventStartDate;
    const location = filterLocation || selectedVenue;
    const category = filterCategory || selectedCategory;
    this.setState({
      eventStartDate: startDate,
      selectedVenue: location,
      selectedCategory: category,
    });
    this.getEvents({
      startDate,
      venue: location,
      category,
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
    after,
  }) => {
    const { getEventsList } = this.props;
    getEventsList({
      startDate, venue, category, after,
    });
  }

  /**
  * @description Gets list of categories
   *
   * @memberof EventsPage
   */
  getCategories = ({
    first,
    last,
  }) => {
    const { getCategoryList } = this.props;
    getCategoryList({
      first,
      last,
    });
  }

  /**
  * @description It loads more list of events
  *
   * @memberof EventsPage
   */
  loadMoreEvents = () => {
    const {
      eventStartDate,
      selectedVenue,
      selectedCategory,
      lastEventItemCursor,
    } = this.state;
    this.getEvents({
      startDate: eventStartDate,
      venue: selectedVenue,
      category: selectedCategory,
      after: lastEventItemCursor,
    });
  }

  /**
  * @description It renders list of event card
  *
   * @memberof EventsPage
   */
  renderEventGallery = () => {
    const { eventList } = this.state;
    if (eventList.length) {
      const listOfEventCard = eventList.map(eventItem => (
        <EventCard key={eventItem.node.id}
          {...eventItem.node} />));
      return (<div className="event__gallery">
        {listOfEventCard}
      </div>);
    }
    return <EventNotFound statusMessage="404" mainMessage="Events not found" />;
  }

  render() {
    const { categoryList } = this.state;
    const catList = categoryList.map(item => ({
      id: item.node.id,
      title: item.node.name,
      selected: false,
      key: 'category',
    }));
    return (
      <div className="event__container">
        <div className="event__sidebar">
          <EventFilter categoryList={catList} filterSelected={this.getFilteredEvents} />
          <Calendar dateSelected={this.getFilteredEvents} />
        </div>
        {this.renderEventGallery()}
        <div className="event__footer">
          <button onClick={this.loadMoreEvents} type="button" className="btn-blue event__load-more-button">
            Load more
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  socialClubs: state.socialClubs,
});

export default connect(mapStateToProps, {
  getEventsList,
  getCategoryList,
})(EventsPage);
