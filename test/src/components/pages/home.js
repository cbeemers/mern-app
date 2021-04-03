import React, {Component} from 'react';

import {getCookie} from '../cookie';
import Welcome from './welcome'
import FriendsDisplay from '../account/layout/friends'
import RequestsDisplay from '../account/layout/requests'
import Login from '../account/login'
import Weather from '../pages/weather'
import Stock from '../pages/stocks'
import Signup from '../account/signup'
import { profileContent } from '../layout/style';
import FriendsController from '../controllers/friends-controller'

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
            profilePicture: "",
            preferences: null,
            friendData: null,
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
                        console.log(userId)
                        that.setState({user:user, display: <Welcome user={user} token={token} userId={userId} />, userLast: userLast, userId: userId, profilePicture: data['profilePicture']});
                        // that.setState({user:user, display: <Counter count={111}/>, userLast: userLast, userId: userId});
                        fetch("http://localhost:9000/preferences/getAll?id="+userId, {method: "GET"}).then(response => {
                            if (response.status === 200) {
                                response.json().then(prefData => {
                                    console.log(prefData)
                                    that.setState(prefData)
                                })
                                
                            } 
                        })
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
        let {token, userLast, userId, user, profilePicture} = this.state;
        let that = this

        await fetch("http://localhost:9000/users/getFromUser?type=requests&token="+token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            res.json().then(data => {
                that.setState({
                    display: <RequestsDisplay userPicture={profilePicture} token={token} requests={data['values']} userLast={userLast} userId={userId} userFirst={user}/>
                })
            })
        })

    }

    displayFriends = async () => {

        let {token, userId, user, userLast, display} = this.state;
        let that = this;
        
        if (display.type != (<FriendsController />).type) {
            if (token != "") {
                await fetch("http://localhost:9000/friendships/getAll?id="+userId, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then((res) => {
                    res.json().then(data => {
                        that.setState({
                            display: <FriendsController display="friends" token={token} friends={data['data']} id={userId} firstName={user} lastName={userLast} query="" />,
                            friendData: data,
                        })
                    })
                })
            }
        } 
        else {
            let {friendData} = this.state
            await this.setState({display: null})
            await this.setState({display: <FriendsController display="friends" token={token} friends={friendData['data']} id={userId} firstName={user} lastName={userLast} query="" />
            })
        }

    }

    displayStocks = async () => {

        let {token} = this.state;
        let type = "stocks";
        let that = this;

        if (token != "") {
            await fetch("http://localhost:9000/users/getFromUser?type="+type+"&token="+token, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                res.json().then((data) => {
                    that.setState({display: <Stock favorites={data['values']} />});
                });
            });
        } 
        else {
            this.setState({display: <Stock />})
        }
    }

    signup = (event) => {
        event.preventDefault()
        this.setState({display: <Signup />})
    }

    renderButtons = () => {
        let {token} = this.state

        if (token != "") {
            return (
                <div style={{padding: "1em"}}>
                <div className="home-button" onClick={this.displayRequests}><h3>Requests</h3></div>
                <div className="home-button" onClick={this.displayMessages}><h3>Messages</h3></div>
                <div className="home-button" onClick={this.displayFriends}><h3>Friends</h3></div>
                </div>
            )
        }
        
    }

    display = () => {
        
        let {user, display} = this.state
        

        // if (user != "") {
            return (
            <div className="main" style={{minHeight: "-webkit-calc(100%)"}}>
                <aside className="welcome-aside">
                    
                    {this.renderButtons()}                    

                </aside>
                <div className="main-content">{display}</div>
                
                <aside className="aside2" >
                    <div style={aside2}>
                        <div className="home-button" onClick={() => {this.setState({display:<Weather />})}}><h3>Weather</h3></div>
                        <div className="home-button" onClick={this.displayStocks}><h3>Stocks</h3></div>
                        {/* <div className="home-button"><h3>main</h3></div> */}
                        
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