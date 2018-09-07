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

  toggleClick = () => {
    this.setState({
      showPicker: !this.state.showPicker 
    })
  }

  onDateSelect = (value) => {
    this.props.dateSelected(this.props.type, "date", value) 
  }


  getDateTime = () => {
    const { dateValue, timeValue } = this.props;
    const dateTime = `${dateValue}      ${timeValue}`
    return dateTime
  }

  render() {
    const { 
      time,
      label,
      timeValue,
      dateValue,
    } = this.props;
    return (
      <div className="time-picker-input-field">
        <div className="time-picker-label">{label}</div>
      <div className="time-picker">
        <div className="time-picker-header">
          <span>{this.getDateTime()}</span>
          <button id="calendar-button" type="reset" value="cal" onClick={this.toggleClick} > calendar_today </button>
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
