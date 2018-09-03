import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// components
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserProfile from './UserProfile';
import LogoReplacement from '../../assets/icons/LogoReplacement';

// assets
import '../../assets/components/navbar.scss';

const NavMenu = ({
  to,
  children,
}) => (
  <div className="link__container">
    <NavLink to={to} activeClassName="link__container--active">
      <span>{children}</span>
    </NavLink>
  </div>
);

NavMenu.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const NavBar = (props) => {
  const {
    signOut,
    firstName,
    lastName,
    imageUrl,
  } = props;
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
          <UserProfile
            firstName={firstName}
            lastName={lastName}
            imageUrl={imageUrl}
            signOut={signOut}
          />
        </div>
      </nav>
      <div className="navbar">
        <div className="navbar__bottom-section">
          <NavMenu to="/dashboard">Dashboard</NavMenu>
          <NavMenu to="/groups">Groups</NavMenu>
        </div>
      </div>
    </Fragment>
  );
};

NavBar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default NavBar;
