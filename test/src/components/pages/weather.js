import React, {Component} from 'react';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Header from '../layout/Header';
import WeatherWidget from '../widgets/weather.widget';
import {getCookie} from '../cookie';
import weatherSearch from '../functions/search'

import {search, account, msg, calendar} from '../layout/style';

export default class Weather extends Component {

    constructor(props) {
        super(props);

        this.state = {
            query: "",
            widget: null,
            weatherWidget: null,
            message: "",
            addFavorite: null,
            favorites: [],
        }
        this.count = 0;
    }

    componentDidMount() {
        this.getFavorites();
    }

    getFavorites = async() => {
        let token = getCookie('token');
        let type = "locations";
        let that = this;

        await fetch("http://localhost:9000/users/getFromUser?type="+type+"&token="+token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            // console.log(res.json());
            res.json().then(data => {
                // that.setState({favorites: data['values']});
                that.setState({favorites: data['values']});
                // console.log(data['values']);
            });
        });
    }

    addFavorite = async () => {
        let {query} = this.state;
        let cookie = getCookie('token');

        await fetch("http://localhost:9000/users/addToUser", {
            method: "POST", 
            body: JSON.stringify({
                query: query,
                token: cookie,
                type: "locations"
            }),
            headers: {
                'Content-Type': 'application/json',
            }

        }).then(res => {
            console.log(res.json());
        });

        await this.getFavorites();
        await this.createDropdown();
    }

    handleChange = (event) => {
        this.setState({query: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let that = this;

        const {query} = this.state;

        if (query == "") {
            this.setState(
                {query: event.target.value,
                message: "No city entered."
            });
            return;
        }

        try {
            let data = query.split(",", 2);
            let city = data[0]; let state = data[1].replace(" ", "");

            this.setState(
                {query: event.target.value,
                weatherWidget: null,
                message: "",
            });

            this.search(city, state);
            // console.log(this.getFavorites());

        } catch(TypeError) {
            this.setState({
                message: "Format must be 'city, state'."
            });
        }
        // let that = this;
    }

    search = async (city, state) => {
        const {query} = this.state;

        // const uri = 'http://localhost:9000/weather?location='+city+','+state;
        // const response = await fetch(uri);
        // const json = await response.json();
        
        let json = await weatherSearch(city, state)
    
        let favorite = null;
        if (getCookie("token") != "") {
            favorite = <button style={calendar} onClick={this.addFavorite}>Add Favorite</button>
        }

        this.setState(
            {
            query: query,
            widget: {
                temp: json.current.feelslike_f,
                city: json.location.name,
                state: json.location.region,
                condition: json.current.condition.text,
                wind: json.current.wind_mph,
            }, 
            addFavorite: favorite,
            weatherWidget: <WeatherWidget temp={json.current.feelslike_f} condition={json.current.condition.text} city={json.location.name} state={json.location.region} wind={json.current.wind_mph} />
        });
    }

    createDropdown = () => {
        if (getCookie("token")) {
            return (
                <DropdownButton style={{color: "#170a49", marginTop:"1em"}} id="dropdown-item-button" title="Your Favorites">
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
        let data = id.split(",", 2);
        let city = data[0]; let state = data[1].replace(" ", "");

        await this.setState({
            query: id, 
            json: null,                
            weatherWidget: null,
            message: "",
        });
        await this.search(city, state);
    }

    render() {
        let {weatherWidget, message, addFavorite} = this.state;

        return (
            <div style={account}>
            <Header title={"Weather"} />
            <div style={msg}>
                {message}
                {this.createDropdown()}
            </div>
            <div style={search}>
            <form onSubmit={this.handleSubmit}>
                <input style={{width: "20em"}} id="search" type="text" placeholder="City, state" onChange={this.handleChange} /><input className="submit" style={{backgroundImage: "url('./img/search.png')"}} type="submit" />
            </form>
            {addFavorite}
            {weatherWidget}
            </div>
            </div>
        );
    }
}

const submit = {
    backgroundImage: '/img/search.png',
}

const widget = {
    height: "100%",
}
