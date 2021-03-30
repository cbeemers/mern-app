import React, {Component} from 'react';

import {getCookie} from '../cookie';
import Welcome from './welcome'
import FriendsDisplay from '../account/layout/friends'
import RequestsDisplay from '../account/layout/requests'
import Login from '../account/login'
import Weather from '../pages/weather'
import Stock from '../pages/stocks'
import Signup from '../account/signup'

// import background from '/background.php';

export default class Home extends Component{
    constructor(props) {
        super(props);

        // let user = '';

        this.state = {
            user: "",
            display: <Welcome />,
            token: getCookie('token'),
            userLast: "",
            userId: "",
        }

        this.signup = this.signup.bind(this)
    }

    componentDidMount() {
        let user;
        let {token} = this.state
        if (token != "") {
            let that = this;
            
            fetch("http://localhost:9000/users/getFromUser?type=all&token="+token, {
                method: 'GET',
                query: token
            }).then(res => {
                if (res.status === 200) {
                    
                    res.json().then(data => {
                        // console.log(data);
                        user = String(data['firstName'])[0].toUpperCase() + String(data['firstName']).slice(1);
                        let userLast = String(data['lastName'])
                        let userId = String(data['_id'])
                        that.setState({user:user, display: <Welcome user={user} />, userLast: userLast, userId: userId});
                        // that.setState({user:user, display: <Counter count={111}/>, userLast: userLast, userId: userId});
                    })
        
                }
            });
        }
        else {
            this.setState({display: <Login signup={this.signup}/>})
        }
    }

    componentWillUnmount() {
        if (getCookie('token') == "") {
            this.setState({user: ""})
        }
    }

    displayMessages = async () => {
        console.log("messages")
    }

    displayRequests = async () => {
        let {token, userLast, userId, user} = this.state;
        let that = this

        await fetch("http://localhost:9000/users/getFromUser?type=requests&token="+token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            res.json().then(data => {
                that.setState({
                    display: <RequestsDisplay token={token} requests={data['values']} userLast={userLast} userId={userId} userFirst={user}/>
                })
            })
        })

    }

    displayFriends = async () => {

        let {token, userId, user, userLast} = this.state;
        let that = this;

        if (token != "") {
            await fetch("http://localhost:9000/friendships/getAll?id="+userId, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                res.json().then(data => {
                    that.setState({
                        display: <FriendsDisplay display="friends" token={token} friends={data['data']} id={userId} firstName={user} lastName={userLast} query="" />
                    })
                })
            })
        }
    }

    signup = (event) => {
        event.preventDefault()
        this.setState({display: <Signup />})
    }

    display = () => {
        let {user, display} = this.state
        // if (user != "") {
            return (
            <div className="main" style={{minHeight: "-webkit-calc(100%)"}}>
                <aside className="welcome-aside">
                    <div style={{padding: "1em"}}>
                        <div className="home-button" onClick={this.displayRequests}><h3>Requests</h3></div>
                        <div className="home-button" onClick={this.displayMessages}><h3>Messages</h3></div>
                        <div className="home-button" onClick={this.displayFriends}><h3>Friends</h3></div>
                        {/* <h3 className="link" style={{color: "white", textDecoration: "none"}}><Link to="/profile">Profile</Link></h3> */}
                    </div>

                </aside>
                <div className="main-content">{display}</div>
                
                <aside className="aside2" >
                    <div style={aside2}>
                        <div className="home-button" onClick={() => {this.setState({display:<Weather />})}}><h3>Weather</h3></div>
                        <div className="home-button" onClick={() => {this.setState({display:<Stock />})}}><h3>Stocks</h3></div>
                        <div className="home-button"><h3>main</h3></div>
                        
                    </div>
                    
                </aside>
            </div>
            )
        // }
        // else {
        //     return display
            
        // }
    }

    render() {
        const {user} = this.state
        return this.display()
        
    }
}

let background = './img/background4.jpg';

const main = {
    // borderLeft: ".1em solid #A7C7E7",
    // borderRight: ".1em solid #A7C7E7"
}

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

const aside2 = {
    padding: "1em"
}