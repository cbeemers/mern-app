import React, {Component} from 'react'

import ProfileHeader from '../../layout/profileHeader'
import FriendsDisplay from '../layout/friends'

export default class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.userId,
            firstName: "",
            lastName: "",
            joinedDate: "",
            bio: "",
            profilePicture: "",
            display: null,
            header: null,
            exists: props.exists,
        }

        this.openProfile = this.props.openProfile.bind(this);
        this.friendshipExists = this.props.friendshipExists.bind(this);
        this.addFriend = this.props.addFriend.bind(this);
        this.displayMessages = this.props.displayMessages.bind(this);
        
    }

    componentDidMount() {
        let {userId, exists} = this.state
        let that = this
        // console.log(userId)

        fetch("http://localhost:9000/users/getUser?_id="+userId, {
            method: "GET",
            'Content-Type': 'application/json'
        }).then(res => {
            res.json().then(data => {
                that.setState({
                    firstName: data['firstName'], 
                    lastName: data['lastName'], 
                    profilePicture: data['profilePicture'], 
                    joinedDate: data['joinedDate'],
                    header: <ProfileHeader displayMessages={this.displayMessages} addFriend={this.addFriend} id={userId} profilePicture={data['profilePicture']} firstName={data['firstName']} lastName={data['lastName']} joinedDate={data['joinedDate']} exists={exists}/>
                })
                console.log(data)
            })
        })
    }

    getFriends = async (event) => {
        event.preventDefault()
        let {userId, firstName, lastName, token, display} = this.state
        let that = this

        if (display == null) {
            await fetch("http://localhost:9000/friendships/getAll?id="+userId).then(res => {
                res.json().then(data => {
                  //   console.log(data['data'])
                  //   console.log(userId)
                    that.setState({display: <FriendsDisplay 
                      friends={data['data']} firstName={firstName}
                      lastName={lastName}
                      id={userId}
                      token={token}
                      header={null}
                      openProfile={that.openProfile}
                      type="profile"
                      friendshipExists={this.friendshipExists}
                      addFriend={this.addFriend}
                      
                      />})
                })  
              })
        }
        else {
            this.setState({display: null})
        }



    }

    render() {
        let {userId, display, profilePicture, firstName, lastName, joinedDate, header} = this.state
        return (
            <div>
                {header}
                <div onClick={this.getFriends} style={{margin: "auto 0", display: "flex", width: "100%", height: "4em", backgroundColor: "#192635", padding: "1em", alignItems: "center", justifyContent: "center"}}><h2 style={{padding: "1em"}}>Friends</h2><img style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/arrow.png" /></div>
                {/* <div style={{margin: "auto", display: "flex", width: "100%", height: "4em", backgroundColor: "#192635"}}><h2 style={{padding: "1em"}}>{firstName} {lastName} Friends</h2><img style={{height: "2em", width: "2em"}} src="./img/arrow.png" /></div> */}
                
            {display}
            </div>
        )
    }
}