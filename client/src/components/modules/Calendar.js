import React, { Component } from "react";
import "./Calendar.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/*
* Prop filters
*/
class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dayjs:require("dayjs"),
      today:undefined,
      initial_year:undefined,
      initial_month:undefined,
      month_offset:0
    };
  }
  
  componentDidMount() {
    var utc = require('dayjs/plugin/utc') // dependent on utc plugin
    var timezone = require('dayjs/plugin/timezone')
    const weekday = require("dayjs/plugin/weekday");
    const weekOfYear = require("dayjs/plugin/weekOfYear");
    this.state.dayjs.extend(utc)
    this.state.dayjs.extend(timezone)
    this.state.dayjs.extend(weekday);
    this.state.dayjs.extend(weekOfYear);
    this.state.dayjs.tz.setDefault("America/New_York");
    this.setState({today : this.state.dayjs().format("YYYY-MM-DD"),
                   initial_year : this.state.dayjs().format("YYYY"),
                   initial_month : this.state.dayjs().format("M")});
  }

  getNumberOfDaysInMonth = (year, month) => {
    return this.state.dayjs(`${year}-${month}-01`).daysInMonth()
  }

  getWeekday = (date) => {
    return this.state.dayjs(date).weekday()
  }

  createDaysForCurrentMonth = (year, month) => {
    return [...Array(this.getNumberOfDaysInMonth(year, month))].map((day, index) => {
      return {
        date: this.state.dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
        dayOfMonth: index + 1,
        isCurrentMonth: true
      };
    });
  }

  createDaysForPreviousMonth = (year, month, currentMonthDays) => {
    const firstDayOfTheMonthWeekday = this.getWeekday(currentMonthDays[0].date);
    const previousMonth = this.state.dayjs(`${year}-${month}-01`).subtract(1, "month");
    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
      ? firstDayOfTheMonthWeekday - 1
      : 6;
    const previousMonthLastMondayDayOfMonth = this.state.dayjs(currentMonthDays[0].date)
      .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
      .date();
    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
      return {
        date: this.state.dayjs(
          `${previousMonth.year()}-${previousMonth.month() + 1}-${
            previousMonthLastMondayDayOfMonth + index
          }`
        ).format("YYYY-MM-DD"),
        dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        isCurrentMonth: false
      };
    });
  }

  createDaysForNextMonth = (year, month, currentMonthDays) => {
    const lastDayOfTheMonthWeekday = this.getWeekday(
      `${year}-${month}-${currentMonthDays.length}`
    );
  
    const nextMonth = this.state.dayjs(`${year}-${month}-01`).add(1, "month");
  
    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
      ? 7 - lastDayOfTheMonthWeekday
      : lastDayOfTheMonthWeekday;
  
    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: this.state.dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
        ).format("YYYY-MM-DD"),
        dayOfMonth: index + 1,
        isCurrentMonth: false
      };
    });
    
  }

  getDayElement = (day) => {
    var classList = "Calendar-day"
    if (!day.isCurrentMonth) {
      classList += " Calendar-notCurrent"
    }
    else if (day.date === this.state.today) {
      //dayElementClassList.add("");
    }
    let color;
    this.props.filters.map((filter) => {
      if (filter.title == this.props.active_selection) {
        if (WEEKDAYS[this.getWeekday(day.date)-1 % 6] == filter.dayOfWeek) {
          color = filter.color;
        }
      }
      
    });

    return (<li className={classList} style={{backgroundColor:color}} key={`day_${day.date}`}><span >{day.dayOfMonth}</span></li>);
  }

  subtractMonth = () => {
    this.setState({month_offset:this.state.month_offset-1});
  }

  addMonth = () => {
    this.setState({month_offset:this.state.month_offset+1});
  }

  render() {
    let selectedMonth;
    let currentMonth;
    let currentMonthDays;
    let previousMonthDays;
    let nextMonthDays;
    let days;
    if (this.state.today) {
      let offset_date = this.state.dayjs(`${this.state.initial_year}-${this.state.initial_month}-01`).add(this.state.month_offset, "month")
      let offset_year = offset_date.format("YYYY")
      let offset_month = offset_date.format("M")

      selectedMonth  = this.state.dayjs(new Date(offset_year, offset_month - 1, 1));
      currentMonth = selectedMonth.format("MMMM YYYY");

      currentMonthDays = this.createDaysForCurrentMonth(offset_year, offset_month);

      previousMonthDays = this.createDaysForPreviousMonth(offset_year, offset_month, currentMonthDays);
      nextMonthDays = this.createDaysForNextMonth(offset_year, offset_month, currentMonthDays);

      days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
      
    }
    
    let dayElements;
    if (days) {
      dayElements = days.map((day) => (
        this.getDayElement(day)
      )) 
    }
    

    return (
      <>
        <div className="Calendar-main">
        <section className="Calendar-monthHeader">
          <div className="Calendar-selectedMonth">{currentMonth}</div>
          <div className="Calendar-monthHeaderSelectors">
            <span className="Calendar-selector noselect" onClick={this.subtractMonth}>{"<"}</span>
            <span className="Calendar-selector noselect" onClick={this.addMonth}>{">"}</span>

          </div>
        </section>
          <ol className="Calendar-daysOfWeek">
            {WEEKDAYS.map((day) => (
              <li key={`day_${day}`}>{day}</li>
              )) 
            }
          </ol>
          <ol className="Calendar-daysGrid">
            {dayElements}
          </ol>
        </div>
      </>
    );
  }
}

export default Calendar;
