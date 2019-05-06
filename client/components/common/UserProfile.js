import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DropDown from './DropDown';
import profileImage from '../../assets/img/profile_picture.jpg';

const UserProfile = ({
  firstName,
  lastName,
  imageUrl,
  signOut,
}) => (
  <DropDown className="dropdown-toggle nav-profile">
    <button type="button" className="btn nav-profile__button">
      <img
        className="nav-profile__img"
        src={!imageUrl ? profileImage : imageUrl}
        alt="User Profile"
      />
      <span className="nav-profile__username">{`${firstName} ${lastName}`}</span>
      <span className="caret nav-profile__dropdown-icon" />
    </button>
    <ul className="dropdown-menu nav-profile__list-menus">
    <li>
    <Link to="/interests">My Interests</Link>
    </li>
      <li>
        <Link to="/settings">Settings</Link>
      </li>
      <li>
        <Link to="/login" onClick={signOut}>Logout</Link>
      </li>
    </ul>
  </DropDown>
);

UserProfile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default UserProfile;
