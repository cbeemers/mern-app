import React, {Component} from 'react';
import {getCookie} from '../../cookie';
import Header from '../../layout/Header'

import {search, displayed} from '../../layout/style'

export default class RequestsDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            requests: props.requests,
            token: props.token,
            userFirst: props.userFirst,
            userLast: props.userLast,
            userId: props.userId,
        }
    }

    display = () => {

        if (this.state.requests.length > 0) {
            return this.state.requests.map((result, index) => {
                let que = result["firstName"] + " " + result["lastName"]
                return (
                    <div style={content}>
                    <h3 style={{marginTop:"auto", marginBottom: "auto"}}>{que}</h3>
                    <div style={cluster}>
                    <button style={drop, {backgroundImage: "none"}} name="accept" value={que} id={result['_id']} onClick={this.respond}>Accept</button>
                    <button style={drop, {backgroundImage: "none"}} name="decline" value={que} id={result['_id']} onClick={this.respond}>Decline</button>
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

    respond = async (event) => {
        let _id = event.target.id
        let name = event.target.value
        let split = name.split(" ")
        let first = split[0]
        let last = split[1]
        let {userId, userFirst, userLast} = this.state
        let action = event.target.name
        
        // await fetch("h")
    
        if (action == "accept") {
            await fetch("http://localhost:9000/friendships/exists?senderId="+userId+"&addedId="+_id, {
                method: "GET", 
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                res.json().then(async data => {
                    if (data['result'] != "found") {
                        console.log(data['result'])
                        await fetch("http://localhost:9000/friendships/add?added_id="+_id+"&added_first="+first+"&added_last="+last+"&sender_id="+userId+"&sender_first="+userFirst+"&sender_last="+userLast, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                        // .then((res) => {
                        //     res.json().then(data => {
                        //         console.log(data)
                        //     })
                        // })
                    }
                })
            })
        }

        this.removeRequest(_id)
    }

    removeRequest = async (id) => {
        let {userId, token} = this.state
        let that = this

        await fetch("http://localhost:9000/users/deleteRequest?sendId="+id+"&_id="+userId+"&token="+token, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        })

        await fetch("http://localhost:9000/users/getFromUser?type=requests&token="+token, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            res.json().then(data => {
                that.setState({
                    requests: data['values']
                })
            })
        })
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