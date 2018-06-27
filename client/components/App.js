import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

// components
import Header from './common/Header';
import Footer from './common/Footer';

// stylesheet
import '../assets/style.scss';

class App extends Component {

  componentDidMount(){
    if (this.props.currentUrl === "/" && this.props.isAuthenticated) {
      browserHistory.replace("/home");
    }
  }

  componentDidUpdate(prevProps) {
    const { redirectUrl } = this.props;
    const isLoggingOut = prevProps.isAuthenticated && !this.props.isAuthenticated;
    const isLoggingIn = !prevProps.isAuthenticated && this.props.isAuthenticated;

    if (isLoggingIn) {
      redirectUrl ? browserHistory.replace(redirectUrl) : browserHistory.replace("/home");
    } else if (isLoggingOut) {
      browserHistory.replace("/");
    }
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.location.pathname !== '/' && <Header />}
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.access.isAuthenticated,
  redirectUrl: state.url,
  currentUrl: ownProps.location.pathname,
});

export default connect(mapStateToProps)(App);
