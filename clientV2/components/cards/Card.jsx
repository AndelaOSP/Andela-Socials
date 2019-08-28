import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/components/_card.scss';

/**
 * @description - This component displays a reusable card
 *
 * @param {object} props { children, style }
 *
 * @returns JSX
 */
const Card = (props) => {
  const {
    children, style,
  } = props;

  return (
    <div
      className="card"
      style={style}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.objectOf(PropTypes.string),
};

Card.defaultProps = { style: {} };

export default Card;
