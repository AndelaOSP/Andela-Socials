import React, {Component} from 'react'
import Calendar from '../Calendar';
import InputField from './InputField';
import PropTypes from 'prop-types';


const Picker = ({
  time,
  dateSelected
}) => (
  <div className="time-picker-calendar">
    <Calendar 
      dateSelected={dateSelected}
    />
    <div className="time-picker-time">
      {time}
    </div>
  </div>
)

// TODO: remove this and replace with actual error body in props
const error = {
  hasError: false,
  message: "The date is invalid"
}


export default class DateTimePicker extends Component {
  state = {
    showPicker: false,
    fullDate: "",
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleClick, false);
  }

  onDateSelect = (value) => {
    this.props.dateSelected(this.props.type, "date", value) 
  }

  getDateTime = () => {
    const { dateValue, timeValue } = this.props;
    const dateTime = `${dateValue}      ${timeValue}`
    return dateTime
  }

  togglePickerIcon = () => {
    const { showPicker } = this.state;
    if (showPicker) {
      return (
        <button id="calendar-button" className="close-picker-icon" type="button" > &times; </button>
      );
    }
    return (
      <button id="calendar-button" type="button" value="cal" > calendar_today </button>
    );
  }

  toggleClick = (event) => {
    const { showPicker } = this.state;
    const { id } = event.target;
    if (this.node.contains(event.target)) {
      if (id === 'calendar-button') {
        return this.setState({ showPicker: !showPicker });
      }
      return this.setState({ showPicker: true });
    }
    return this.setState({ showPicker: false });
  }

  render() {
    const { 
      time,
      label,
      timeValue,
      dateValue,
    } = this.props;
    return (
      <div className="time-picker-input-field" ref={node => this.node = node}>
        <div className="time-picker-label">{label}</div>
      <div className="time-picker">
        <div className="time-picker-header">
          <span>{this.getDateTime()}</span>
          {this.togglePickerIcon()}
        </div>
        {this.state.showPicker &&
            <Picker 
              time={time}
              dateSelected={this.onDateSelect}
            />
        }        
      </div>
      </div>
    )
  }
}

DateTimePicker.propTypes = {
  time: PropTypes.object,
  label: PropTypes.string,
  timeValue: PropTypes.string,
  dateValue: PropTypes.string
}
