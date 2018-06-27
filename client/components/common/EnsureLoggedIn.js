import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import toastr from 'toastr';

import { setRedirectUrl } from "../../actions/userActions";
class EnsureLoggedIn extends Component {

  componentDidMount() {
    const {
      setRedirectUrl,
      currentUrl,
      isAuthenticated,
    } = this.props;

    if (!isAuthenticated) {
      setRedirectUrl(currentUrl);
      browserHistory.replace("/");
      toastr.warning('Please sign in to continue');
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return this.props.children
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.access.isAuthenticated,
  currentUrl: ownProps.location.pathname,
});

export default connect(mapStateToProps, { setRedirectUrl })(EnsureLoggedIn);
