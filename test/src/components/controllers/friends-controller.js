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
            id={props.id}
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
            _id: props.id,
            token: props.token,
            stack: new Stack(displayComponent),
            displayComponent,
            profileId: "",
            exists: true, // If friendship already exists

        }
    }

    openProfile = async (id, event) => {
        // let id = event.target.id
        console.log(event.target.title)
        if (event.target.title == ""){
            let {stack, _id} = this.state
            let exists = await this.friendshipExists(id)
    
            if (id) {
                if (this.state.displayComponent.type === (<Profile />).type) {
                    // this.state.displayComponent.destroy()
                    await this.setState({displayComponent: null})
                    // console.log("yo")
                    // return
                }
                let displayComponent = (<Profile addFriend={this.addFriend} friendshipExists={this.friendshipExists} userId={id} openProfile={this.openProfile} />)
                stack.enqueue(displayComponent)
                await this.setState({displayComponent, stack, profileId: id, exists})
                
            }
        }
    }

    friendshipExists = async (otherId) => {
        let {_id} = this.state;
        let exists = false;

        await fetch("http://localhost:9000/friendships/exists?senderId="+_id+"&addedId="+otherId, {
            method: "GET"
        }).then(res => {
            if (res.status === 200) {
                exists = true;
                console.log("yo")
            }
        })
        console.log("should be second")
        return exists;
        
    }

    displayStackNav = () => {
        let {profileId, _id, exists} = this.state
        // let exists = await this.friendshipExists(profileId)

        if (this.state.stack.index >= 1) {
            let addButton = (<button style={{float: "right", borderRadius: "10%"}} onClick={(e) => this.addFriend(profileId, e)}>Add Friend</button>)

            return (
                <div style={{height: "2em", width: "100%", backgroundColor: "#192635", padding: "1em"}}>
                    <img onClick={this.backPage} style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/backArrow.png"/>
                    {!exists && _id != profileId && addButton}
                </div>
            )
        }

    }

    removeFriend = async (removedId, event) => {
        event.preventDefault()
        const {_id, token, firstName, lastName} = this.state
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
                                res.json().then(async (data) => {
                                    console.log(data)
                                    let displayComponent = (<FriendsDisplay 
                                        token={token}
                                        friends={data['data']}
                                        id={_id}
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