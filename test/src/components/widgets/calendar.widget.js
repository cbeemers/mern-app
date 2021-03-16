import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

import Pagination from '../layout/pagination';

import {stockWidget} from '../layout/style';

export default class Calendar extends Component {
    constructor(props) {
        super(props);

        this.today = new Date(props.date);  
        
        this.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];

        this.days = [
            "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
        ]

        let month = this.months[this.today.getMonth()];

        // Todays date
        let date = this.today.getDate();
        // The index of current day in the days array
        let day = this.today.getDay();
        // Object to hold all the weeks in the month to date
        let weeks = [];
        let offset = (date-1) % 7;

        // Find the day of the week for the first of the month
        let startIndex;
        if (offset == 0) { startIndex = day; }
        else {
            offset = day-offset;
            if (offset < 0) { startIndex = 7+offset; }
            else { startIndex = offset; }
        }

        // Initialize the first week of the month
        let week = {};
        for (let i=0; i<startIndex; i++) {
            week[this.days[i]] = null;
        }
        let index = startIndex;

        // Create an object that has each week of the current month
        for (let i=1; i<=date; i++) {
            if (index >= 7) {
                weeks.push(week)
                index = 0 
                week = {}
            }
            week[this.days[index]] = i
            index++
        }
        // The week array is not empty and there were leftover days
        if (week != {}) {
            weeks.push(week);
        }
        
        this.state = {
            date: props.date,
            buttons: [],
            weeks: weeks,
            month: month,
            pagination: props.pagination,
            year: props.year,
        };
    }
    
    renderTableData() {
        return this.state.weeks.map((week, index) => {
           const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = week //destructuring
           return (
              <tr key={index}>
                <td><button onClick={this.props.changeDate.bind(this, sunday)} id={sunday}>{sunday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, monday)} id={monday}>{monday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, tuesday)} id={tuesday}>{tuesday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, wednesday)} id={wednesday}>{wednesday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, thursday)} id={thursday}>{thursday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, friday)} id={friday}>{friday}</button></td>
                 <td><button onClick={this.props.changeDate.bind(this, saturday)} id={saturday} >{saturday}</button></td>
              </tr>
           )
        })
     }

    render () {
        let {month, date, pagination, year} = this.state;
        return (
            <div >
            <h1 style={{color:"#4d65a4"}}>{month}, {year}</h1>
            <div className="table">
            <table className="popup">
              <tr>
                  <td>Sunday</td>
                  <td>Monday</td>
                  <td>Tuesday</td>
                  <td>Wednesday</td>
                  <td>Thursday</td>
                  <td>Friday</td>
                  <td>Saturday</td>
              </tr>
              {this.renderTableData()}
            </table>      
            {pagination}
            </div>
            </div>
        );
    }
}