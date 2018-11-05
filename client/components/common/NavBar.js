import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// components
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserProfile from './UserProfile';
import SideNav from './SideNav';
import LogoReplacement from '../../assets/icons/LogoReplacement';

// assets
import '../../assets/components/navbar.scss';


const openNav = () => {
  document.getElementById('mySidenav').style.width = '15.6rem';
};

const NavMenu = ({
  to,
  children,
}) => (
    <div className="link__container">
      <NavLink to={to} activeClassName="link__container--active">
        <span>{children}</span>
      </NavLink>
    </div>);

NavMenu.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const NavBar = (props) => {
  const {
    onSearchInputChange, events,
    searchText, signOut,
    firstName, lastName,
    imageUrl,
  } = props;
  return (
    <Fragment>
      <nav className="top-navbar">
        <div className="navbar-header">
          <div>
            <button type="button" onClick={openNav} className="navbar-brand-mobile">
              {LogoReplacement}
            </button>
          </div>
          <Link to="/home" className="navbar-brand">
            {LogoReplacement}
          </Link>
        </div>
        <SideNav
          signOut={signOut}
        />
        <div className="top-navbar__right-container">
          <div className="top-navbar__right-container__search">
            <SearchBar
              searchText={searchText}
              events={events}
              onSearchInputChange={onSearchInputChange}
            />
          </div>
          <div className="top-navbar__right-container__item">
            <NotificationCenter />
          </div>
          <div className="top-navbar__right-container__item">
            <UserProfile
              firstName={firstName}
              lastName={lastName}
              imageUrl={imageUrl}
              signOut={signOut}
            />
          </div>
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
