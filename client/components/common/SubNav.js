import React, { Component } from 'react';
<<<<<<< HEAD
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { hideSubNav } from '../../actions/uiActions';
=======
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
>>>>>>> feature(ui): fix header and sidebar (#211)

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
=======
    hideSubNav: false,
>>>>>>> feature(ui): fix header and sidebar (#211)
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
    this.setState(({ currentBodyScroll }) => {
    this.props.hideSubNav(scrollTop > currentBodyScroll ? true : false);
    return {
        currentBodyScroll: scrollTop,
      };
    });
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
  }
  render() {
    const { hideSubNav } = this.state;
    return (
      <div className={`navbar ${hideSubNav ? 'navbar-hide' : ''}`}>
        <div className="navbar__bottom-section">
          <NavMenu to="/dashboard">Dashboard</NavMenu>
>>>>>>> feature(ui): fix header and sidebar (#211)
        </div>
      </div>
    );
  }
}

<<<<<<< HEAD
const mapStateToProps = state => ({
  subNavHidden: state.uiReducers.subNavHidden,
});
export default connect(mapStateToProps, { hideSubNav })(SubNav);
=======
export default SubNav;
>>>>>>> feature(ui): fix header and sidebar (#211)
