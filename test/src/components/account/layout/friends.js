import React, {Component} from 'react';
import {getCookie} from '../../cookie';
import Header from '../../layout/Header'
import Profile from './profile'

import {search, displayed} from '../../layout/style'

export default class FriendsDisplay extends Component {
    constructor(props) {
        super(props)
        // console.log(props.friends)
        let header = (<Header title={"Your Friends"} />)
        if (props.header !== undefined) {
            header = props.header
        }
        
        this.state = {
            friends: props.friends,
            query: props.query,
            searchResults: [],
            display: "friends",
            firstName: props.firstName,
            lastName: props.lastName, 
            _id: props.id,
            token: props.token,
            header,
            profileId: "",
            type: props.type
            

        }
        
        // Open profile is function of the friends component controller
        // Opens a profile of a user that is being displayed by either a profile page or users friends page
        this.openProfile = this.props.openProfile.bind(this);
        this.friendshipExists = this.props.friendshipExists.bind(this);
        this.addFriend = this.props.addFriend.bind(this);
        if (this.props.removeFriend) {
            this.removeFriend = this.props.removeFriend.bind(this);
        }
        
        
    }


    search = async () => {
        let {query} = this.state
        let find = String(query).replace(/ /g, "").toLowerCase()
        let that = this
        let {_id} = this.state
        
        if (this.state.friends.includes(find)) {
            console.log(query)
        }
        // console.log(query)
        await fetch("http://localhost:9000/users/findUser?userId="+_id+ "&fullName="+find, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            res.json().then(data => {
                // console.log(data['users'])
                that.setState({searchResults: data['users'], display: "search", header: null})
                that.setState({header: <Header title={"Results for '"+query+"'"} />})
            })
        })
    }

    // addFriend = async (_id, event) => {
    //     // const _id = event.target.id
    //     const {firstName, lastName, token} = this.state

    //     await fetch("http://localhost:9000/users/sendRequest?_id="+_id+"&firstName="+firstName+"&lastName="+lastName+"&token="+token, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then((res) =>{
    //         res.json().then(data => {
    //             console.log(data)
    //         })
    //     })
    // }

    // removeFriend = async (removedId, event) => {
    //     event.preventDefault()
    //     const {_id} = this.state
    //     let that = this
        
    //     if (window.confirm("Remove friend?")) {
    //         await fetch("http://localhost:9000/friendships/remove?senderId="+_id+"&removedId="+removedId, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             }).then((res) => {
    //                 res.json().then(async (result) => {
    //                     console.log(result)
    //                     if (result['msg'] == "success") {
    //                         await fetch("http://localhost:9000/friendships/getAll?id="+_id, {
    //                             method: "GET",
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                             }
    //                         }).then((res) => {
    //                             res.json().then(data => {
    //                                 console.log(data)
    //                                 that.setState({
    //                                     friends: data['data']
    //                                 })
    //                             })
    //                         })
    //                     }
    //                 })
    //             })
    //     }
    // }
    

    handleSubmit = (event) => {
        event.preventDefault();

        this.search()
    }

    handleChange = (event) => {
        this.setState({query: event.target.value});
    }

    // openProfile = (event) => {
    //     let id = event.target.id
    //     console.log(id)
    //     if (id) {
    //         this.setState({display: <Profile userId={id} />, profileId: id, header: null})
    //     } else {
            
    //     }
    // }

    displayRemove = (id) => {
        let {type} = this.state
        if (type === "user") {
            return (<button title="remove" onClick={(e) => this.removeFriend(id, e)} style={{float: "right", marginTop: "auto", marginBottom: "auto", borderRadius: "15%"}}>Remove</button>)
        }
    }


    displayFriends = () => {
        let {display, friends, _id, searchResults} = this.state

        if (display == "friends") {

            return friends.map((friend, i) => {
                // friend = friend[0].toUpperCase() + friend.slice(1)
                let friendship = friend['friendship']

                // Index into friendship array for the non current user
                let index = 0
                // console.log(_id)
                if (friendship[index]['id'] == _id) {
                    index = 1
                }

                let name = friendship[index]["firstName"] + " " + friendship[index]["lastName"]

                return (
                <div onClick={(e) => this.openProfile(friendship[index]["id"], e)} style={content}>
                    <div style={{display:"flex"}}>
                    <img className="profile-picture-else" src={friendship[index]["profilePicture"]} />
                    <h3 style={{ color: "black", margin: "auto 0" , padding: "1em"}}>{name}</h3></div>
                    {this.displayRemove(friendship[index]["id"])}
                </div>
                )
            })
        }
        else if (display == "search") {

            if (searchResults.length > 0) {
                return searchResults.map((result, index) => {
                    let que = result["firstName"] + " " + result["lastName"]
                    
                    return (
                        <div onClick={(e) => this.openProfile(result['_id'], e)} style={content}>
                        <div style={{display: "flex"}}>
                        <img className="profile-picture-else" src={result['profilePicture']}/>
                        <h3 style={{padding: "1em", marginTop:"auto", marginBottom: "auto"}}>{que}</h3>
                        </div>
                        <button title="add" style={drop, {backgroundImage: "none", margin: "auto 0"}} onClick={(e) => this.addFriend(result['_id'], e)}>Add friend</button>
                        </div>
                    )
                })
            }
            else {
                return <div><h3 style={{textAlign: "center", paddingTop: "2em"}}>No users found.</h3></div>
            }
        } 
        else {
            return display
        }

        // else if (display === "profile") {
        //     return <Profile id={this.state.profileId} />
        // }

        
    }

    displaySearch = () => {
        if (this.state.profileId === "") {
           return (
                <div style={tempSearch}>
                <form onSubmit={this.handleSubmit}>
                    <input style={{width: "20em"}} id="search" placeholder="Friend" onChange={this.handleChange} /><input text="search" className="submit"  type="submit" />
                </form>
                </div>
            ) 
        }
    }

    render() {
        let {header} = this.state
        return(
            <div style={{width: "100%"}}>
            {header}
            {this.displaySearch()}
            <div style={{color: "black"}}>
            {this.displayFriends()}
            </div>
            </div>
        )
    }
}
let content = {
    display: "flex",
    justifyContent: "space-between",
    padding: "1em",
    borderBottom: ".5em solid black"
}

// Make deep copy of the search CSS object, add a border to the bottom
let tempSearch = JSON.parse(JSON.stringify(search))
tempSearch.borderBottom = ".5em solid black"


let drop = {
    width: "5em",
    float:"right", 
    height: "1em", 
    marginTop:"auto", 
    borderRadius: ".5em",
    marginBottom: "auto", 
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}