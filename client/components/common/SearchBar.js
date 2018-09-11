import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '../../assets/icons/SearchIcon';
import SearchModal from '../Modals/SearchModal';


const SearchBar = (props) => {
  const {
    onSearchInputChange, events, searchText,
  } = props;
  return (
    <div className="input-group">
      <form className="navbar-form navbar-right search-bar">
        <div className="form-group">
          <label htmlFor="searchModal-toggle" className="search-modal__btn-open">
            <input type="checkbox" name="search-modal_input" id="searchModal-open" className="search-modal__checkbox" />
          </label>
          <input
            type="text"
            className="form-control search-bar__input"
            placeholder="Search Events ..."
          />

          {SearchIcon}
        </div>
        <SearchModal searchText={searchText} events={events} onSearchInputChange={onSearchInputChange} />
      </form>
    </div>
  );
};


export default SearchBar;
