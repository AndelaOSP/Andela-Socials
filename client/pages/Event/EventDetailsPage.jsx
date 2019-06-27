import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

<<<<<<< HEAD
<<<<<<< HEAD
import { getEvent, deactivateEvent, shareEvent } from '../../actions/graphql/eventGQLActions';
=======
import { getEvent, deactivateEvent } from '../../actions/graphql/eventGQLActions';
>>>>>>> bug(header): fix header style (#179)
=======
import { getEvent, deactivateEvent, shareEvent } from '../../actions/graphql/eventGQLActions';
>>>>>>> feat(event-details): share event on channel (#198)
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
<<<<<<< HEAD
<<<<<<< HEAD
      showSlackChannels: false,
=======
      showSlackChannels: false
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
      showSlackChannels: false,
>>>>>>> fix attend button state (#177)
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
<<<<<<< HEAD
<<<<<<< HEAD
      featuredImage,
      slackChannel
=======
      featuredImage
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
      featuredImage,
<<<<<<< HEAD
>>>>>>> fix attend button state (#177)
=======
      slackChannel
>>>>>>>   (ft-add-change-slack-channel-166607535): User should be able to add/change slack channel for an existing event (#235)
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
<<<<<<< HEAD
<<<<<<< HEAD
    } else if (activeUserIsAttending
      || (newAttendance && newAttendance.status === 'ATTENDING'
        && newAttendance.event.id === event.id)) {
=======
    } else if (activeUserIsAttending || (newAttendance && newAttendance.status === 'ATTENDING')) {
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
    } else if (activeUserIsAttending
      || (newAttendance && newAttendance.status === 'ATTENDING'
<<<<<<< HEAD
      && newAttendance.event.id === event.id)) {
>>>>>>> fix attend button state (#177)
=======
        && newAttendance.event.id === event.id)) {
>>>>>>> feat(event-details): share event on channel (#198)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feat(event-details): share event on channel (#198)
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
<<<<<<< HEAD
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
=======
=======
            <Fragment>
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
              <button
                type="button"
                onClick={this.rsvpEvent}
                className="event-details__rsvp_button"
                tooltip={message}
                disabled={message ? ' disabled' : null}
              >
                {' '}
                Attend &#10004;
<<<<<<< HEAD
            </button>
<<<<<<< HEAD
>>>>>>> bug(header): fix header style (#179)
            )}
=======
=======
              </button>
              <button
                type="button"
                onClick={this.showSlackChannels}
                className="event-details__slack_button"
              >
                {' '}
                Share on Slack {<SlackIcon color="white" width="7%"/>}
              </button>
              {showSlackChannels && (
                <div className="menu">
                    {this.renderSlackChannels()}
                </div>
              )}
            </Fragment>
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
          )}
>>>>>>> ft(slack-attend-event): User should be able to attend event from slack) (#181)
=======
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
>>>>>>> feat(event-details): share event on channel (#198)
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
<<<<<<< HEAD
<<<<<<< HEAD
    const users = edges.length > 0
      ? edges.map(object => (object.node.user.googleId === id ? 'You,' : `@${object.node.user.slackId}, `))
      : 'No one';
=======
    const users =
      edges.length > 0
        ? edges.map(object =>
            object.node.user.googleId === id ? 'You,' : `@${object.node.user.slackId}, `
          )
        : 'No one';
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
    const users = edges.length > 0
      ? edges.map(object => (object.node.user.googleId === id ? 'You,' : `@${object.node.user.slackId}, `))
      : 'No one';
>>>>>>> fix attend button state (#177)
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  // eslint-disable-next-line react/sort-comp
  handleBack() {
    const { history: { push } } = this.props;
    push('/events');
=======
  renderSlackChannels = () => {
    return slackChannels.channels.map(channel => <a key={channel.id}>{channel.name}</a> )
  }
=======
  renderSlackChannels = () => slackChannels.channels.map(channel => (
=======
  renderSlackChannels = () => this.props.slackChannels.map(channel => (
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
            <a
             href
             key={channel.id}>
              {channel.name}
            </a>));

=======
>>>>>>> feat(event-details): share event on channel (#198)
  // eslint-disable-next-line react/sort-comp
>>>>>>> chore(fonts): regularize fonts everywhere (#192)
  handleBack() {
    const { history: { push } } = this.props;
<<<<<<< HEAD
    push('/dashboard');
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
    push('/events');
>>>>>>> ch(dashboard routes): replace all dashboard routes with events (#224)
  }

  loadEvent() {
    const { match: { params: { eventId } } } = this.props;
    const { getEventAction } = this.props;
    getEventAction(eventId);
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
  loadSlackChannels() {
    const { getSlackChannelsList } = this.props;
    getSlackChannelsList();
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feat(event-details): share event on channel (#198)
  showSlackChannels = () => {
    this.setState(prevState => ({
      showSlackChannels: !prevState.showSlackChannels
    }));
<<<<<<< HEAD
  };

=======
  showSlackChannels = evt => {
=======
=======
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
  showSlackChannels = (evt) => {
>>>>>>> fix attend button state (#177)
    evt.preventDefault();
    this.setState(
      { showSlackChannels: true },
      () => {
        document.addEventListener('click', this.closeChannelsMenu);
      }
    );
  };

  closeChannelsMenu = () => {
    this.setState({ showSlackChannels: false }, () => {
      document.removeEventListener('click', this.closeChannelsMenu);
    });
=======
>>>>>>> feat(event-details): share event on channel (#198)
  };
<<<<<<< HEAD
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======

>>>>>>> fix attend button state (#177)
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
<<<<<<< HEAD
<<<<<<< HEAD
  activeUser: PropTypes.shape({ id: PropTypes.string }),
  updateEvent: PropTypes.func,
  uploadImage: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape({})),
=======
  activeUser: PropTypes.shape({ id: PropTypes.string })
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
  activeUser: PropTypes.shape({ id: PropTypes.string }),
<<<<<<< HEAD
>>>>>>> fix attend button state (#177)
=======
  updateEvent: PropTypes.func,
  uploadImage: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape({})),
>>>>>>> chore(fonts): regularize fonts everywhere (#192)
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  attendEventAction: () => null
=======
  attendEventAction: () => null,
<<<<<<< HEAD
>>>>>>> fix attend button state (#177)
=======
  updateEvent: () => null,
  uploadImage: () => null,
<<<<<<< HEAD
>>>>>>> chore(fonts): regularize fonts everywhere (#192)
=======
  getSlackChannelsList: () => null
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  event: state.event.event,
  events: state.events
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182)
=======
  event: state.event,
=======
  event: state.event.event,
>>>>>>> chore(fonts): regularize fonts everywhere (#192)
=======
  event: state.event,
>>>>>>> feat(event-details): share event on channel (#198)
  events: state.events,
<<<<<<< HEAD
>>>>>>> fix attend button state (#177)
=======
  slackChannels: state.slackChannels.channels
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailsPage);
