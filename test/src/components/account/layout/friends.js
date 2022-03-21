import React, {Component} from 'react';
import {getCookie, checkToken} from '../../cookie';
import Header from '../../layout/Header'
import Profile from './profile'

import {search, displayed} from '../../layout/style'
import { findProfile } from '../helpers/functions';

export default class FriendsDisplay extends Component {
    constructor(props) {
        super(props)
        // console.log(props.friends)
        // let header = (<Header title={"Your Friends"} />)
        // if (props.header !== undefined) {
        //     header = props.header
        // }
        
        this.state = {
            friends: props.friends,
            query: props.query,
            searchResults: [],
            display: "friends",
            firstName: props.firstName,
            lastName: props.lastName, 
            _id: props.id,
            token: props.token,
            // header,
            profileId: "",
            type: props.type, 
            currUser:""
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

    componentDidMount() {
        let token = getCookie('token')
        let that = this;
        if (token) {
            checkToken(token).then(userId => {
                that.setState({currUser: userId});
            });
        }
    }

    search = async () => {
        let {query, _id} = this.state
        let find = String(query).replace(/ /g, "").toLowerCase()
        let that = this

        await findProfile(_id, find).then(data => {
            that.setState({searchResults: data['users'], display: "search", header: null})
            that.setState({header: <Header title={"Results for '"+query+"'"} />})
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.search()
    }

    handleChange = (event) => {
        this.setState({query: event.target.value});
    }

    displayRemove = (id) => {
        let {type} = this.state
        if (type === "user") {
            return (<button title="remove" onClick={(e) => this.removeFriend(id, e)} style={{float: "right", marginTop: "auto", marginBottom: "auto", borderRadius: "15%"}}>Remove</button>)
        }
    }


    displayFriends = () => {
        let {display, friends, _id, searchResults} = this.state

        if (display == "friends") {
            return friends.map((friendship, i) => {
                let name = friendship["firstName"] + " " + friendship["lastName"]

                return (
                <div onClick={(e) => this.openProfile(friendship, e)} style={content}>
                    <div style={{display:"flex"}}>
                    <img className="profile-picture-else" src={friendship["profilePicture"]} />
                    <h3 style={{ color: "black", margin: "auto 0" , padding: "1em"}}>{name}</h3></div>
                    {this.displayRemove(friendship["id"])}
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
        let {currUser, _id} = this.state
        return(
            <div style={{width: "100%"}}>
            {/* {currUser==_id? header: null} */}
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