import React from 'react';
import PropTypes from 'prop-types';

import eventDetails from '../../fixtures/eventDetails';
import durationConverter from '../../utils/durationConverter';

// stylesheet
import '../../assets/pages/_event_details-page.scss';

/**
 * @description Currently contains an event details page layout
 *
 * @class EventDetailsPage
 * @extends {React.Component}
 */
class EventDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: eventDetails, eventId: '',
    };
  }

  /**
* React Lifecycle hook
*
* @memberof EventDetailsPage
* @returns {null}
*/
  componentDidMount() {
    // To do: Make graphql call to fetch a single event's data.
    const { match: { params: { eventId } } } = this.props;
    this.setState({ eventId });
  }

  topSection = () => {
    const {
      event: {
        title, startDate, endDate,
        venue, timezone, socialEvent,
      },
    } = this.state;
    return (
      <div className="event-details__top">
        <div className="event-details__section">
          <div className="event-details__event_title">
            {title}
          </div>
          <div className="event-details__social_event">
            {socialEvent.name}
          </div>
          <button type="submit" className="event-details__rsvp_button"> RSVP &#10004;</button>
        </div>
        <div className="event-details__section">
          <div className="event-details__location_time event-details__section">
            <h5>LOCATION</h5> <br />
            <p>{venue}</p>
          </div>
          <div className="event-details__location_time event-details__section">
            <h5>DATE AND TIME</h5> <br />
            <p>{durationConverter(startDate, endDate, timezone)}</p>
          </div>
        </div>
      </div>
    );
  };

  middleSection = () => {
    const {
      event: {
        description, socialEvent, featuredImage,
        attendSet: { edges },
      },
    } = this.state;
    const users = edges.map(object => (`${object.node.user.slackId} ,`));
    return (
      <div className="event-details__middle">
        <div className="event-details__section">
          <div className="event-details__description">
            <h5>DESCRIPTION</h5>
            <article>{description}</article>
          </div>
          <div className="event-details__attending">
            <h5>Attending:</h5>
            <p>{users}</p>
          </div>
          <div className="event-details__tags">
            <h5>Tags:</h5>
            <p>#{socialEvent.name}</p>
          </div>

        </div>
        <div className="event-details__section">
          <img src={featuredImage} alt="event img" className="event-details__picture" />
          <div className="event-details__mini-gallery">
            <img src={featuredImage} alt="event img" className="event-details__gallery-picture" />
            <img src={featuredImage} alt="event img" className="event-details__gallery-picture" />
            <img src={featuredImage} alt="event img" className="event-details__gallery-picture" />
            <img src={featuredImage} alt="event img" className="event-details__gallery-picture" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {
          this.topSection()
        }
        {
          this.middleSection()
        }

      </React.Fragment>
    );
  }
}
EventDetailsPage.propTypes = {
  eventId: PropTypes.string,
  match: PropTypes.shape({ params: PropTypes.shape({ eventId: '' }) }),
};
EventDetailsPage.defaultProps = {
  eventId: '',
  match: {},
};
export default EventDetailsPage;
