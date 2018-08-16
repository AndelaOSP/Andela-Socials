import React from 'react';
import { Link } from 'react-router-dom';

import DropDown from './DropDown';
import profileImage from '../../assets/img/profile_picture.jpg';

const UserProfile = props => (
  <DropDown className="dropdown-toggle nav-profile">
    <button type="button" className="btn nav-profile__button">
      <img className="nav-profile__img" src={profileImage} alt="User Profile" />
      <span className="nav-profile__username">Bolaji Olajide</span>
      <span className="caret nav-profile__dropdown-icon" />
    </button>
    <ul className="dropdown-menu nav-profile__list-menus">
      <li>
        <Link to="/settings">Settings</Link>
      </li>
      <li>
        <Link to="/login" onClick={props.signOut}>Logout</Link>
      </li>
    </ul>
  </DropDown>
);

export default UserProfile;
