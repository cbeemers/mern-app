import React, {Component} from 'react';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stockDisplay: false,
            cityDisplay: false,
            displayS: null,
            displayC: null,
            stocks: props.stocks,
            cities: props.cities,
        }
    }

    createDisplay = (type) => {
        let display = this.state[type].map((object, index) => {
            return (
            <div style={displayed}><h3 >{object}</h3></div>
            )
        });
        return display
    }

    display = (event) => {
        let display = []
        let id = event.target.getAttribute('id')

        if (id == "stock") {
            if (!this.state.stockDisplay) {
                display = this.createDisplay("stocks")
            }
            this.setState({stockDisplay: !this.state.stockDisplay, displayS: display})
        }
        else if (id == "city") {
            if (!this.state.cityDisplay) {
                display = this.createDisplay("cities")
            }
            this.setState({cityDisplay: !this.state.cityDisplay, displayC: display})
        }
    }

    render() {
        let {displayS, displayC} = this.state;

        return (
            <div>
                <div id="stock" onClick={this.display} style={content}>
                    <h1 style={{padding: ".2em 0", float:"left"}}>Stocks</h1>
                    <button style={drop} id="stock" onClick={this.display}></button>
                </div>
                {displayS}

                <div id="city" onClick={this.display} style={content}>
                    <h1 style={{padding: ".2em 0", float:"left"}}>Cities</h1>
                    <button style={drop} id="city" onClick={this.display}></button>
                </div>
                {displayC}

                <div style={content}><h1>Change Password</h1></div>
            </div>
        );
    }
}

const content = {
    display: "flex",
    borderBottom: ".25em black", 
    borderBottomStyle: "solid", 
    justifyContent: "space-between",
    padding: "1em", 
}

const displayed = {
    padding: ".5em", 
    borderBottom: ".1em black", 
    borderBottomStyle:"solid", 
    color: "black"
}

const drop = {
    width: "4em",
    float:"right", 
    height: "2em", 
    marginTop:"auto", 
    borderRadius: "1em",
    marginBottom: "auto", 
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}
