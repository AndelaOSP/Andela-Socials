import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

// components
import Header from './common/Header';
import Footer from './common/Footer';
import Modal from './Modals/ModalContainer';
import ModalContextProvider from './Modals/ModalContext';

// stylesheet
import '../assets/style.scss';

class App extends Component {
  componentDidMount() {
    const {
      currentUrl,
      isAuthenticated,
    } = this.props;

    if (currentUrl === '/' && isAuthenticated) {
      browserHistory.replace('/home');
    }
  }

  componentDidUpdate(prevProps) {
    const {
      redirectUrl,
      isAuthenticated,
    } = this.props;
    const isLoggingOut = prevProps.isAuthenticated && !isAuthenticated;
    const isLoggingIn = !prevProps.isAuthenticated && isAuthenticated;

    if (isLoggingIn) {
      if (redirectUrl) {
        browserHistory.replace(redirectUrl);
      } else {
        browserHistory.replace('/home');
      }
    } else if (isLoggingOut) {
      browserHistory.replace('/');
    }
  }

  render() {
    const {
      location,
      children,
    } = this.props;

    return (
      <ModalContextProvider>
        <div className="wrapper">
          {location.pathname !== '/' && <Header />}
          {children}
          <Modal />
          <Footer />
        </div>
      </ModalContextProvider>
    );
  }
}

App.propTypes = {
  currentUrl: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.access.isAuthenticated,
  redirectUrl: state.url,
  currentUrl: ownProps.location.pathname,
});

export default connect(mapStateToProps)(App);
