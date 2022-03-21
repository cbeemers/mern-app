import React, {Component} from 'react'

import Post from './post'
import ProfileHeader from '../../layout/profileHeader'
import FriendsDisplay from '../layout/friends'
import { checkToken, getCookie } from '../../cookie'
import Feed from '../feed'
import { getAllFriendships, displayPosts, getUserPosts } from '../helpers/functions'

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
            posts: [], 
            displayType: "posts", 
            currUserId: props.currUser
        }

        this.openProfile = this.props.openProfile.bind(this);
        this.friendshipExists = this.props.friendshipExists.bind(this);
        this.addFriend = this.props.addFriend.bind(this);
        this.displayMessages = this.props.displayMessages.bind(this);
        
    }

    componentDidMount() {
        // this.getUserPosts();
        let {userId, profilePicture} = this.state;
        let that = this;

        getUserPosts(userId).then(posts => {
            that.setState({posts, display: <Feed userId={userId} profilePicture={profilePicture} posts={posts} /> })
        })
    }

    getPosts = async () => {
        let {userId} = this.state;
        let that = this;

        getUserPosts(userId).then(posts => {
            that.setFeedDisplay(posts);
        })
    }

    setFeedDisplay = (posts) => {
        let {userId, profilePicture} = this.state;
        this.setState({display: <Feed userId={userId} profilePicture={profilePicture} posts={posts} /> });
    }

    getFriends = async (event) => {
        event.preventDefault()
        let {userId, firstName, lastName, token, displayType, profilePicture} = this.state
        let that = this

        if (displayType == "posts") {
            await getAllFriendships(userId).then(data => {
                that.setState({displayType: "friends", 
                display: <FriendsDisplay 
                    friends={data} firstName={firstName}
                    lastName={lastName}
                    id={userId}
                    token={token}
                    openProfile={that.openProfile}
                    type="profile"
                    friendshipExists={this.friendshipExists}
                    addFriend={this.addFriend}
                    
                />});
            });  
        }
        else {
            let {posts} = this.state;
            this.setFeedDisplay(posts)
        }
    }

    render() {
        let {userId, display, profilePicture, firstName, lastName, bio, joinedDate, posts} = this.state
        console.log(firstName)
        return (
            <div>
                <div style={userInfo}>
                    <img src={profilePicture} style={profilePictureStyle} />
                    <h2>{firstName} {lastName}</h2>
                    <div style={bioContainer}><p>{bio}</p><div style={messageButtonContainer}><img style={messageButton} src={'./img/msg.png'} /></div></div>
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

const bioContainer = {
    maxWidth: 350,
    display: 'flex',
    flexDirection: 'row',
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

const messageButton = {
    width: 60, 
    height: 50,
    borderRadius: '40%',
}
const messageButtonContainer = {
    display: 'block',
    margin: 'auto'
}

const profilePictureStyle = {
    height: '6em', 
    width: '6em', 
    borderRadius: '50%', 
    padding: '.5em'
}

const userInfo = {
    // margin: "auto 0", 
    backgroundColor: '#192635',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '8em',
    width: '100%',
    justifyContent: 'center',
    alignItems: "center", 
    padding: 10,
}

