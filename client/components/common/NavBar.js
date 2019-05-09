import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// components
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import SubNav from './SubNav';
import SideNav from './SideNav';
import LogoReplacement from '../../assets/icons/LogoReplacement';

// assets
import '../../assets/components/navbar.scss';


const openNav = () => {
  document.getElementById('mySidenav').style.width = '15.6rem';
};

const NavBar = (props) => {
  const {
    onSearchInputChange, events,
    searchText, signOut,
    firstName, lastName,
    imageUrl,
  } = props;
  return (
    <div className="navbar-container">
      <nav className="top-navbar">
        <div className="navbar-header">
          <div>
            <button type="button" onClick={openNav} className="navbar-brand-mobile">
              {LogoReplacement}
            </button>
          </div>
          <Link to="/home" className="navbar-brand">
            <img src="./../../../assets/img/andela_logo_blue.png" height="45" alt="Andela Social Logo" />
            <h3 className="site-name">Andela Socials</h3>
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
            <UserProfile
              firstName={firstName}
              lastName={lastName}
              imageUrl={imageUrl}
              signOut={signOut}
            />
          </div>
        </div>
      </nav>
      <SubNav />
    </div>
  );
};

NavBar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default NavBar;
