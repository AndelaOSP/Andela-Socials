import React from 'react';
import dateFns from 'date-fns';

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
  };

  onDateClick = (day) => {
    this.props.dateSelected({ startDate: dateFns.format(day, 'YYYY-MM-DD') });
  };

  nextMonth = () => {
    this.setState({ currentMonth: dateFns.addMonths(this.state.currentMonth, 1) });
  };

  prevMonth = () => {
    this.setState({ currentMonth: dateFns.subMonths(this.state.currentMonth, 1) });
  };

  pushDays(day, selectedDate, monthStart, cloneDay, formattedDate) {
    return (
      <div
        className={`col cell ${
          !dateFns.isSameMonth(day, monthStart)
            ? "disabled"
            : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
        }`}
        key={day}
        onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
      >
        <span className="number">{formattedDate}</span>
      </div>
    );
  }

  renderCells() {
    const { currentMonth } = this.state; 
    const { selectedDate } = this.props; 
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    const dateFormat = 'D';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(this.pushDays(day, selectedDate, monthStart, cloneDay, formattedDate));
        day = dateFns.addDays(day, 1);
      }
      rows.push(<div className="calenders__row" key={day}>{days}</div>);
      days = [];
    }
    return <div className="full">{rows}</div>;
  }

  renderDays() {
    const dateFormat = 'dddd';
    const days = [];
    const { currentMonth } = this.state;
    const startDate = dateFns.startOfWeek(currentMonth);

    for (let i = 0; i < 7; i += 1) {
      days.push(
        <div className="calenders__col calenders__col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days calenders__row">{days}</div>;
  }

  renderHeader() {
    const dateFormat = 'MMMM YYYY';

    return (
      <div className="header calenders__row flex-middle">
        <div className="calenders__col calenders__col-start calenders__header-arrow">
          <div className="calenders__icon icon calenders__circle" onClick={this.prevMonth}>
          arrow_back
          </div>
        </div>
        <div className="calenders__col calenders__col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="calenders__col calenders__col-end calenders__header-arrow" onClick={this.nextMonth}>
          <div className="calenders__icon icon  calenders__circle">arrow_forward</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
