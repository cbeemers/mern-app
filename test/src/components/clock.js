import React, {Component} from 'react';

export default class Clock extends Component {
    constructor(props) {
        super(props);

        this.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];

        this.days = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ]

        let date = this.newDate();

        this.state= {
            date: this.days[date[0]] +', ' + this.months[date[1]] + " " + date[2],
            time: (date[3]) + ":" + date[4] + ":" + date[5]
        };
    }
    
    newDate = () => {
        let date = new Date();
        let d = date.getDay().toLocaleString();
        let m = date.getMonth().toLocaleString();
        let day = date.getDate();

        let hours = date.getHours()%12;
        let minutes = date.getMinutes().toLocaleString();
        let seconds = date.getSeconds().toLocaleString();

        if (seconds < 10) { seconds = "0" + seconds;}
        if (minutes < 10) { minutes = "0" + minutes; }
        if (hours == 0) { hours = 12; }

        return [d, m, day, hours, minutes, seconds];
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            let date = this.newDate();

            this.setState({
                date: this.days[date[0]] +', ' + this.months[date[1]] + " " + date[2],
                time: (date[3]) + ":" + date[4] + ":" + date[5]
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
        <div>
            <h2>{this.state.date}</h2>
            <h2>{this.state.time}</h2>
        </div>
        );
    }
}
