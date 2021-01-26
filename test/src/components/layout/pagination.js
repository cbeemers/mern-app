import React, {Component} from 'react';

export default class Pagination extends Component {

    constructor(props) {
        super(props);

        let number = props.number;
        let buttons = [];
        for (let i=1; i<=number; i++) {
            buttons.push(i)
        }

        this.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];

        this.state = {
            number: props.number,
            buttons: buttons,
        }
    }

    renderButtons = () => {
        return this.state.buttons.map((button, index) => {
            return (
            <button key={index} id={index+1} onClick={this.props.page.bind(this, index)}>
                {this.months[index]}
            </button>
            );
        })
    }

    render(){
        return (
            <div className="buttons">
            {this.renderButtons()}
            </div>
        );
    }
}