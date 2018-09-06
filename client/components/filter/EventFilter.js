import React from 'react';
import PropTypes from 'prop-types';

import CustomDropDown from '../common/CustomDropDown';

class EventFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      category: '',
      list: [ // todo: remove, just for test
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

  onApply() {
    const { filterSelected } = this.props;
    const {
      location,
      category,
    } = this.state;
    if (filterSelected !== undefined) {
      filterSelected(null, location, category);
    }
  }

  onLocationChange(location) {
    this.setState({ location });
  }

  onCategoryChange(category) {
    this.setState({ category });
  }

  render() {
    return (
      <div className="filter__container" >
        <div className="filter__title">Filter Events </div>
        <div className="filter__box">
          <div>
            Location
            <CustomDropDown
              title="Select location"
              list={this.state.list}
              onSelected={this.onLocationChange}
            />
          </div>
          <div>
            Category
            <CustomDropDown
              title="Select category"
              list={this.props.categoryList}
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
