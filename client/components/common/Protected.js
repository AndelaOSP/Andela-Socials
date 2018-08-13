import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import toastr from 'toastr';


class EnsureLoggedIn extends Component {
  componentDidMount() {
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      toastr.warning('Please sign in to continue');
    }
  }

  render() {
    const { isAuthenticated, children } = this.props;

    if (!isAuthenticated) {
      return children;
    }
    return <Redirect to="login" />;
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.access.isAuthenticated,
});

export default connect(mapStateToProps, null)(EnsureLoggedIn);
