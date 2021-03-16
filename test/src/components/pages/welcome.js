import React, {Component} from 'react';

import {getCookie} from '../cookie';
import Clock from '../clock';
import Navbar from '../layout/navbar';
// import background from '/background.php';

export default class Welcome extends Component{
    constructor(props) {
        super(props);

        this.state = {
            user: props.user,
        }
    }

    render() {
        const user = this.props.user

        return(
            <div className="main-content background" style={welcome}>
                <div style={content}>
                    <h1>Welcome {user}</h1>
                    <Clock />
                </div>
            </div>
        )
    }
}

let background = './img/background4.jpg';

const welcome = {
    height: "100vh",
    backgroundColor: "blue",
    backgroundImage: "url("+background+")",
    color: "white",
    margin: "0",
    textAlign: "center",
    position: "relative"
}

const content = {
    top: "45%",
    position: "relative",
    left: "50%",
    transform: "translate(-50%, -50%)"
}