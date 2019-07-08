import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { getEvent, deactivateEvent, shareEvent } from '../../actions/graphql/eventGQLActions';
import { attendEvent } from '../../actions/graphql/attendGQLActions';
import { getSlackChannelsList } from '../../actions/graphql/slackChannelsGQLActions';
import NotFound from '../../components/common/NotFound';
import slackChannels from '../../fixtures/slackChannels';
import SlackIcon from '../../assets/icons/SlackIcon';

// stylesheet
import '../../assets/pages/_event_details-page.scss';

import { ModalContextCreator } from '../../components/Modals/ModalContext';
import DropDownList from '../../components/common/DropDownList';
/**
 * @description Currently contains an event details page layout
 *
 * @class EventDetailsPage
 * @extends {React.Component}
 */
class EventDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    const { events } = this.props;
    this.state = {
      events,
      updated: false,
      showSlackChannels: false,
    };
    this.handleBack = this.handleBack.bind(this);
    this.rsvpEvent = this.rsvpEvent.bind(this);
  }

  /**
   * React Lifecycle hook
   *
   * @memberof EventDetailsPage
   * @returns {null}
   */
  componentDidMount() {
    this.loadEvent();
    this.loadSlackChannels();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.events.status
      && (nextProps.events !== prevState.events && prevState.updated === false)
    ) {
      return { updated: true };
    }

    if (prevState.updated) {
      return { updated: false };
    }
    return null;
  }

  topSection = () => {
    const {
      event,
      event: {
        title,
        startDate,
        endDate,
        venue,
        timezone,
        slackChannel,
        socialEvent,
        creator: { googleId },
        description,
        featuredImage,
        attendSet: { edges },
        newAttendance,
      },
      activeUser: { id },
    } = this.props;

    const { showSlackChannels } = this.state;
    const eventData = {
      id: event.id,
      title,
      startDate,
      endDate,
      venue,
      timezone,
      socialEvent,
      description,
      featuredImage,
      slackChannel
    };
    let message;
    const creator = id === googleId;
    const currentTimezone = moment.tz.guess();
    const currentDate = moment.tz(currentTimezone);
    const startDateInCurrentTimezone = moment.tz(startDate, currentTimezone);
    const endDateInCurrentTimezone = moment.tz(endDate, currentTimezone);
    const isPastEvent = currentDate.isAfter(endDateInCurrentTimezone);
    const hasCommenced = endDateInCurrentTimezone.isAfter(startDateInCurrentTimezone)
      && startDateInCurrentTimezone.isBefore(currentDate);

    const activeUserIsAttending = edges.find(edge => edge.node.user.googleId === id);

    if (isPastEvent) {
      message = 'This is a past event';
    } else if (hasCommenced) {
      message = 'This event has already started';
    } else if (activeUserIsAttending
      || (newAttendance && newAttendance.status === 'ATTENDING'
        && newAttendance.event.id === event.id)) {
      message = "You're attending this event";
    }

    return (
      <div className="event-details__top">
        <div className="event-details__section">
          <div className="event-details__event_title">{title}</div>
          <div className="event-details__social_event">{socialEvent.name}</div>
          {creator ? (
            <div>
              {this.renderCreateEventButton(eventData)}
              {this.renderDeleteEventButton()}
            </div>
          ) : (
              <Fragment>
                <button
                  type="button"
                  onClick={this.rsvpEvent}
                  className="event-details__rsvp_button"
                  tooltip={message}
                  disabled={message ? ' disabled' : null}
                >
                  {' '}
                  Attend &#10004;
              </button>
                <button
                  type="button"
                  onClick={this.showSlackChannels}
                  className="event-details__slack_button"
                >
                  {' '}
                  Share on Slack {<SlackIcon color="white" width="7%" />}
                </button>
                {showSlackChannels && (
                  <div className="menu">
                    <DropDownList
                      lists={this.props.slackChannels}
                      onClick={this.shareOnChannel}
                    />
                  </div>
                )}
              </Fragment>
            )}
        </div>
        <div className="event-details__section">
          <div className="event-details__location_time event-details__section">
            <h5>LOCATION</h5> <br />
            <p>{venue}</p>
          </div>
          <div className="event-details__location_time event-details__section">
            <h5>DATE AND TIME</h5> <br />
            <p>{moment(startDate).format('ddd D MMM YYYY')}</p> <br />
            <p>{moment(startDate).format('LT')} - {moment.tz(endDate, moment.tz.guess()).format('LT  z')}</p>
          </div>
        </div>
      </div>
    );
  };

  shareOnChannel = (event) => {
    const eventToShare = {
      eventId: this.props.event.id,
      channelId: event.target.id,
    }

    this.props.shareEvent(eventToShare);
    this.setState(prevState => ({
      showSlackChannels: !prevState.showSlackChannels
    }));
  }

  middleSection = () => {
    const {
      event: {
        description,
        socialEvent,
        featuredImage,
        attendSet: { edges },
      },
      activeUser: { id },
    } = this.props;
    const users = edges.length > 0
      ? edges.map(object => (object.node.user.googleId === id ? 'You,' : `@${object.node.user.slackId}, `))
      : 'No one';
    return (
      <div className="event-details__middle">
        <div className="event-details__section">
          <div className="event-details__description">
            <h5>DESCRIPTION</h5>
            <article>{description}</article>
          </div>
          <div className="event-details__attending">
            <h5>ATTENDING:</h5>
            <p>{users}</p>
          </div>
          <div className="event-details__tags">
            <h5>TAGS:</h5>
            <p>#{socialEvent.name}</p>
          </div>
        </div>
        <div className="event-details__section">
          <div className="event-details__img-container">
            <img src={featuredImage} alt="event img" className="event-details__picture" />
          </div>
          <br />
          <div className="event-details__mini-gallery">
            <img src={featuredImage} alt="event img" className="event-details__gallery-picture" />
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line react/sort-comp
  handleBack() {
    const { history: { push } } = this.props;
    push('/events');
  }

  loadEvent() {
    const { match: { params: { eventId } } } = this.props;
    const { getEventAction } = this.props;
    getEventAction(eventId);
  }

  loadSlackChannels() {
    const { getSlackChannelsList } = this.props;
    getSlackChannelsList();
  }

  showSlackChannels = () => {
    this.setState(prevState => ({
      showSlackChannels: !prevState.showSlackChannels
    }));
  };

  rsvpEvent() {
    const {
      attendEventAction,
      event: { id },
    } = this.props;
    attendEventAction(id);
  }

  renderCreateEventButton = eventData => (
    <ModalContextCreator.Consumer>
      {({
        activeModal, openModal,
      }) => {
        const {
          categories, uploadImage, updateEvent,
        } = this.props;
        if (activeModal) return null;
        return (
          <button
            type="button"
            onClick={() => openModal('UPDATE_EVENT', {
              modalHeadline: 'Update event',
              formMode: 'update',
              formId: 'event-form',
              eventData,
              categories,
              createEvent: () => '',
              updateEvent,
              uploadImage,
            })
            }
            className="event-details__edit"
          >
            {' '}
            &#9998;
          </button>
        );
      }}
    </ModalContextCreator.Consumer>
  );

  renderDeleteEventButton = () => (
    <ModalContextCreator.Consumer>
      {({
        activeModal, openModal,
      }) => {
        const {
          event: {
            title, id,
          },
          deactivateEventAction,
        } = this.props;
        if (activeModal) return null;
        return (
          <button
            type="button"
            onClick={() => openModal('DELETE_EVENT', {
              modalHeadline: 'Delete event',
              formText: `Are you sure you want to delete the Event '${title}' ?`,
              eventId: id,
              formId: 'delete-event-form',
              deleteEvent: deactivateEventAction,
              back: this.handleBack,
            })
            }
            className="event-details__delete"
          >
            {' '}
            &#10005;
          </button>
        );
      }}
    </ModalContextCreator.Consumer>
  );

  render() {
    const { updated } = this.state;
    if (updated) {
      this.loadEvent();
    }
    const { event } = this.props;
    if (!Object.keys(event).length) {
      return <NotFound />;
    }
    return (
      <div className="event-details">
        {this.topSection()}
        {this.middleSection()}
      </div>
    );
  }
}

EventDetailsPage.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ eventId: PropTypes.string }) }),
  getEventAction: PropTypes.func,
  getSlackChannelsList: PropTypes.func,
  deactivateEventAction: PropTypes.func,
  attendEventAction: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  events: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.shape({})]),
  event: PropTypes.shape({
    id: PropTypes.string,
    active: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    venue: PropTypes.string,
    featuredImage: PropTypes.string,
    slackChannel: PropTypes.string,
    socialEvent: PropTypes.shape({ name: PropTypes.string }),
    attendSet: PropTypes.shape({ edges: PropTypes.arrayOf(PropTypes.shape({})) }),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  activeUser: PropTypes.shape({ id: PropTypes.string }),
  updateEvent: PropTypes.func,
  uploadImage: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape({})),
};

EventDetailsPage.defaultProps = {
  match: {},
  event: [],
  events: [],
  activeUser: { id: '' },
  history: { push: () => null },
  categories: [],
  getEventAction: () => null,
  deactivateEventAction: () => null,
  attendEventAction: () => null,
  updateEvent: () => null,
  uploadImage: () => null,
  getSlackChannelsList: () => null
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getEventAction: getEvent,
    deactivateEventAction: deactivateEvent,
    attendEventAction: attendEvent,
    getSlackChannelsList,
    shareEvent
  },
  dispatch
);

const mapStateToProps = state => ({
  event: state.event,
  events: state.events,
  slackChannels: state.slackChannels.channels
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailsPage);
