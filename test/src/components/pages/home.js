import React, {Component} from 'react';

import { getCookie, checkToken } from '../cookie';
import Welcome from './welcome'
// import FriendsDisplay from '../account/layout/friends'
import RequestsDisplay from '../account/layout/requests'
import Login from '../account/login'
import Weather from '../pages/weather'
import Stock from '../pages/stocks'
import Signup from '../account/signup'
import Feed from '../account/feed';
// import { profileContent } from '../layout/style'; 
import MessageDisplay from '../account/layout/messages'
import FriendsController from '../controllers/friends-controller'

// import background from '/background.php';

export default class Home extends Component{
    constructor(props) {
        super(props);

        // let user = '';

        this.state = {
            display: null,
            token: getCookie('token'),
            firstName: "",
            lastName: "",
            userId: "",
            profilePicture: "",
            preferences: null,
            friendData: null,
            stocks: [],
            locations: [],
        }

        this.signup = this.signup.bind(this)
    }

    componentDidMount() {
        let user;
        let {token} = this.state
        if (token != "") {
            let that = this;
            
            checkToken(token).then(async userId => {

                await fetch("http://localhost:9000/profiles/getProfile?userId="+userId, {
                    method: "GET",
                }).then(async res => {
                    await res.json().then(async profile => {
                        console.log(profile);
                        that.setState({
                            userId,
                            stocks: profile['stocks'],
                            profilePicture: profile['profilePicture'],
                            locations: profile['locations'],
                            firstName: profile['firstName'],
                            lastName: profile['lastName'],
                            display: <Feed userId={userId} profilePicture={profile['profilePicture']} />

                        });
                    });
                });
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

    displayMessages = async (user = undefined) => {
        // console.log("messages")
        let {token, userId, display} = this.state
        let id = user['id']

        if (display.type == (<MessageDisplay />).type) {
            await this.setState({display: null})
        }

        if (id != userId && user != undefined) {
            await this.setState({display: <MessageDisplay userId={userId} token={token} sendTo={id} firstName={user['firstName']} lastName={user['lastName']} profilePicture={user['profilePicture']} />})
        }
        
    }

    displayRequests = async () => {
        let {token, firstName, userId, lastName, profilePicture} = this.state;
        // let that = this
        this.setState({
            display: <RequestsDisplay userPicture={profilePicture} token={token} userLast={lastName} userId={userId} userFirst={firstName}/>
        })

        // await fetch("http://localhost:9000/friend-requests/getRequests?receiverId="+userId, {
        //     method: "GET",
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // }).then(async (res) => {
        //     await res.json().then(data => {
        //         console.log(data)
        //         that.setState({
        //             display: <RequestsDisplay userPicture={profilePicture} token={token} requests={data} userLast={userLast} userId={userId} userFirst={user}/>
        //         })
        //     })
        // })

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
                            display: <FriendsController displayMessages={this.displayMessages} display="friends" userId={userId} token={token} friends={data} firstName={user} lastName={userLast} query="" />,
                            friendData: data,
                        })
                    })
                })
            }
        } 
        else {
            let {friendData} = this.state
            await this.setState({display: null})
            await this.setState({display: <FriendsController displayMessages={this.displayMessages} display="friends" userId={userId} friends={friendData['data']} id={userId} firstName={user} lastName={userLast} query="" />
            })
        }

    }

    displayStocks = async () => {

        let { token, stocks, userId } = this.state;
        let type = "stocks";
        let that = this;

        if (token != "") {
            this.setState({display: <Stock favorites={stocks} userId={userId} />})
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
        
        let {userId, locations, stocks, display} = this.state
        

        // if (user != "") {
            return (
            <div className="main" style={{minHeight: "-webkit-calc(100%)"}}>
                <aside className="welcome-aside">
                    
                    {this.renderButtons()}                    

                </aside>
                <div className="main-content">{display}</div>
                
                <aside className="aside2" >
                    <div style={aside2}>
                        <div className="home-button" onClick={() => {this.setState({display:<Weather userId={userId} favorites={locations} />})}}><h3>Weather</h3></div>
                        <div className="home-button" onClick={() => this.setState({display: <Stock favorites={stocks} userId={userId} />})}><h3>Stocks</h3></div>
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