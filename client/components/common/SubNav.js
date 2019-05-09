import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    hideSubNav: false,
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
        </div>
      </div>
    );
  }
}

export default SubNav;
