import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { signOut } from '../../actions/userActions';


class Header extends Component {
  constructor(props) {
    super(props);
    this.onSignOut = this.onSignOut.bind(this);
  }

  onSignOut(event) {
    event.preventDefault();
    this.props.signOut();
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top nav-menu no-margin no-padding">
          <div className="container-fluid">
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
            </div>
            <div className="collapse navbar-collapse" id="nav-bar">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/login" onClick={this.onSignOut}>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Header.propTypes = {
  signOut: PropTypes.func.isRequired,
};

export default connect(null, {
  signOut,
})(Header);
