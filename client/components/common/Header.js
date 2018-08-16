import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

import { signOut } from '../../actions/userActions';

class Header extends Component {
  onSignOut = (event) => {
    event.preventDefault();
    this.props.signOut();
  }

  render() {
    return (
      <NavBar signOut={this.onSignOut} />
    );
  }
}

Header.propTypes = { signOut: PropTypes.func.isRequired };

export default connect(null, { signOut })(Header);
