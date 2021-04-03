import React from 'react';
import Navbar from './navbar';

class Header extends React.Component {
    constructor(props) {
        super(props)
        let background;
        if (props.color) {
          background = props.color
        } else {background = "#192635"}


        this.state = {
            title: props.title, 
            backgroundColor: background
        };
    }


    render() {
        const {title, backgroundColor} = this.state;
        
        return (
          <header 
          style={{    
              textAlign: "center",
              minHeight: "15em",
              color: "white",
              paddingBottom: "1em",
              borderBottom: ".1em solid #A7C7E7",
              backgroundColor,
          }}>
            <h1 style={{paddingTop: "1em"}}>{title}</h1>
          </header>
        );
    }

}

let head = {
    textAlign: "center",
    minHeight: "15em",
    color: "white",
    paddingBottom: "1em",
    borderBottom: ".1em solid #A7C7E7"
    // borderBottom: ".5em solid black"

}

export default Header;