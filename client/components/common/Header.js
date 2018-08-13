import React, { Component } from 'react';
import { connect } from 'react-redux';

import NavBar from './NavBar';

import { signOut } from '../../actions/userActions';

class Header extends Component {
  onSignOut = () => {
    this.props.signOut();
    window.location.reload(); // should be handled better
  }

  render() {
    return (
      <NavBar signOut={this.signOut} />
    );
  }
}

export default connect(null, {
  signOut,
})(Header);
