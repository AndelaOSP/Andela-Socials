import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import formatDate from '../../utils/formatDate';
import { getEventsList, createEvent } from '../../actions/graphql/eventGQLActions';
import { getCategoryList } from '../../actions/graphql/categoryGQLActions';
import EventNotFound from '../../components/EventNotFound';
import mapListToComponent from '../../utils/mapListToComponent';
import { ModalContextCreator } from '../../components/Modals/ModalContext';

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
      events: {
        eventList, pageInfo: { hasNextPage },
      }, socialClubs,
    } = nextProps;
    const eventLength = eventList.length;
    const lastEventItemCursor = eventLength ? eventList[eventLength - 1].cursor : '';
    this.setState({
      eventList,
      hasNextPage,
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
      const listOfEventCard = mapListToComponent(eventList, EventCard);
      return (<div className="event__gallery">
        {listOfEventCard}
      </div>);
    }
    return <EventNotFound statusMessage="404" mainMessage="Events not found" />;
  }

  /**
  * @description It renders the create event FAB button
  *
   * @memberof EventsPage
   */
  renderCreateEventButton = () => (
    <ModalContextCreator.Consumer>
      {
        ({
          activeModal,
          openModal,
        }) => {
          // TODO: This should be removed, duplicate naming
          const {
            categories, createEvent, uploadImage,
          } = this.props;
          if (activeModal) return null;
          return (
            <button
              type="button"
              onClick={() => openModal('CREATE_EVENT', {
                modalHeadline: 'create event',
                formMode: 'create',
                formId: 'event-form',
                categories,
                createEvent,
                uploadImage,
                updateEvent: () => '',
              })}
              className="create-event-btn"
            >
              <span className="create-event-btn__icon">+</span>
            </button>
          );
        }
      }
    </ModalContextCreator.Consumer>
  );

  render() {
    const {
      categoryList,
      hasNextPage,
    } = this.state;
    const catList = Array.isArray(categoryList) ? categoryList.map(item => ({
      id: item.node.id,
      title: item.node.name,
      selected: false,
      key: 'category',
    })) : [];
    return (
      <div className="event__container">
        <div className="event__sidebar">
          <div className="event__sidebar-fixed">
            <EventFilter categoryList={catList} filterSelected={this.getFilteredEvents} />
            <Calendar dateSelected={this.getFilteredEvents} />
          </div>
        </div>
        {this.renderEventGallery()}
        <div className={`event__footer ${hasNextPage ? '' : 'event__footer--hidden'}`} >
          <button onClick={this.loadMoreEvents} type="button" className="btn-blue event__load-more-button">
            Load more
          </button>
        </div>
        {this.renderCreateEventButton()}
      </div>
    );
  }
}

EventsPage.defaultProps = { categories: [] };

EventsPage.propTypes = { categories: PropTypes.arrayOf(PropTypes.shape({})) };

const mapStateToProps = state => ({
  events: state.events,
  socialClubs: state.socialClubs,
});

export default connect(mapStateToProps, {
  getEventsList,
  getCategoryList,
  createEvent,
})(EventsPage);
