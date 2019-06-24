import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Calendar from '../../components/common/Calendar';
import EventFilter from '../../components/filter/EventFilter';
import EventCard from '../../components/cards/EventCard';
import formatDate from '../../utils/formatDate';
import { getEventsList, createEvent } from '../../actions/graphql/eventGQLActions';
import { getCategoryList } from '../../actions/graphql/categoryGQLActions';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature(events-list): persist startDate (#227)
import { changeStartDate } from '../../actions/eventActions';
import NoEvents from '../../components/NoEvents';
import Spinner from '../../utils/Spinner';
<<<<<<< HEAD
=======
import NoEvents from '../../components/NoEvents';
>>>>>>> #166284452 Update feedback message on Events page  (#216)
=======
>>>>>>> #166502105 Display loader while events are still loading (#223)
import mapListToComponent from '../../utils/mapListToComponent';
import { ModalContextCreator } from '../../components/Modals/ModalContext';

/**
 * @description  contains events dashboard page
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
      lastEventItemCursor: '',
      isLoadingEvents: false,
<<<<<<< HEAD
<<<<<<< HEAD
      slackToken: true,
=======
>>>>>>> #166502105 Display loader while events are still loading (#223)
=======
      slackToken: true,
>>>>>>> feat(slack-modal): implement slack token callback (#217)
    };
    this.getFilteredEvents = this.getFilteredEvents.bind(this);
  }

  /**
   * React Lifecycle hook
   * @memberof EventsPage
   * @returns {null}
  */
  componentDidMount() {
<<<<<<< HEAD
<<<<<<< HEAD
    const { startDate } = this.props.events;

    this.setState({ isLoadingEvents: true });
    this.getEvents({ startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD') });
  }

  /**
   * React Lifecycle hook
   * @memberof EventsPage
   * @param {Object} props
   * @returns state
   * @static
   */
  static getDerivedStateFromProps(props) {
    const { events } = props;
    if (events && events.eventList) {
      const {
        events: {
          eventList,
          pageInfo: { hasNextPage },
          getEventsLoading,
          requestedStartDate,
        }, socialClubs, slackToken,
      } = props;
      const eventLength = eventList.length;
      const lastEventItemCursor = eventLength ? eventList[eventLength - 1].cursor : '';

      return {
        eventList,
        hasNextPage,
        categoryList: socialClubs.socialClubs,
        lastEventItemCursor,
        isLoadingEvents: getEventsLoading,
        requestedStartDate,
        slackToken,
      };
    }
    return null;
  }

  getFilteredEvents({ startDate, filterLocation, filterCategory }) {
    const {
      selectedVenue,
      selectedCategory,
    } = this.state;
    const location = filterLocation === null ? null : (filterLocation || selectedVenue);
    const category = filterCategory === null ? null : (filterCategory || selectedCategory);

    startDate && this.props.changeStartDate(startDate);
    this.setState(
      () => {
        const filter = {};
        filter.selectedVenue = location;
        filter.selectedCategory = category;
        return Object.keys(filter).length ? filter : null;
      }
    );
=======
    const { eventStartDate } = this.state;
=======
    const { startDate } = this.props.events;
>>>>>>> feature(events-list): persist startDate (#227)

    this.setState({ isLoadingEvents: true });
    this.getEvents({ startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD') });
  }

  /**
   * React Lifecycle hook
   * @memberof EventsPage
   * @param {Object} props
   * @returns state
   * @static
   */
  static getDerivedStateFromProps(props) {
    const { events } = props;
    if (events && events.eventList) {
      const {
        events: {
          eventList, pageInfo: { hasNextPage },
        }, socialClubs, slackToken,
      } = props;
      const eventLength = eventList.length;
      const lastEventItemCursor = eventLength ? eventList[eventLength - 1].cursor : '';

      return {
        eventList,
        hasNextPage,
        categoryList: socialClubs.socialClubs,
        lastEventItemCursor,
        isLoadingEvents: false,
        slackToken,
      };
    }
    return null;
>>>>>>> #166502105 Display loader while events are still loading (#223)
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
  getFilteredEvents({ startDate, location, category }) {
=======
  getFilteredEvents({ startDate, filterLocation, filterCategory }) {
    const {
      selectedVenue,
      selectedCategory,
    } = this.state;
    const location = filterLocation === null ? null : (filterLocation || selectedVenue);
    const category = filterCategory === null ? null : (filterCategory || selectedCategory);

>>>>>>> fix(filter): add all to filter list (#228)
    startDate && this.props.changeStartDate(startDate);
    this.setState(
      () => {
        const filter = {};
        filter.selectedVenue = location;
        filter.selectedCategory = category;
        return Object.keys(filter).length ? filter : null;
      }
    );
  }

>>>>>>> feature(events-list): persist startDate (#227)
  componentDidUpdate(prevProps, prevState) {
    const { startDate } = this.props.events;
    const {
      selectedVenue,
      selectedCategory,
    } = this.state;
    if (
      prevProps.events.startDate !== startDate ||
      prevState.selectedVenue !== selectedVenue ||
      prevState.selectedCategory !== selectedCategory
    ) {
      this.getEvents({
<<<<<<< HEAD
<<<<<<< HEAD
        startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD'),
=======
        startDate,
>>>>>>> feature(events-list): persist startDate (#227)
=======
        startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD'),
>>>>>>> bug(event-filter): fix event filter bug (#230)
        venue: selectedVenue,
        category: selectedCategory,
      });
    }
  }

  /**
   * @description Gets list of events
   * @memberof EventsPage
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
   * @memberof EventsPage
  */
  loadMoreEvents = () => {
    const {
      selectedVenue,
      selectedCategory,
      lastEventItemCursor,
    } = this.state;
    const { startDate } = this.props.events;

    this.getEvents({
<<<<<<< HEAD
<<<<<<< HEAD
      startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD'),
=======
      startDate,
>>>>>>> feature(events-list): persist startDate (#227)
=======
      startDate: startDate || formatDate(Date.now(), 'YYYY-MM-DD'),
>>>>>>> bug(event-filter): fix event filter bug (#230)
      venue: selectedVenue,
      category: selectedCategory,
      after: lastEventItemCursor,
    });
  }

  /**
   * @description It renders list of event card
   * @memberof EventsPage
   */
  renderEventGallery = () => {
    const {
<<<<<<< HEAD
      eventList, isLoadingEvents, requestedStartDate,
    } = this.state;
    const { startDate } = this.props.events;

    if (eventList.length && startDate === requestedStartDate) {
=======
      eventList, isLoadingEvents,
    } = this.state;

    if (isLoadingEvents) {
      return (
        <div className="event__loading">
          <Spinner spinnerHeight={20} spinnerWidth={20} />
        </div>
      );
    }

    if (eventList.length) {
>>>>>>> #166502105 Display loader while events are still loading (#223)
      const listOfEventCard = mapListToComponent(eventList, EventCard);
      return (<div className="event__gallery">
        {listOfEventCard}
      </div>);
    }

<<<<<<< HEAD
    if (isLoadingEvents) {
      return (
        <div className="event__loading">
          <Spinner spinnerHeight={20} spinnerWidth={20} />
        </div>
      );
    }

=======
>>>>>>> #166284452 Update feedback message on Events page  (#216)
    return <NoEvents />;
  }

  /**
   * @description It renders the create event FAB button
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

  openSlackModal = () => (
    <ModalContextCreator.Consumer>
      {
        ({
          activeModal,
          openModal,
        }) => {
          const { slackToken } = this.state;
          if (activeModal || slackToken) return null;
          openModal('SLACK_MODAL', {
            modalHeadline: 'Connect App to Slack',
            formId: 'slack-form',
          });
        }
      }
    </ModalContextCreator.Consumer>
  );

  render() {
    const {
      categoryList,
      hasNextPage,
      requestedStartDate,
    } = this.state;
<<<<<<< HEAD
<<<<<<< HEAD
    const { subNavHidden, events: { startDate } } = this.props;
=======
    const { subNavHidden } = this.props;
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
=======
    const { subNavHidden, events: { startDate } } = this.props;
>>>>>>> feature(events-list): persist startDate (#227)
    const catList = Array.isArray(categoryList) ? categoryList.map(item => ({
      id: item.node.id,
      title: item.node.name,
      selected: false,
      key: 'category',
    })) : [];
    return (
      <div className="event__container">
        <div className="event__sidebar">
<<<<<<< HEAD
<<<<<<< HEAD
          <div className={`event__sidebar-fixed ${subNavHidden ? 'event__sidebar-expanded' : ''}`}>
            <EventFilter categoryList={catList} filterSelected={this.getFilteredEvents} />
            <Calendar selectedDate={startDate || Date.now()} dateSelected={this.getFilteredEvents} />
=======
          <div className="event__sidebar-fixed">
=======
          <div className={`event__sidebar-fixed ${subNavHidden ? 'event__sidebar-expanded' : ''}`}>
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
            <EventFilter categoryList={catList} filterSelected={this.getFilteredEvents} />
<<<<<<< HEAD
            <Calendar dateSelected={this.getFilteredEvents} />
>>>>>>> feature(ui): fix header and sidebar (#211)
=======
            <Calendar selectedDate={startDate || Date.now()} dateSelected={this.getFilteredEvents} />
>>>>>>> feature(events-list): persist startDate (#227)
          </div>
        </div>
        {this.renderEventGallery()}
        {this.openSlackModal()}
<<<<<<< HEAD
        <div className={`event__footer ${hasNextPage && startDate === requestedStartDate ? '' : 'event__footer--hidden'}`} >
=======
        <div className={`event__footer ${hasNextPage ? '' : 'event__footer--hidden'}`} >
>>>>>>> feat(slack-modal): implement slack token callback (#217)
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
  subNavHidden: state.uiReducers.subNavHidden,
<<<<<<< HEAD
<<<<<<< HEAD
  slackToken: state.slackToken,
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
=======
  slackToken: state.slackToken,
>>>>>>> feat(slack-modal): implement slack token callback (#217)
});

export default connect(mapStateToProps, {
  getEventsList,
  getCategoryList,
  createEvent,
  changeStartDate,
})(EventsPage);
