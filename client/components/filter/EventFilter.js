import React from 'react';
import PropTypes from 'prop-types';

import CustomDropDown from '../common/CustomDropDown';

class EventFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      category: '',
      locationList: [ // todo: remove, just for test
        {
          id: null,
          title: 'All',
          selected: false,
          key: 'location',
        },
        {
          id: 'Lagos',
          title: 'Lagos',
          selected: false,
          key: 'location',
        },
        {
          id: 'Kenya',
          title: 'Kenya',
          selected: false,
          key: 'location',
        },
      ],
    };
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  /**
   * method to apply the filter
   *
   * @return {void}
   */
  onApply() {
    const { filterSelected } = this.props;
    const {
      location,
      category,
    } = this.state;
    if (filterSelected !== undefined) {
      filterSelected({
        filterLocation: location, filterCategory: category,
      });
    }
  }

  /**
   * method to handle the location change
   *
   * @param {String} location
   *
   * @return {void}
   */
  onLocationChange(location) {
    this.setState({ location });
  }

  /**
   * method to handle the category change
   *
   * @param {String} location
   *
   * @return {void}
   */
  onCategoryChange(category) {
    this.setState({ category });
  }

  render() {
    const updatedCategoryList = [
      {
        id: null,
        title: 'All',
        selected: false,
        key: 'category',
      },
      ...this.props.categoryList
    ];
    return (
      <div className="filter__container" >
        <div className="filter__title">Filter Events</div>
        <div className="filter__box">
          <div>
            Location
            <CustomDropDown
              title="Select location"
              list={this.state.locationList}
              onSelected={this.onLocationChange}
            />
          </div>
          <div>
            Category
            <CustomDropDown
              title="Select category"
              list={updatedCategoryList}
              onSelected={this.onCategoryChange}
            />
          </div>
          <div className="">
            <button
              type="button"
              className="event-button event__load-more-button"
              onClick={this.onApply}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>
    );
  }
}

EventFilter.propTypes = {
  filterSelected: PropTypes.func,
  categoryList: PropTypes.arrayOf(PropTypes.object),
};

EventFilter.defaultProps = {
  filterSelected: undefined,
  categoryList: [],
};

export default EventFilter;
