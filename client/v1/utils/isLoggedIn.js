import decodeToken from './decodeToken';

/**
 * This function checks if a user is logged in
 *
 * @returns {boolean}
 */
const isLoggedIn = () => {
  const userEmailAddress = (decodeToken().email);
  const andelaEmailRegex = /@andela.com$/;

  if (andelaEmailRegex.test(userEmailAddress)) {
    return true;
  }

  return false;
};

export default isLoggedIn;
