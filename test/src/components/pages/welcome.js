import React, {Component} from 'react';

import {getCookie} from '../cookie';
import Clock from '../clock';
import Navbar from '../layout/navbar';
// import background from '/background.php';

export default class Welcome extends Component{
    constructor(props) {
        super(props);

        let user = '';

        this.state = {
            user: user
        }
    }

    componentDidMount() {
        let user;
        let token = getCookie("token");
        if (token != "") {
            let that = this;
            
            fetch("http://localhost:9000/checkToken?token="+token, {
                method: 'GET',
                query: token
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        // console.log(data);
                        user = data['email'];
                        that.setState({user});
                    })
        
                } else {
                    console.log(document.cookie);
                }
            });
        }
    }

    componentWillUnmount() {
        if (getCookie('token') == "") {
            this.setState({user: ""})
        }
    }

    render() {
        const {user} = this.state
        return(
            <div className="background" style={welcome}>
            <Navbar />
                <div style={content}>
                    <h1>Welcome {user}</h1>
                    <Clock />
                </div>
            </div>
            // </div>
        );
    }
}

let background = './img/background4.jpg';

const welcome = {
    height: "-webkit-calc(100%)",
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