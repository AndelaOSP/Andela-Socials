import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { hideSubNav } from '../../actions/uiActions';

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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  subNavHidden: state.uiReducers.subNavHidden,
});
export default connect(mapStateToProps, { hideSubNav })(SubNav);
