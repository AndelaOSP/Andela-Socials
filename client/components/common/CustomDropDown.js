import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

/**
* DropDown Component takes two children elements
* one is the DropDown trigger such as a button or link
* another is a dropdown container which holds dropdown data, it can be a ul, div, ...
*/

class CustomDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
    };
    this.selectedItem = this.selectedItem.bind(this);
  }

  handleClickOutside() {
    this.setState({ listOpen: false });
  }

  toggleList() {
    this.setState(prevState => ({ listOpen: !prevState.listOpen }));
  }

  selectedItem(event, item) {
    event.preventDefault();
    this.setState({
      headerTitle: item.title,
      listOpen: false,
    });
    this.props.onSelected(item.id);
  }

  render() {
    const { list } = this.props;
    const {
      listOpen,
      headerTitle,
    } = this.state;

    return (
      <div className="cd-wrapper">
      <div className="cd-header" onClick={() => this.toggleList()}>
        <div className="cd-title">
          <span className="cd-header-title">{headerTitle}</span>
        </div>
        <div className="cd-icon">
        {listOpen
          ? <FontAwesome name="angle-up" size="2x"/>
          : <FontAwesome name="angle-down" size="2x"/>
        }
        </div>

      </div>
       {listOpen && <ul className="cd-list">
         {list.map(item => (
           <li
            className="dd-list-item"
            onClick={(event) => this.selectedItem(event, item)}
            key={item.id}
            >
              {item.title}
            </li>
         ))}
        </ul>}
      </div>
    );
  }
}

CustomDropDown.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  onSelected: PropTypes.func.isRequired,
};

CustomDropDown.defaultProps = { title: 'Please select' };

export default CustomDropDown;
