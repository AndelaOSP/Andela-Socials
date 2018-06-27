import React from 'react';
import { Link } from 'react-router';

const ClubInfo = ({ joinClub, joinedClub, club }) => {
  return (
    <div className="click-bait">
      <div className="container">
        <div className="mini-header">
          <div className="title">
            <h4 className="club-link">
              <Link to={`/clubs/${club.id}`}>
                {club.name}
              </Link>
            </h4>
            <small>{club.description}</small>
          </div>
          { !joinedClub &&
          <button
            className="btn btn-primary btn-lg"
            onClick={joinClub}
          >
          Join
          </button>}
        </div>
      </div>
    </div>
  );
}

export default ClubInfo;
