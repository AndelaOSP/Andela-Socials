import React from 'react';

import SearchIcon from '../../assets/icons/SearchIcon';

const SearchBar = () => (
  <div className="input-group">
    <form className="navbar-form navbar-right search-bar">
      <div className="form-group">
        <input
          type="text"
          className="form-control search-bar__input"
          placeholder="Search Events ..."
        />
        {SearchIcon}
      </div>
    </form>
  </div>
);

export default SearchBar;
