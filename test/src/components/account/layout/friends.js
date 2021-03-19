import React, {Component} from 'react';
import {getCookie} from '../../cookie';
import Header from '../../layout/Header'

import {search, displayed} from '../../layout/style'

export default class FriendsDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            friends: props.friends,
            query: props.query,
            searchResults: [],
            display: props.display,
            firstName: props.firstName,
            lastName: props.lastName, 
            _id: props.id,
            token: props.token,

        }
    }

    search = async () => {
        let {query} = this.state
        query = String(query).replace(" ", "").toLowerCase()
        let that = this
        let {_id} = this.state
        
        if (this.state.friends.includes(query)) {
            console.log(query)
        }
        await fetch("http://localhost:9000/users/findUser?userId="+_id+ "&fullName="+query, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            res.json().then(data => {
                that.setState({searchResults: data['users'], display: "search"})
            })
        })
    }

    addFriend = async (event) => {
        const _id = event.target.id
        const {firstName, lastName, token} = this.state

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

    removeFriend = async (event) => {
        const removedId = event.target.id
        const {_id} = this.state
        let that = this
        
        if (window.confirm("Remove friend?")) {
            await fetch("http://localhost:9000/friendships/remove?senderId="+_id+"&removedId="+removedId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    res.json().then(async (result) => {
                        console.log(result)
                        if (result['msg'] == "success") {
                            await fetch("http://localhost:9000/friendships/getAll?id="+_id, {
                                method: "GET",
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            }).then((res) => {
                                res.json().then(data => {
                                    console.log(data)
                                    that.setState({
                                        friends: data['data']
                                    })
                                })
                            })
                        }
                    })
                })
        // })
        }
    }
    

    handleSubmit = (event) => {
        event.preventDefault();

        this.search()
    }

    handleChange = (event) => {
        this.setState({query: event.target.value});
    }

    displayFriends = () => {
        let {display, friends, _id, searchResults} = this.state

        if (display == "friends") {

            return friends.map((friend, i) => {
                // friend = friend[0].toUpperCase() + friend.slice(1)
                let friendship = friend['friendship']
                let index = 0

                if (friendship[index]['id'] == _id) {
                    index = 1
                }

                let name = friendship[index]["firstName"] + " " + friendship[index]["lastName"]

                return (
                <div style={content}><h3 style={{padding: "2em", color: "black", margin: "0"}}>{name}</h3><button onClick={this.removeFriend} id={friendship[index]["id"]} style={{float: "right", marginTop: "auto", marginBottom: "auto"}}>Remove</button></div>
                )
            })
        }
        else if (display == "search") {
            if (searchResults.length > 0) {
                return searchResults.map((result, index) => {
                    let que = result["firstName"] + " " + result["lastName"]
                    return (
                        <div style={content}>
                        <h3 style={{marginTop:"auto", marginBottom: "auto"}}>{que}</h3>
                        <button style={drop, {backgroundImage: "none"}} id={result['_id']} onClick={this.addFriend}>Add friend</button>
                        </div>
                    )
                })
            }
            else {
                return <div><h3 style={{textAlign: "center", paddingTop: "2em"}}>No users found.</h3></div>
            }

        }
    }

    render() {
        return(
            <div style={{width: "100%"}}>
            <Header title={"Your Friends"}/>
            <div style={search}>
            <form onSubmit={this.handleSubmit}>
                <input style={{width: "20em"}} id="search" placeholder="Friend" onChange={this.handleChange} /><input text="search" className="submit"  type="submit" />
            </form>
            </div>
            <div>
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
    marginTop:"auto", 
    borderRadius: ".5em",
    marginBottom: "auto", 
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}