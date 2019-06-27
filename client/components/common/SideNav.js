import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
};

const SideNav = ({ signOut }) => (
  <div className="mobile__nav">
    <div id="mySidenav" className="sidenav">
      <button
        type="button"
        tabIndex="0"
        className="closebtn"
        onClick={closeNav}
      >&times;</button>
      <div>
        <Link to="/notifications" onClick={closeNav}>Notifications</Link>
      </div>
      <div>
        <Link to="/settings" onClick={closeNav}>Settings</Link>
      </div>
      <div>
        <Link to="/login" onClick={signOut}>Logout</Link>
      </div>
    </div>
  </div>
);

SideNav.propTypes = { signOut: PropTypes.func.isRequired };

export default SideNav;
