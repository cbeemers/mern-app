import React, {Component} from 'react';

import {stockWidget} from '../layout/style';

export default class StockWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            high: props.high,
            low: props.low,
            open: props.open,
            close: props.close,
            volume: props.volume, 
            date: props.date,
            stock: props.stock,
        }
    }

    render() {
        const {high, low, open, close, volume, date, stock} = this.state;
        return (
            <div style={stockWidget}>
                <h1 style={{color: "white"}}>{stock.toUpperCase()}</h1>
                <h1 style={{color: "white"}}>{date}</h1>
            <div>
            <table className="stockWidg">
                <thead><th>Open</th><th>Close</th><th>High</th><th>Low</th><th>Volume</th></thead>
                <tbody><td><button>{open}</button></td><td><button>{close}</button></td>
                    <td><button>{high}</button></td><td><button>{low}</button></td><td><button>{volume}</button></td>
                </tbody>
            </table>
            </div>
            </div>
        );
    }
}

const tab = {
    color: "white",
    border: "1px solid grey"
}