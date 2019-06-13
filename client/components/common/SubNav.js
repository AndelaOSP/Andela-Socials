import React, { Component } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { hideSubNav } from '../../actions/uiActions';
<<<<<<< HEAD
=======
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
>>>>>>> feature(ui): fix header and sidebar (#211)
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)

const NavMenu = ({
  to,
  children,
}) => (
    <div className="link__container">
      <NavLink to={to} activeClassName="link__container--active">
        <span>{children}</span>
      </NavLink>
    </div>);

NavMenu.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

class SubNav extends Component {
  state = {
    currentBodyScroll: 0,
<<<<<<< HEAD
<<<<<<< HEAD
=======
    hideSubNav: false,
>>>>>>> feature(ui): fix header and sidebar (#211)
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
  }
  componentDidMount = () => {
    this.scrollableBody = document.querySelector('body');
    this.scrollableBody.addEventListener('scroll', this.onBodyScroll);
  }
  componentWillUnmount = () => {
    this.scrollableBody.removeEventListener('scroll');
  }
  onBodyScroll = () => {
    const { scrollTop } = this.scrollableBody;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
    this.setState(({ currentBodyScroll }) => {
    this.props.hideSubNav(scrollTop > currentBodyScroll ? true : false);
    return {
        currentBodyScroll: scrollTop,
      };
    });
<<<<<<< HEAD
  }
  render() {
    const { subNavHidden } = this.props;
    return (
      <div className={`navbar ${subNavHidden ? 'navbar-hide' : ''}`}>
        <div className="navbar__bottom-section">
          <NavMenu to="/events">Events</NavMenu>
=======
    this.setState(({ currentBodyScroll }) => ({
      hideSubNav: scrollTop > currentBodyScroll ? true : false,
      currentBodyScroll: scrollTop,
    }));
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
  }
  render() {
    const { subNavHidden } = this.props;
    return (
      <div className={`navbar ${subNavHidden ? 'navbar-hide' : ''}`}>
        <div className="navbar__bottom-section">
<<<<<<< HEAD
          <NavMenu to="/dashboard">Dashboard</NavMenu>
>>>>>>> feature(ui): fix header and sidebar (#211)
=======
          <NavMenu to="/events">Events</NavMenu>
>>>>>>> ch(dashboard routes): replace all dashboard routes with events (#224)
        </div>
      </div>
    );
  }
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
const mapStateToProps = state => ({
  subNavHidden: state.uiReducers.subNavHidden,
});
export default connect(mapStateToProps, { hideSubNav })(SubNav);
<<<<<<< HEAD
=======
export default SubNav;
>>>>>>> feature(ui): fix header and sidebar (#211)
=======
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
