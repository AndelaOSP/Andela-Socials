import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

import { signOut } from '../../actions/userActions';

class Header extends Component {
  onSignOut = (event) => {
    event.preventDefault();
    this.props.signOut();
  }

  render() {
    const {
      firstName,
      lastName,
      imageUrl,
    } = this.props;
    return (
      <NavBar
        signOut={this.onSignOut}
        firstName={firstName}
        lastName={lastName}
        imageUrl={imageUrl}
      />
    );
  }
}

Header.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { signOut })(Header));
