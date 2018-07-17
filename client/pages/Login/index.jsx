// React lib import
import React from 'react';

/**
 * Renders the Login component
 *
 * @returns {JSX} JSX
 * @memberof LOgin
 */
const Login = props => (
    <div className="login_container">
      <div className= "login_container__section">
        <img
          src="http://res.cloudinary.com/dd3lv0o93/image/upload/v1531322847/Andela_Logo_3_jkv99w.png"
          alt="andela-logo"
        />
        <p> Get Closer to your <span>social</span> Meetup</p>
        <p>
          Work hard play harder, exclusive VIP access to the best events, parties and everything <span>FUN!!! </span>
        </p>
        <a
          className="login_container__btn"
          href="/login"
        >
          Join the creed now!
        </a>
      </div>
    </div>
);

export default Login;
