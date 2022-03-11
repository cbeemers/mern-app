import React, {Component} from 'react'

import ProfileHeader from '../../layout/profileHeader'
import FriendsDisplay from '../layout/friends'
import { checkToken, getCookie } from '../../cookie'

export default class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.userId,
            firstName: props.firstName,
            lastName: props.lastName,
            joinedDate: "",
            bio: props.bio,
            profilePicture: props.profilePicture,
            display: null,
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

        // fetch("http://localhost:9000/profiles/getUser?_id="+userId, {
        //     method: "GET",
        //     'Content-Type': 'application/json'
        // }).then(res => {
        //     res.json().then(data => {
        //         that.setState({
        //             firstName: data['firstName'], 
        //             lastName: data['lastName'], 
        //             profilePicture: data['profilePicture'], 
        //             joinedDate: data['joinedDate'],
        //             header: <ProfileHeader displayMessages={this.displayMessages} addFriend={this.addFriend} id={userId} profilePicture={data['profilePicture']} firstName={data['firstName']} lastName={data['lastName']} joinedDate={data['joinedDate']} exists={exists}/>
        //         })
        //         console.log(data)
        //     })
        // })

        // fetch("http://localhost:9000/profiles/getProfile", {
        //     method: "GET",
        //     "Content-Type": "application/json",
        //     body: {userId}
        // }).then(res => {
        //     res.json().then(data => {
        //         that.setState({
        //             firstName: data['firstName'],
        //             lastName: data['lastName'], 
        //             profilePicture: data['profilePicture'], 
        //             joinedDate: data['joinedDate'],
        //             header: <ProfileHeader displayMessages={this.displayMessages} addFriend={this.addFriend} id={userId} profilePicture={data['profilePicture']} firstName={data['firstName']} lastName={data['lastName']} joinedDate={data['joinedDate']} exists={exists}/>
        //         })
        //     })
        // })
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
                      friends={data} firstName={firstName}
                      lastName={lastName}
                      id={userId}
                      token={token}
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
        let {userId, display, profilePicture, firstName, lastName, bio, joinedDate} = this.state
        console.log(firstName)
        return (
            <div>
                <div style={userInfo}>
                    <img src={profilePicture} style={profilePictureStyle} />
                    <h2>{firstName} {lastName}</h2>
                    <p>{bio}</p>
                    <div onClick={this.getFriends} style={friendsDropdown}>
                        <h3 style={{padding: "1em"}}>Friends</h3>
                        <img style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/arrow.png" />
                    </div>
                </div>
                {/* <div style={{margin: "auto", display: "flex", width: "100%", height: "4em", backgroundColor: "#192635"}}><h2 style={{padding: "1em"}}>{firstName} {lastName} Friends</h2><img style={{height: "2em", width: "2em"}} src="./img/arrow.png" /></div> */}
                
            {display}
            </div>
        )
    }
}

const friendsDropdown = {
    margin: "auto 0", 
    display: "flex", 
    width: "100%", 
    height: "4em", 
    padding: "1em", 
    alignItems: "center", 
    justifyContent: "center"
}

const profilePictureStyle = {
    height: '6em', 
    width: '6em', 
    borderRadius: '50%', 
    padding: '.5em'
}

const userInfo = {
    // margin: "auto 0", 
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#192635',
    minHeight: '8em',
    width: '100%',
    justifyContent: 'center',
    alignItems: "center", 
}

