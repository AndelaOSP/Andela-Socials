import jwtDecode from 'jwt-decode';

/**
 * This function checks if token is expired
 *
 * @returns {boolean}
 */
const isTokenExpired = () => {
  const token = window.localStorage.getItem('token');
  
  if (token !== (undefined || null)) {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
      localStorage.clear();
  
      return true;
    }
  }

  return false;
};

export default isTokenExpired;
