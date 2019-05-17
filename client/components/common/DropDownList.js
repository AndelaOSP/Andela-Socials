import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import '../../assets/components/_dropdown.scss';


class DropDownList extends Component {

  state = {
    listOpen: true,
  }

  handleClickOutside() {
    this.setState({ listOpen: false });
  }
  render() {
    const { lists, listContainerClasses = '', onClick } = this.props;
    const { listOpen } = this.state;

    return (
      <div className="dropdown">
        {listOpen && (<ul className={`dropdown__dp-wrapper ${listContainerClasses}`}>
          {lists.map(list => {
            return (<li
              key={list.id}
              className={"dropdown__dp-wrapper__list"}
              onClick={onClick}
              id={list.name}
            >
              {list.name}
            </li>);
          })}
        </ul>)}
      </div>
    )
  }
}

DropDownList.propTypes = {
  listContainerClasses: PropTypes.string,
  listClass: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default onClickOutside(DropDownList);

