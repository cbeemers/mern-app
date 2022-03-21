import React, {Component} from 'react';
import Header from '../../layout/Header';
import { getAllRequests, deleteRequest, acceptRequest, friendshipExists } from '../helpers/functions';

export default class RequestsDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            token: props.token,
            userFirst: props.userFirst,
            userLast: props.userLast,
            userId: props.userId,
            userPicture: props.userPicture,
        }
    }

    componentDidMount() {
        this.getRequests();
    }

    getRequests = async () => {
        let {userId} = this.state;
        let that = this;

        await getAllRequests(userId).then(data => {
            that.setState({
                requests: data
            })
        })
    }

    respond = async (action, requestId, senderId, value) => {
        let {userId, userFirst, userLast} = this.state

        let split = value.split('-')
        let first = split[0]
        let last = split[1]

        const body = JSON.stringify({
            sender_id: senderId,
            sender_first: first,
            sender_last: last,
            user_id: userId,
            user_first: userFirst,
            user_last: userLast
        });

        if (action == "accept") {
            friendshipExists(userId, senderId).then(async data => {
                if (data['result'] != "found") {
                    acceptRequest(body);
                }
            });
        }

        this.removeRequest(requestId)
    }

    removeRequest = async (id) => {
        let that = this

        deleteRequest(id).then(res => {
            that.getRequests();
        })
    }

    display = () => {
        if (this.state.requests.length > 0) {
            return this.state.requests.map((result, index) => {
                let fullName = result["firstName"] + " " + result["lastName"]
                let que = result["firstName"] + "-" + result["lastName"] + "-" + result['profilePicture']
                let id = result['_id']
                return (
                    <div style={content}>
                    <div style={{display: "flex"}}>
                    <img className="profile-picture-else" src={result['profilePicture']} />
                    <h3 style={{padding: "1em", marginTop:"auto", marginBottom: "auto"}}>{fullName}</h3>
                    </div>
                    <div style={cluster}>
                    <button style={drop, {backgroundImage: "none"}} name="accept" value={que} requestId={id} senderId={result['senderId']} onClick={() => this.respond("accept", result['_id'], result['senderId'], que)}>Accept</button>
                    <button style={drop, {backgroundImage: "none"}} name="decline" value={que} requestId={id}  onClick={() => this.respond("decline", result['_id'], result['senderId'], que)}>Decline</button>
                    </div>
                    
                    </div>
                )
            })
        } else {
            return (
                <div style={{textAlign: "center", padding: "2em"}}><h3 style={{color: "black"}}>No new friend requests.</h3></div>
            )
        }
    }

    render() {
        return (
            <div style={{width: "100%"}}>
            <Header title={"Pending Friend Requests"} />
            {this.display()}
            </div>
        )
    }

}

let content = {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    // color: "red", 
    padding: "1em",
    borderBottom: ".5em solid black"
}
let cluster = {
    marginTop:"auto",
    marginBottom: "auto",  
    float:"right", 
}

let drop = {
    width: "5em",
    height: "3.4em", 
    borderRadius: "15px",
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}