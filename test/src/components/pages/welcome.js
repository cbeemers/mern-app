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
            token: props.token,
            userId: props.userId,
            preferences: null,
        }
    }

    // componentDidMount() {
    //     let {token, userId} = this.state
    //     let that = this

    //     if (token != "") {  
    //         fetch("http://localhost:9000/preferences/getAll?id="+userId, {
    //             method: "GET",
    //         }).then(res => {
    //             if (res.status === 200) {
    //                 // res.json().then(data)

    //                 // that.setState({preferences: })
    //             }
    //         })
    //     }   
    // }

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
    position: "relative", 
    // marginRight: "auto", 
    // marginLeft: 'auto'
}

const content = {
    top: "45%",
    position: "relative",
    left: "50%",
    transform: "translate(-50%, -50%)"
}