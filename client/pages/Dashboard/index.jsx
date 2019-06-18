// React lib import
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// third-party imports
import { Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

// components
import Header from '../../components/common/Header';
import External from '../../components/External';
import EventsPage from '../Event/EventsPage';
import EventDetailsPage from '../Event/EventDetailsPage';
import Invite from '../Invite';
import Interests from '../Interests';
import ModalContextProvider from '../../components/Modals/ModalContext';
import Modal from '../../components/Modals/ModalContainer';
import LoadComponent from '../../utils/loadComponent';
import { createEvent, updateEvent } from '../../actions/graphql/eventGQLActions';
import uploadImage from '../../actions/graphql/uploadGQLActions';
import { getCategoryList } from '../../actions/graphql/categoryGQLActions';

// stylesheet
import '../../assets/style.scss';

// thunk
import { loadActiveUser, displayLoginErrorMessage } from '../../actions/userActions';
import { savePermission } from '../../actions/oauthActions';

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
      oauthCounter: 0,
    };
  }

  /**
   * React Lifecycle hook
   *
   * @memberof Dashboard
   * @returns {null}
   */
  componentDidMount() {
    this.setState({ oauthCounter: 1 });
    const {
      loadActiveUser: loadActiveUserAction,
      getCategoryList: getCategoryListAction,
    } = this.props;
    if (isLoggedIn()) {
      loadActiveUserAction();
      getCategoryListAction({
        first: 20,
        last: 20,
      });
    }
  }

  /**
   * React Lifecycle hook
   *
   * @param {nextProps, prevState}
   * @memberof Dashboard
   * @returns {null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const temporaryState = {};
    if (
      Object.keys(nextProps.activeUser).length > 0
      && nextProps.activeUser !== prevState.activeUser
    ) {
      temporaryState.activeUser = nextProps.activeUser || null;
    }
    if (nextProps.oauth !== prevState.oauth) {
      temporaryState.oauth = nextProps.oauth;
    }
    if (nextProps.categoryList !== prevState.categoryList) {
      temporaryState.categoryList = nextProps.categoryList;
    }
    if (Object.keys(temporaryState).length > 0) {
      return temporaryState;
    }
    return null;
  }

  /**
   * Method to handle oauth permission
   *
   * @param url urlparams
   * @memberof Dashboard
   * @returns {Function} savePermission
   */

  handleAuthPermission = (urlParams) => {
    const { savePermission: saveAuthPermissionReq } = this.props;
    const url = `/api/v1/oauthcallback${urlParams}`;
    return saveAuthPermissionReq(url);
  }

  /**
   * Method to handle slack permission
   *
   * @param url urlparams
   * @memberof Dashboard
   * @returns {Function} savePermission
   */

  handleSlackPermission = (urlParams) => {
    const { savePermission: saveSlackPermissionReq } = this.props;
    const url = `/api/v1/slack/code${urlParams}`;
    return saveSlackPermissionReq(url);
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
      const isFirstLogin = localStorage.getItem('checkFirstLogin');
      
      if (isFirstLogin === 'No') {
        return (<Redirect to="/events" />);
      } else {
        localStorage.setItem('checkFirstLogin', 'No')
        return <Redirect to="/interests" />;
      }
    }
  };

  /**
   * Renders Dashboard component
   *
   * @returns {JSX} jsx
   * @memberof Dashboard
   */
  render() {
    const { location: { search }, uploadImage, updateEvent } = this.props;
    const {
      activeUser, categoryList, oauthCounter,
    } = this.state;

    const categories = Array.isArray(categoryList)
      ? categoryList.map(category => ({
        id: category.node.id,
        selected: false,
        key: 'category',
        title: category.node.name,
      }))
      : [];


    if (search.split('?token=')[1]) {
      localStorage.setItem('token', search.split('?token=')[1]);
    }

    if (!localStorage.getItem('token')) {
      const token = Cookies.get('jwt-token');
      if (isLoggedIn() && token) {
        localStorage.setItem('token', token);
      }
    }

    if (isTokenExpired() || !isLoggedIn()) {
      return <Redirect to={{
        pathname: '/login',
        state: { "previousLocation": window.location.href }
      }} />;
    }

    if (search === '?error=failed+to+create+user+token') {
      this.props.displayLoginErrorMessage();
    }
    return (
      <ModalContextProvider>
        <div className="dash-container">
          <Header
            firstName={activeUser.firstName || ''}
            lastName={activeUser.lastName || ''}
            imageUrl={activeUser.picture || ''}
          />
          <Switch>
            {this.redirectUser()}
            <Route
              path="/oauthcallback"
              render={props => (
                <External
                  location={props.location}
                  oauth={this.props.oauth}
                  counter={oauthCounter}
                  savePermission={this.handleAuthPermission}
                />
              )}
            />
            <Route
              path="/slacktokencallback"
              render={props => (
                <External
                  location={props.location}
                  oauth={this.props.oauth}
                  counter={oauthCounter}
                  savePermission={this.handleSlackPermission}
                />
              )}
            />
            <Route
              path="/events/:eventId"
              render={props => <EventDetailsPage {...props} activeUser={activeUser} categories={categories} updateEvent={updateEvent} uploadImage={uploadImage} />}
            />
            <Route path="/invite/:inviteHash" component={Invite} />
            <Route path="/events" render={() => <EventsPage createEvent={createEvent} categories={categories} uploadImage={uploadImage} />} />
            <Route path="/interests" render={() => <Interests />} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
        <Modal {...this.props} />
      </ModalContextProvider>
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
  loadActiveUser: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  getCategoryList: PropTypes.func.isRequired,
  savePermission: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loadActiveUser,
    displayLoginErrorMessage,
    createEvent,
    updateEvent,
    uploadImage,
    getCategoryList,
    savePermission,
  },
  dispatch
);

const mapStateToProps = state => ({
  activeUser: state.activeUser,
  socialClubs: state.socialClubs,
  imageUploaded: state.uploadImage,
  categoryList: state.socialClubs.socialClubs || [],
  oauth: state.oauth,
  oauthCounter: 1,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
