import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InputField from './Form/InputField'


const INCREMENT_VALUE = "INCREMENT_VALUE"
const DECREMENT_VALUE = "DECREMENT_VALUE"
/**
 * Incremental select component takes props which are,
 * a list of options that are to be iterated through,
 * a change handler, a class name, and a default value
 **/

export default class IncrementalSelect extends Component {
  onChange = (event, actionFilter) => {
    event.preventDefault()
    const { options, type, onChange, name } = this.props;
    const optionsLength = (options.length) - 1;
    const Filter = actionFilter || "";
    let value = event.target.value;
    let index = options.findIndex(option => option === this.props.value);

    switch (Filter) {
      case INCREMENT_VALUE:
        index = (index + 1) <= optionsLength ? (index + 1) : index;
        value = options[index]
        break;
      case DECREMENT_VALUE:
        index = index - 1 >= 0 ? index - 1: index;
        value = options[index]
        break;
      default:
        index = options.findIndex(option => option.includes(value));
        value = (index < 0) && (value != "") ? this.props.value : value 
    }
    onChange(type, name, value);
  }

  render() {
    const { name, options, onChange, style } = this.props;
    const classSum = `time-picker-wrapper cf ${style}`;
    return (
      <div className={classSum}>
        <input
          id={`increment-${name}`}
          name={name}
          type="text"
          onChange={this.onChange}
          value={this.props.value}
        />        
        <Incrementer 
          clickHandler={this.onChange}
        />
      </div>
    )
  }
}

const Incrementer = ({clickHandler}) => (
  <div id="idiv">
    <div
      className="increment-button"
      name={INCREMENT_VALUE}
      className="increment-button"
      onClick={(event) => clickHandler(event, INCREMENT_VALUE)}>
      arrow_drop_up
    </div>
    <div
      className="increment-button"
      name={DECREMENT_VALUE}
      className="increment-button"
      onClick={(event) => clickHandler(event, DECREMENT_VALUE)}>
      arrow_drop_down
    </div>
  </div>
)

IncrementalSelect.propTypes = {
  defaultIndex: PropTypes.number,
  name: PropTypes.string,
  style: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  error: PropTypes.object,
}
