import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// components
import Modal from './Modals/ModalContainer';
import ModalContextProvider from './Modals/ModalContext';

// stylesheet
import '../assets/style.scss';


const App = ({ currentUrl, children }) => (
  <ModalContextProvider>
    {children}
    <Modal />
  </ModalContextProvider>
);

App.propTypes = {
  currentUrl: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.access.isAuthenticated,
  currentUrl: ownProps.location.pathname,
});

export default connect(mapStateToProps)(App);
