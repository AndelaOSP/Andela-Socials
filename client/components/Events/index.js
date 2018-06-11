import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// components
import ClubInfo from '../SocialClub/ClubInfo';

// actions
import {
  getEvent,
  joinEvent,
  getSubscribedEvents,
  unsubscribeEvent
} from '../../actions/eventActions';
import { joinClub, getClub } from '../../actions/socialClubActions';

// toastr service
import toastr from 'toastr';

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedClub: false,
      joinedEvent: false
    };
    this.joinThisClub = this.joinThisClub.bind(this);
    this.joinThisEvent = this.joinThisEvent.bind(this);
    this.unsubscribeThisEvent = this.unsubscribeThisEvent.bind(this);
  }
  // TODO: There will be two API calls here
  // To get the clicked event and a recommended event
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getEvent(this.props.params.id);
    this.props.getClub(this.props.params.club_id);
    this.props.getSubscribedEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.joinedClub !== (nextProps.subscribedClubs.indexOf(nextProps.club.id) !== -1)) {
      this.setState({ joinedClub: !this.state.joinedClub });
    }
    if (
      this.state.joinedEvent !==
      (nextProps.subscribedEvents.indexOf(nextProps.event.id) !== -1)
    ) {
      this.setState({ joinedEvent: !this.state.joinedEvent });
    }
  }

  joinThisClub() {
    let details = {
      club_id: this.props.club.id,
      email: this.props.user.app_user.email
    };
    this.props
      .joinClub(details)
      .then(() => {
        toastr.success(
          'You have successfully joined this Club. You will be notified of new events'
        );
        this.setState({ joinedClub: true });
      })
      .catch(error => {
        toastr.error('Aww! Something went wong');
      });
  }

  joinThisEvent() {
    let details = {
      event_id: this.props.event.id,
      club_id: this.props.club.id,
      email: this.props.user.app_user.email
    };
    this.props
      .joinEvent(details)
      .then(() => {
        toastr.success(
          'You have successfully subscribed. You will get notifications on this event'
        );
        this.setState({ joinedEvent: true });
      })
      .catch(error => {
        toastr.error('Aww! Something went wong');
      });
  }

  unsubscribeThisEvent() {
    let event = { event: this.props.event.id };
    this.props
      .unsubscribeEvent(event)
      .then(() => {
        toastr.warning('You have unsubscribed. You will no longer get notifications on this event');
        this.setState({ joinedEvent: false });
      })
      .catch(error => {
        toastr.error('Aww! Something went wong');
      });
  }

  render() {
    const {
      featured_image,
      title,
      attendees,
      creator,
      description,
      venue,
      date,
      time
    } = this.props.event;

    return (
      <div className="events-page">
        <ClubInfo
          joinClub={this.joinThisClub}
          club={this.props.club}
          joinedClub={this.state.joinedClub}
        />
        <div>
          <div className="row">
            <div className="col-lg-12">
              <div className="banner" style={{ backgroundImage: `url(${featured_image})` }}>
                <div className="info-tag">
                  <div className="header-title">
                    <h2>{title}</h2>
                  </div>
                  <div className="header-meta">Created by @{creator && creator.slack_name}</div>

                  <div className="main-cta">
                    {!this.state.joinedEvent && (
                      <button className="btn btn-lg btn-primary cta" onClick={this.joinThisEvent}>
                        I am attending
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-9 main-content">
                    <div className="content">
                      <div className="event-details bordered">
                        <p className="description">{description}</p>
                        <table className="table borderless">
                          <tbody>
                            <tr>
                              <td>Venue:</td>
                              <td>{venue}</td>
                            </tr>
                            <tr>
                              <td>Date:</td>
                              <td>{date}</td>
                            </tr>
                            <tr>
                              <td>Time:</td>
                              <td>{time}</td>
                            </tr>
                          </tbody>
                        </table>
                        <h3>Who is attending?</h3>
                        <ul className="member-list">
                          {attendees &&
                            attendees.map(attendee => (
                              <li key={attendee.user.app_user.id}>@{attendee.user.slack_name}</li>
                            ))}
                        </ul>

                        <div className="main-cta">
                          {!this.state.joinedEvent && (
                            <button
                              className="btn btn-lg btn-primary cta"
                              onClick={this.joinThisEvent}
                            >
                              Join this event
                            </button>
                          )}
                          {this.state.joinedEvent && (
                            <div onClick={this.unsubscribeThisEvent}>Unsubscribe this event</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 bordered sidebar">
                    <div className="heading">Recommended Event</div>
                    <div
                      className="preview-card"
                      style={{ backgroundImage: `url(${featured_image})` }}
                    >
                      <div>Reserve a space</div>
                    </div>

                    <div className="content">
                      <p>
                        <b>Venue: </b>
                        {venue}
                      </p>
                      <p>
                        <b>Date: </b>
                        {date}
                      </p>
                      <p>
                        {attendees &&
                          attendees.map(attendee => (
                            <span key={attendee.user.app_user.id}>
                              @{attendee.user.slack_name},
                            </span>
                          ))}
                        <span> have already indicated interest.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.access.user,
    event: state.event,
    club: state.socialClub,
    subscribedClubs: state.joinedClubs,
    subscribedEvents: state.subscribedEvents
  };
}

export default connect(
  mapStateToProps,
  {
    getClub,
    getEvent,
    joinClub,
    joinEvent,
    getSubscribedEvents,
    unsubscribeEvent
  }
)(EventPage);
