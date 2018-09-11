import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavBar from './NavBar';

import { signOut } from '../../actions/userActions';
import { searchEvents } from '../../actions/graphql/eventGQLActions';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '' };
  }

  onSignOut = (event) => {
    event.preventDefault();
    this.props.signOut();
  }

  onSearchInputChange = (event) => {
    const { searchEvents } = this.props;
    if (event.target.value.length >= 3) {
      searchEvents({ title: event.target.value });
    }
    this.setState({ searchText: event.target.value });
  }

  render() {
    const {
      firstName,
      lastName,
      imageUrl,
      events,
    } = this.props;
    const { searchText } = this.state;
    return (
      <NavBar
        signOut={this.onSignOut}
        firstName={firstName}
        lastName={lastName}
        imageUrl={imageUrl}
        events={events}
        searchText={searchText}
        onSearchInputChange={this.onSearchInputChange}
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


const mapStateToProps = state => ({ events: state.eventsSearchList });

export default withRouter(connect(mapStateToProps, {
  signOut, searchEvents,
})(Header));
