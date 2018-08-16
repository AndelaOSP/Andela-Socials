import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// components
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserProfile from './UserProfile';
import LogoReplacement from '../../assets/icons/LogoReplacement';

// assets
import '../../assets/components/navbar.scss';

const NavBar = (props) => {
  const { signOut } = props;
  return (
    <Fragment>
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
          <UserProfile signOut={signOut} />
        </div>
      </nav>
      <div className="navbar">
        <div className="navbar__bottom-section">
            <Link to="#dashboard">Dashboard</Link>
            <Link to="#groups">My Groups</Link>
        </div>
      </div>
    </Fragment>
  );
};

NavBar.propTypes = { signOut: PropTypes.func.isRequired };

export default NavBar;
