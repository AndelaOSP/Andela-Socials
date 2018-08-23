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
          id: 0,
          title: 'New York',
          selected: false,
          key: 'location',
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location',
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location',
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location',
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location',
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location',
        },
      ],
    };
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  onApply() {
    const { eventFilterAction } = this.props;
    const {
      location,
      category,
    } = this.state;
    if (eventFilterAction !== undefined) {
      eventFilterAction(location, category);
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
              list={this.state.list}
              onSelected={this.onCategoryChange}
            />
          </div>
          <div className="">
            <button
              type="button"
              className="event-button btn btn-default"
            >
              APPLY
            </button>
          </div>
        </div>
      </div>
    );
  }
}

EventFilter.propTypes = { eventFilterAction: PropTypes.func };

EventFilter.defaultProps = { eventFilterAction: undefined };

export default EventFilter;
