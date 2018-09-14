// React lib import
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// third-party imports
import { Route, Redirect, Switch } from 'react-router-dom';

// components
import Header from '../../components/common/Header';
import EventsPage from '../Event/EventsPage';
import EventDetailsPage from '../Event/EventDetailsPage';
import ModalContextProvider, { ModalContextCreator } from '../../components/Modals/ModalContext';
import Modal from '../../components/Modals/ModalContainer';
import LoadComponent from '../../utils/loadComponent';
import { createEvent } from '../../actions/graphql/eventGQLActions';
import { getCategoryList } from '../../actions/graphql/categoryGQLActions';

// stylesheet
import '../../assets/style.scss';

// thunk
import {
  loadActiveUser,
  displayLoginErrorMessage,
} from '../../actions/userActions';

// utils
import isLoggedIn from '../../utils/isLoggedIn';
import isTokenExpired from '../../utils/isTokenExpired';

// other routes
const NotFound = LoadComponent(import('../../components/common/NotFound'));

/**
 * Represents Dashboard component
 *
 * @class Dashboard
 * @extends {React.Component}
 */
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: {},
      categoryList: [],
    };
  }

  /**
   * React Lifecycle hook
   *
   * @memberof Dashboard
   * @returns {null}
   */
  componentDidMount() {
    const {
      loadActiveUser,
      getCategoryList,
    } = this.props;
    loadActiveUser();
    getCategoryList({
      first: 20, last: 20,
    });
  }


  /**
   * React Lifecycle hook
   *
   * @param {nextProps, prevState}
   * @memberof Dashboard
   * @returns {null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (Object.keys(nextProps.activeUser).length > 0
      && (nextProps.activeUser !== prevState.activeUser)) {
      return {
        activeUser: nextProps.activeUser || null,
        categoryList: nextProps.socialClubs.socialClubs,
      };
    }
    return null;
  }

  /**
   * Method to render user dashboard
   *
   * @memberof Dashboard
   * @returns {jsx} jsx
   */
  redirectUser = () => {
    const { location: { pathname } } = this.props;
    if (pathname === '/') {
      return (<Redirect to="/dashboard" />);
    }
  };

  renderCreateEventButton = categories => (
    <ModalContextCreator.Consumer>
      {
        ({
          activeModal,
          openModal,
        }) => {
          const { createEvent } = this.props;
          if (activeModal) return null;
          return (
            <button
              type="button"
              onClick={() => openModal('CREATE_EVENT', {
                modalHeadline: 'create event',
                formMode: 'create',
                formId: 'event-form',
                categories,
                createEvent,
              })}
              className="create-event-btn"
            >Create Event</button>
          );
        }
      }
    </ModalContextCreator.Consumer>
  );

  /**
   * Renders Dashboard component
   *
   * @returns {JSX} jsx
   * @memberof Dashboard
   */
  render() {
    const { location: { search } } = this.props;
    const { activeUser, categoryList } = this.state;

    const categories = Array.isArray(categoryList) ? categoryList.map(category => ({
      id: category.node.id,
      selected: false,
      key: 'category',
      title: category.node.name,
    })) : [];

    if (search.split('?token=')[1]) {
      localStorage.setItem('token', search.split('?token=')[1]);
    }

    if (isTokenExpired() || !isLoggedIn()) {
      return (
        <Redirect to="/login" />
      );
    }

    if (search === '?error=failed+to+create+user+token') {
      this.props.displayLoginErrorMessage();
    }
    return (
      <ModalContextProvider>
        <Header
          firstName={activeUser.firstName || ''}
          lastName={activeUser.lastName || ''}
          imageUrl={activeUser.picture || ''}
        />
        <Switch>
          {this.redirectUser()}
          <Route path="/events/:eventId" render={props => <EventDetailsPage {...props} />} />
          <Route path="/events" render={() => <EventsPage />} />
          <Route path="/dashboard" render={() => <EventsPage />} />
          <Route path="*" component={NotFound} />
        </Switch>
        {this.renderCreateEventButton(categories)}
        <Modal />
      </ModalContextProvider>
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
  loadActiveUser: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  getCategoryList: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loadActiveUser,
  displayLoginErrorMessage,
  createEvent,
  getCategoryList,
}, dispatch);

const mapStateToProps = state => ({
  activeUser: state.activeUser,
  socialClubs: state.socialClubs,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
