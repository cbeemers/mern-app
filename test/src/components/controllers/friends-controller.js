import React, {Component} from 'react'

import FriendsDisplay from '../account/layout/friends'
import Profile from '../account/layout/profile'
import Stack from '../stack'
import Header from '../layout/Header'
import { addFriend, removeFriend, getAllFriendships } from '../account/helpers/functions'

export default class FriendsController extends Component {
    constructor(props) {
        super(props)

        let displayComponent = (<FriendsDisplay 
            token={props.token}
            friends={props.friends}
            id={props.userId}
            firstName={props.firstName}
            lastName={props.lastName}
            query=""
            openProfile={this.openProfile}
            type={"user"}
            friendshipExists={this.friendshipExists}
            addFriend={this.addFriend}
            removeFriend={this.removeFriend}
        />)

        this.state = {
            friends: props.friends,
            query: props.query,
            display: props.display,
            firstName: props.firstName,
            lastName: props.lastName, 
            token: props.token,
            stack: new Stack(displayComponent),
            displayComponent,
            profileId: "",
            exists: true, // If friendship already exists
            userId: props.userId,
            header: <Header title={"Your Friends"} />
        }

        this.displayMessages = this.props.displayMessages.bind()
    }

    openProfile = async (friendship, event) => {

        if (event.target.title == ""){
            let {stack, id} = this.state
            let exists = await this.friendshipExists(friendship['id'])
    
            if (friendship['id']) {
                // if (this.state.displayComponent.type === (<Profile />).type) {
                this.setState({displayComponent: null})
                // }
                let displayComponent = (<Profile bio={friendship['bio']} firstName={friendship['firstName']} lastName={friendship['lastName']} displayMessages={this.displayMessages} addFriend={this.addFriend} friendshipExists={this.friendshipExists} userId={friendship['id']} profilePicture={friendship['profilePicture']} openProfile={this.openProfile} exists={exists} currUser={id} />)
                stack.enqueue(displayComponent)
                this.setState({displayComponent, stack, profileId: friendship['id'], exists, header: null})
                
            }
        }
    }

    friendshipExists = async (otherId) => {
        let {userId} = this.state;
        let exists = false;

        await fetch("http://localhost:9000/friendships/exists?senderId="+userId+"&addedId="+otherId, {
            method: "GET"
        }).then(res => {
            if (res.status === 200) {
                exists = true;
            }
        }); 

        return exists;
    }

    removeFriend = async (removedId, event) => {
        event.preventDefault()
        const {userId, token, firstName, lastName} = this.state
        let that = this
        
        if (window.confirm("Remove friend?")) {
            removeFriend(userId, removedId).then(async (result) => {
                console.log(result)
                if (result['msg'] == "success") {
                    getAllFriendships(userId).then(async (data) => {
                        console.log(data)
                        let displayComponent = (<FriendsDisplay 
                            token={token}
                            friends={data}
                            id={userId}
                            firstName={firstName}
                            lastName={lastName}
                            query=""
                            openProfile={that.openProfile}
                            type={"user"}
                            friendshipExists={that.friendshipExists}
                            addFriend={that.addFriend}
                            removeFriend={that.removeFriend}
                        />);
                        that.setState({
                            friends: data['data'],
                            displayComponent: null,
                        });
                        that.setState({
                            displayComponent,
                            stack: new Stack(displayComponent)
                        });
                    });
                }
            });
        }
    }

    addFriend = async (_id, event) => {
        const {userId} = this.state

        addFriend(userId, _id).then(data => {
            console.log(data)
        })
    }

    backPage = async () => {
        let {stack} = this.state
        let displayComponent = stack.dequeue();
        let header = null
        
        if (stack.currIndex() == 0) {
            header = <Header title={"Your Friends"} />
        }
        await this.setState({displayComponent: null})
        await this.setState({stack, displayComponent, header})
    }

    displayStackNav = () => {
        if (this.state.stack.index >= 1) {
            return (
                <div style={{height: "2em", width: "100%", backgroundColor: "#192635", padding: "1em"}}>
                    <img onClick={async () => await this.backPage()} style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/backArrow.png"/>
                </div>
            )
        }
    }

    render () {
        let {displayComponent, header} = this.state

        return (
            <div>
                {header}
                {this.displayStackNav()}
                {displayComponent}
            </div>
            )
    }
}