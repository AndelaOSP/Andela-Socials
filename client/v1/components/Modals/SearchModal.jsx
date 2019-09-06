import React from 'react';
import PropTypes from 'prop-types';

import EventCard from '../cards/EventCard';
import mapListToComponent from '../../utils/mapListToComponent';

const SearchModal = (props) => {
  const {
    onSearchInputChange, events, searchText,
  } = props;
  const renderEvents = () => {
    if (events.length && searchText.length > 3) {
      return mapListToComponent(events, EventCard);
    }
    return searchText ? <div>No events found</div> : '';
  };
  return (
    <div className="search-modal">
      <input type="checkbox" name="search-modal_input" id="searchModal-toggle" className="search-modal__checkbox" />
      <label htmlFor="searchModal-toggle" className="search-modal__button">
        <input type="checkbox" name="search-modal_input" id="searchModal-toggle" className="search-modal__checkbox" />
        <span className="search-modal__button-icon">&nbsp;</span>
      </label>
      <div className="search-modal__container">
        <div className="search-modal__form-group">
          <input onChange={onSearchInputChange} type="text" placeholder="Search..." className="search-modal__input-text" />
        </div>
        <div className="search-modal__event-gallary">
          {renderEvents()}
        </div>
      </div>
    </div>);
};

SearchModal.propTypes = {
  onSearchInputChange: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.any).isRequired,
  searchText: PropTypes.string.isRequired,
};
export default SearchModal;
