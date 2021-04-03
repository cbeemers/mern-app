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
            displayComponent

        }
    }

    openProfile = async (event) => {
        let id = event.target.id
        let {stack, _id} = this.state
        console.log(_id)
        let exists = await this.friendshipExists(id)
        console.log(exists)
        
        if (id) {
            if (this.state.displayComponent.type === (<Profile />).type) {
                // this.state.displayComponent.destroy()
                await this.setState({displayComponent: null})
                // console.log("yo")
                // return
            }
            let displayComponent = (<Profile friendshipExists={this.friendshipExists} userId={id} openProfile={this.openProfile} exists={exists}/>)
            stack.enqueue(displayComponent)
            await this.setState({displayComponent, stack})
            
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
        if (this.state.stack.index >= 1) {
            return (
                <div style={{height: "2em", width: "100%", backgroundColor: "#192635", padding: "1em"}}>
                    <img onClick={this.backPage} style={{height: "2em", width: "2em", borderRadius: "10%"}} src="./img/backArrow.png"/>
                </div>
            )
        }

    }
    
    forceful = () => {
        this.forceUpdate();
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