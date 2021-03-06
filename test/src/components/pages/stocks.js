import React, {Component} from 'react';
// import "bootstrap/dist/css/bootstrap.min.css";

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Header from '../layout/Header';
import StockWidget from '../widgets/stock.widet';
import StockGraph from '../widgets/graph.widget';
import CalendarWidget from '../widgets/calendar.widget';
import Pagination from '../layout/pagination';
import {getCookie} from '../cookie';

import {account, search, msg, calendar} from '../layout/style';

export default class Stock extends Component {
    constructor(props) {
        super(props);

        let date = new Date();
        let month = (date.getMonth() + 1).toLocaleString();
        let day = date.getDate();
        let year = date.getFullYear();
        
        if (month < 10) { month = "0" + month; }
        if (day < 10) { day = "0" + day; }

        this.days = [31, year%4 == 0 && year%100 != 0? 29 : 28, 
                     31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   

        let pagination = <Pagination number={parseInt(month)} page={this.setMonth} />;

        let calendarWidgets = [];
        for (let i=1; i<parseInt(month); i++) {
            calendarWidgets.push( 
                <CalendarWidget year={year} date={i + " " + this.days[i-1] + " " + year} changeDate={this.changeDate} pagination={pagination} />
            );
        }
        calendarWidgets.push(
            <CalendarWidget year={year} date={month + " " + day + " " + year} changeDate={this.changeDate} pagination={pagination} />
        );

        let favorites = []
        // console.log(props.favorites)
        if (props.favorites !== undefined) {
            favorites = props.favorites
        }

        this.state = {
            message: "",
            query: "",
            date: year + "-" + month + "-" + day,
            year: year,
            month: month,
            day: day,
            stockWidget: null,
            calendarWidget: null,
            json: null,
            calendarWidgets: calendarWidgets,
            graphButton: null,
            graphButtons: null,
            graph: null,
            addFavorite: null,
            favorites: favorites,
            token: getCookie('token'),
            graphType: null
        }
        
        // if (this.state.token != "") {
        //     this.getFavorites();
        // }
    }

    setMonth = async (id) => {
        id++;
        if (id < 10) { id = "0" + (id); }
        
        await this.setState({
            month: id,
            calendarWidget: null,
        });

        await this.openCalendar();
    }

    handleChange = (event) => {
        this.setState({ 
            query: event.target.value,
            json: null,
        });
    }

    search = async () => {
        let {query, date, json, token} = this.state
        if (json == null) {
            const uri = 'http://localhost:9000/stock?symbol='+query;
            const response = await fetch(uri);
            json = await response.json();
        }

        if (json["Error Message"]) {
            this.setState( {
                message: "Invalid symbol",
            })
            return;
        }

        let open; let close; let high; let low; let volume;
        
        if (json['Time Series (Daily)'][date] != undefined) {
            open = json['Time Series (Daily)'][date]["1. open"];
            close = json['Time Series (Daily)'][date]["4. close"];
            high = json['Time Series (Daily)'][date]["2. high"]
            low = json['Time Series (Daily)'][date]["3. low"];
            volume = json['Time Series (Daily)'][date]["5. volume"];
        }

        let favorite = null;
        if (token != "") {
            favorite = <button onClick={this.addFavorite} style={calendar}>Add Favorite</button>
        }

        this.setState({
            query: query,
            stockWidget: <StockWidget open={open} 
            close={close} high={high}
            low={low} volume={volume} date={date} stock={query}
            />,
            calendarWidget: null,
            json: json,
            graphButton: <button onClick={this.drop} style={calendar}>Graph</button>,
            graphButtons: null,
            graph: null,
            addFavorite: favorite,
        });
    }

    graph = async(event) => {
        const {graph} = this.state
        let type = event.target.id

        if (graph != null) {
            await this.setState({
                graph: null,
                graphType: null,
            });
        }

        const {year, date, month, json, query, day} = this.state;
        console.log(type)
        await this.setState({
            graph: <StockGraph year={year} json={json} stock={query} type={type} day={day} month={month} />,
            graphType: type
        });
        // console.log(this.state.graph)
        this.drop();
    }

    addFavorite = async() => {
        let {query} = this.state;
        let cookie = getCookie('token');
        // console.log(cookie, query)

        await fetch("http://localhost:9000/users/addToUser", {
            method: "POST", 
            body: JSON.stringify({
                query: query,
                token: cookie,
                type: "stocks"
            }),
            headers: {
                'Content-Type': 'application/json',
            }

        }).then(res => {
            console.log(res.json());
        });

        // await this.getFavorites();
        await this.createDropdown();
    }

    drop = () => {
        const {graphButtons} = this.state;
        if (graphButtons != null) {
            this.setState({
                graphButtons: null,
            });
            return;
        }

        this.setState({
            graphButtons: <div className="buttons">
                <button style={{marginRight: "1em"}} onClick={this.graph} id="monthly">Monthly</button>
                <button onClick={this.graph} id="year">This year</button>
            </div>,
            // graph: null
        });
    
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let that = this;

        let {query, date} = this.state;

        if (query === "") {
            this.setState(
                {
                stockWidget: null,
                message: "No symbol entered."
            });
            return;
        }
        try {
            query.trim();
            this.setState(
                {
                    stockWidget: null,
                    message: ""
                }
            );
            
        } catch (TypeError) {
            return;
        }

        this.search();
    }

    changeDate = async (id) => {
        if (id != null) {
            const {month, year} = this.state;
            if  (id < 10) { id = "0"+id; }
            await this.setState({
                day: id,
                calendarWidget: null,
                date: year + '-' + month + '-' + id,
                stockWidget: null,
            });
            this.search();
        }
    }

    openCalendar = async() => {
        const {calendarWidget, date, month, day, year, calendarWidgets} = this.state;
        
        if (calendarWidget != null) {
            this.setState({
                calendarWidget: null,
            });
            return;
        }
        await this.setState({
            calendarWidget: calendarWidgets[month-1],
        });
    }

    createDropdown = () => {
        if (getCookie("token")) {
            return (
                <DropdownButton style={{marginTop:"1em"}} id="dropdown-item-button" title="Your Favorites">
                    {this.renderFavorites()}
                </DropdownButton>
            )
        }
    }

    renderFavorites = () => {
        return this.state.favorites.map((favorite, index) => {
            return (
                <Dropdown.Item id={favorite} onClick={this.favoriteClick.bind(this, favorite)} as="button">{favorite}</Dropdown.Item>
            )
        });
    }

    favoriteClick = async (id) => {
        await this.setState({query: id.toLowerCase(), json: null});
        await this.search();
    }

    render() {
        let {message, stockWidget, calendarWidget, graphButton, graphButtons, graph, addFavorite, favorites} = this.state;
        // console.log(graph)
        return (
            <div style={{minHeight: "-webkit-calc(100%)", backgroundColor: "#192635",}}>
            <Header title={"Stocks"} />
            <div style={account,{minHeight: "100vh", backgroundColor: "#192635"}}>
                
            
            
            <div style={msg}>
                {message}
            
            {this.createDropdown()}
            </div>
            <div style={search}>
            <form onSubmit={this.handleSubmit}>
                <input style={{width: "20em"}} id="search" type="text" placeholder="Symbol" onChange={this.handleChange} /><button type="submit">Search</button>
            </form>
            <button style={calendar} onClick={this.openCalendar} type="submit">Date</button>
            
            <div style={{display: "inline", marginBottom: "5em"}}>
            {calendarWidget}
            {addFavorite}
            {stockWidget}
            {graphButton}
            {graphButtons}
            {graph}
            </div>

            </div>
            </div>

            </div>
        );
    }
}

