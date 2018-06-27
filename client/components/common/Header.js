import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { signOut } from "../../actions/userActions";

class Header extends Component {
  constructor(props){
    super(props);
    this.onSignOut = this.onSignOut.bind(this);
  }

  onSignOut(){
    this.props.signOut();
    window.location.reload();
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top nav-menu no-margin no-padding">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#nav-bar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/home" className="navbar-brand">Andela Socials</Link>
            </div>
            <div className="collapse navbar-collapse" id="nav-bar">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#" onClick={this.onSignOut}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(null, { signOut })(Header);
