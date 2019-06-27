import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Spinner from '../utils/Spinner';


const External = (props) => {
  const {
    location, savePermission, counter, oauth,
  } = props;
  if (counter === 0 && location) {
    savePermission(location.search);
  }
  if (oauth !== '') {
    return (<Redirect to="/dashboard" />);
  }
  return (
    <Spinner />
  );
};


External.propTypes = {
  location: PropTypes.shape({}).isRequired,
  savePermission: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
  oauth: PropTypes.string.isRequired,
};

export default External;
