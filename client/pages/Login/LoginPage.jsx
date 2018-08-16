// React lib import
import React from 'react';

// third-party imports
import { Redirect } from 'react-router-dom';
import dotenv from 'dotenv';

// utils
import isLoggedIn from '../../utils/isLoggedIn';


dotenv.config();

/**
 * Renders the Login component
 *
 * @returns {JSX} JSX
 * @memberof LoginPage
 */
const LoginPage = (props) => {
  const redirectUrl = `${process.env.ANDELA_API_BASE_URL}/login?redirect_url=${process.env.BASE_URL}`;
  if (isLoggedIn()) {
    return (<Redirect to="/events" />);
  }
  return (
    <div className="login_container">
      <div className="login_container__section">
        <img
          src="http://res.cloudinary.com/dd3lv0o93/image/upload/v1531322847/Andela_Logo_3_jkv99w.png"
          alt="andela-logo"
        />
        <p> Get Closer to your <span>social</span> Meetup</p>
        <p>
          Work hard play harder, exclusive VIP access to the best events,
          parties and everything
          <span> FUN!!! </span>
        </p>
        <a className="login_container__btn" href={redirectUrl}>
          Join the creed now!
        </a>
      </div>
    </div>
  );
};
export default LoginPage;
