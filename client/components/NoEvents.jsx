import React from 'react';
import { Link } from 'react-router-dom';


const NoEvents = () => (
  <div className="no-events">
    <div className="no-events__container">
      <h1 className="no-events__status-message">
        There are no new events for today.
      </h1>
      <h3 className="no-events__main-message">
        You can update your <Link to="/interests">interests</Link> so that you are notified when new events come up.
      </h3>
    </div>
  </div>
);

export default NoEvents;
