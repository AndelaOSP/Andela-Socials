import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import moment from 'moment-timezone';

import { validateEventInvite } from '../../actions/graphql/eventInviteGQLActions';
import '../../assets/pages/_event_invite-page.scss';


class InvitePage extends Component {
  // Steps:
  //   1. Validate Invite ID
  //   2. Either display appropriate error or redirect to event
  componentDidMount() {
    // Validate Invite ID,
    const {
      match: { params: { inviteHash } }, validateInviteAction,
    } = this.props;
    validateInviteAction(inviteHash);
  }

  render() {
    const {
      invite: {
        isValid,
        message,
      },
    } = this.props;
    if (isValid) {
      const {
        invite: {
          event: {
            id, featuredImage, title, venue, startDate,
          },
        },
      } = this.props;
      return (
        <React.Fragment>
          <div className="event-invite__main_card">
            <p className="event-invite__title">You have been invited to attend {title}.</p>
            <img className="event-invite__event_img" src={featuredImage} alt="event img"/>
            <p className="event-invite__title">Venue:  {venue}.</p>
            <p className="event-invite__title">Starts On:  {moment.tz(startDate, moment.tz.guess()).format('llll')}.</p>
            <NavLink
              to={`/events/${id}`}
              className="event-invite__button event-invite__go_btn"
              >
              View Event Details
            </NavLink>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="event-invite__main_card">
          <p className="event-invite__error">Sorry {message}.</p>
        </div>
      </React.Fragment >
    );
  }
}

InvitePage.propTypes = {
  match: PropTypes.shape(
    {
      params: PropTypes.shape(
        { inviteHash: PropTypes.string }
      ),
    }
  ).isRequired,
  invite: PropTypes.shape({}).isRequired,
  validateInviteAction: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => bindActionCreators(
  { validateInviteAction: validateEventInvite },
  dispatch
);
const mapStateToProps = ({ invite }) => ({ invite });
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitePage);
