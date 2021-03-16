import React, {Component} from 'react';
import {getCookie} from '../cookie';
import Header from '../layout/Header'

import {search, displayed} from '../layout/style'

export default class FriendsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            friends: [],
            query: "",
            searchResults: [],
            display: "friends",
            firstName: "",
            lastName: "", 
            _id: "",
            token: getCookie('token'),

        }
    }

    componentDidMount() {
        let token = getCookie("token");
        let that = this;

        if (token != "") {
            fetch("http://localhost:9000/users/getFromUser?type=all&token="+token, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                res.json().then(data => {
                    that.setState({
                        friends: data['friends'],
                        firstName: data['firstName'],
                        lastName: data['lastName'],
                        _id: data['_id']
                    })
                })
            })
        }
        
    }

    search = async () => {
        let {query} = this.state
        query = String(query).replace(" ", "").toLowerCase()
        let that = this
        let token = getCookie("token")
        
        if (this.state.friends.includes(query)) {
            console.log(query)
        }
        await fetch("http://localhost:9000/users/findUser?token="+token+ "&fullName="+query, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            res.json().then(data => {
                if (data['users'].length > 0) {
                    // console.log(data['users'])
                    that.setState({searchResults: data['users'], display: "search"})
                }
            })
        })
        // const uri = 
    }

    addFriend = async (event) => {
        const _id = event.target.id
        const {firstName, lastName, token} = this.state
        const sender_id = this.state['_id']
        // console.log(_id)

        await fetch("http://localhost:9000/users/sendRequest?_id="+_id+"&firstName="+firstName+"&lastName="+lastName+"&token="+token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) =>{
            res.json().then(data => {
                console.log(data)
            })
        })

    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.search()
    }

    handleChange = (event) => {
        this.setState({query: event.target.value});
    }

    displayFriends = () => {
        let {display} = this.state
        if (display == "friends") {
            return this.state.friends.map((friend, index) => {
                // friend = friend[0].toUpperCase() + friend.slice(1)
                return (
                    <h3 style={displayed}>{friend}</h3>
                )
            })
        }
        else if (display == "search") {
            return this.state.searchResults.map((result, index) => {
                let que = result["firstName"] + " " + result["lastName"]
                return (
                    <div style={content}>
                    <h3 style={{marginTop:"auto", marginBottom: "auto"}}>{que}</h3>
                    <button style={drop} id={result['_id']} onClick={this.addFriend}>Add friend</button>
                    </div>
                )
            })
        }
    }

    render() {
        return(
            <div>
            <Header title={"Your Friends"}/>
            <div style={search}>
            <form onSubmit={this.handleSubmit}>
                <input style={{width: "20em"}} id="search" placeholder="Friend" onChange={this.handleChange} /><input text="search" className="submit" style={{backgroundImage: "url('./img/search.png')"}} type="submit" />
            </form>
            </div>
            <div style={{padding: "2em"}}>
            {this.displayFriends()}
            </div>
            </div>
        )
    }
}
let content = {
    display: "flex",
    justifyContent: "space-between",
    
    // color: "red", 
    padding: "1em",
    borderBottom: ".5em solid black"
}

let drop = {
    width: "5em",
    float:"right", 
    height: "3.4em", 
    // padding: ".2em",
    marginTop:"auto", 
    borderRadius: ".5em",
    marginBottom: "auto", 
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}