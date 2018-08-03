import React from 'react';
import { Link } from 'react-router-dom';

import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserProfile from './UserProfile';
import LogoReplacement from '../../assets/icons/LogoReplacement';

import '../../assets/components/navbar.scss';

const NavBar = props => (
  <nav className="top-navbar">
    <div className="navbar-header">
      <button
        type="button"
        className="navbar-toggle collapsed"
        data-toggle="collapse"
        data-target="#nav-bar"
        aria-expanded="false"
        aria-controls="navbar"
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
      <Link to="/home" className="navbar-brand">
        {LogoReplacement}
      </Link>
    </div>
    <div className="top-navbar__right-container">
      <SearchBar />
      <NotificationCenter />
      <UserProfile props={props} />
    </div>
  </nav>
);

export default NavBar;
