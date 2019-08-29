import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
   * This function closes the Side navigation component
   *
   * @return {void}
   */
const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
};

/**
   * This function renders the Side navigation component
   *
   * @param {Object} props
   *
   * @return JSX
   */
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
        <Link to="/interests" onClick={closeNav}>My Interests</Link>
      </div>
      <div>
        <Link to="/login" onClick={signOut}>Logout</Link>
      </div>
    </div>
  </div>
);

SideNav.propTypes = { signOut: PropTypes.func.isRequired };

export default SideNav;
