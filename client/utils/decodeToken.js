import jwtDecode from 'jwt-decode';

/**
 * This function decodes user token
 *
 * @returns {string || object}
 */
const decodeToken = () => {
  const token = window.localStorage.getItem('token');
  if (token !== (undefined || null)) {
    const decodedToken = jwtDecode(token);
    const userInfo = decodedToken.UserInfo;
    return userInfo;
  }

  return 'unauthorised';
};

export default decodeToken;
