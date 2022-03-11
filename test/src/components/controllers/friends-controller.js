import React, {Component} from 'react'

import FriendsDisplay from '../account/layout/friends'
import Profile from '../account/layout/profile'
import Stack from '../stack'

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
            userId: props.userId
        }

        this.displayMessages = this.props.displayMessages.bind()
    }

    openProfile = async (friendship, event) => {

        if (event.target.title == ""){
            let {stack, userId} = this.state
            let exists = await this.friendshipExists(friendship['id'])
    
            if (friendship['id']) {
                if (this.state.displayComponent.type === (<Profile />).type) {
                    await this.setState({displayComponent: null})
                }
                let displayComponent = (<Profile bio={friendship['bio']} firstName={friendship['firstName']} lastName={friendship['lastName']} displayMessages={this.displayMessages} addFriend={this.addFriend} friendshipExists={this.friendshipExists} userId={friendship['id']} profilePicture={friendship['profilePicture']} openProfile={this.openProfile} exists={exists} />)
                stack.enqueue(displayComponent)
                await this.setState({displayComponent, stack, profileId: friendship['id'], exists})
                
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

    displayStackNav = () => {

        if (this.state.stack.index >= 1) {

            return (
                <div style={{height: "2em", width: "100%", backgroundColor: "#192635", padding: "1em"}}>
                    <img onClick={this.backPage} style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/backArrow.png"/>
                </div>
            )
        }

    }

    removeFriend = async (removedId, event) => {
        event.preventDefault()
        const {userId, token, firstName, lastName} = this.state
        let that = this
        
        if (window.confirm("Remove friend?")) {
            await fetch("http://localhost:9000/friendships/remove?senderId="+userId+"&removedId="+removedId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    res.json().then(async (result) => {
                        console.log(result)
                        if (result['msg'] == "success") {
                            await fetch("http://localhost:9000/friendships/getAll?id="+userId, {
                                method: "GET",
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            }).then((res) => {
                                res.json().then(async (data) => {
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
                                    />)
                                    await that.setState({
                                        friends: data['data'],
                                        displayComponent: null,
                                    })
                                    await that.setState({
                                        displayComponent,
                                        stack: new Stack(displayComponent)
                                    })
                                })
                            })
                        }
                    })
                })
        }
    }

    addFriend = async (_id, event) => {
        // const _id = event.target.id
        const {firstName, lastName, userId} = this.state

        await fetch("http://localhost:9000/friend-requests/sendRequest", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receiverId: _id, 
                senderId: userId
            })
        }).then(async (res) =>{
            await res.json().then(data => {
                console.log(data)
            })
        })
    }

    backPage = async () => {
        let {stack} = this.state
        await this.setState({displayComponent: null})
        let displayComponent = stack.dequeue()
        await this.setState({stack, displayComponent})
    }

    render () {
        let {stack, displayComponent} = this.state

        // let displayComponent = stack.curr()
        // console.log(displayComponent)

        return (
            <div>
                {this.displayStackNav()}
                {displayComponent}
            </div>
            )
    }
}