import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

/**
* DropDown Component takes two children elements
* one is the DropDown trigger such as a button or link
* another is a dropdown container which holds dropdown data, it can be a ul, div, ...
*/

class DropDown extends Component {
  state = { showDropDown: false };

  toggleDropDown = () => {
    const { showDropDown } = this.state;
    this.setState({ showDropDown: !showDropDown });
  };

  handleClickOutside = () => {
    this.setState({
      showDropDown: false
    });
  }

  render() {
    const { showDropDown } = this.state;
    const {
      children,
      className,
    } = this.props;
    const classNames = `dropdown ${className}`;

    return (
      <div className={classNames}>
        {React.cloneElement(children[0], { onClick: this.toggleDropDown })}
        {showDropDown && React.cloneElement(children[1],
          { onClick: this.toggleDropDown }
          )}
      </div>
    );
  }
}

DropDown.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired,
  ]).isRequired,
};

DropDown.defaultProps = { className: '' };

export default onClickOutside(DropDown);
