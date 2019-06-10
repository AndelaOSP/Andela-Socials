import React, { Component } from 'react';
import PropTypes from 'prop-types';

const InterestCard = (props) => {
  const {
    name,
<<<<<<< HEAD
<<<<<<< HEAD
    category,
    active,
    handleClick
  } = props;
  return (
    <div onClick={() => {
      handleClick(category)}} className={`interests-card ${active ? 'active' : ''}`}>
      <p>{name}</p>
      {active && <span className="interests-card__icon-close"  onClick={
        (e) => {
          e.stopPropagation();
          handleClick(category, true)
        }
      }> 
=======
    index,
=======
    category,
>>>>>>> feat(interests): create interests (#200)
    active,
    handleClick
  } = props;
  return (
    <div onClick={() => {
      handleClick(category)}} className={`interests-card ${active ? 'active' : ''}`}>
      <p>{name}</p>
      {active && <span className="interests-card__icon-close"  onClick={
        (e) => {
          e.stopPropagation();
          handleClick(category, true)
        }
<<<<<<< HEAD
      }>
>>>>>>> feat(interests): create interests page (#186)
=======
      }> 
>>>>>>> feat(interests): create interests (#200)
        <div className="interest-icon">close</div>
      </span>}
      {!active && <span className="interests-card__icon-check interest-icon">check</span>}
    </div>
  );
};

InterestCard.propTypes = {
  name: PropTypes.string.isRequired,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  index: PropTypes.number.isRequired,
>>>>>>> feat(interests): create interests page (#186)
=======
>>>>>>> feat(interests): create interests (#200)
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default InterestCard;
