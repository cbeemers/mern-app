import React, {Component} from 'react';

// import {widgetContainer} from '../layout/style';

export default class WeatherWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            temp: props.temp,
            condition: props.condition,
            city: props.city,
            state: props.state,
            wind: props.wind,
        }
    }

    render() {
        let {temp, condition, city, state, wind} = this.state;

        if (condition.toLowerCase() == "rain") {
            // widget.backgroundImage = "../img/sunny.jpeg";
            // console.log(widget.backgroundImage);
            
        }

        return(
            <div className="background-contain stockWidg "style={widgetContainer}>
                <div style={widget}>
                    <p style={location}>{city}, {state}</p>
                    <p style={{paddingTop: "1em"}}>Current Temperature: {temp}</p>
                    <p>{condition}</p>
                    <p>wind: {wind}</p>
                </div>
            </div>
        );
    }
}
let background ="/img/sunny.jpeg";

let location = {
    borderBottom: "1px solid black",
    padding: "1em 0",
    margin: "0",
    backgroundColor: "blue",
    color: "white",
}

let widget = {
    color: "grey",
}

const widgetContainer = {
    width: "12em",
    height: "15em",
    margin: "auto",
    marginTop: "3em",
    marginBottom: "5em",
    border: "2px solid grey",
    textAlign: "center",
    backgroundImage: "url(" + background + ")",
}

