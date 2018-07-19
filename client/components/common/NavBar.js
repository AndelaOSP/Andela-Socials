import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
    <div className="navbar">
        <div className="navbar__bottom-section">
            <Link to="#dashboard">Dashboard</Link>
            <Link to="#groups">My Groups</Link>
        </div>
    </div>
);

export default NavBar;
