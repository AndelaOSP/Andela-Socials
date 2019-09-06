import toastr from 'toastr';

/**
 * Handles errors coming from api calls
 *
 * @param {object} error
 * @param {function} dispatch
 * @returns {function} error display
 */
export const handleError = (error) => {
  if (error) {
    return toastr.error(error);
  }
};

/**
 * Handles information (excluding error) coming from api calls
 *
 * @param {string} information
 * @returns {function} information display
 */
export const handleInformation = (information) => {
  if (information) {
    return toastr.info(information);
  }
};

/**
 * Throws error to be handled somewhere else
 *
 * @param {object} error
 * @param {function} dispatch
 */
export const throwError = (error) => {
  throw error;
};

export const authenticationFailed = (error) => {
  if (error) {
    return toastr.error(error);
  }
};
