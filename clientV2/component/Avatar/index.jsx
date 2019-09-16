import React from 'react';
import PropTypes from 'prop-types';

/**
 * @description - This component displays a single Avatar
 *
 * @export Avatar
 * @param {object} { imgUrl, classes, altText }
 * @returns {JSX}
 */
export const Avatar = ({ imgUrl, classes, altText }) => {
  return <img className={`avatar ${classes}`} src={imgUrl} alt={altText} />;
}

Avatar.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  classes: PropTypes.string,
  altText: PropTypes.string
};

Avatar.defaultProps = {
  classes: '',
  altText: ''
};
