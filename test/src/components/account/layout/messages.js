import React, {Component} from 'react'
import Header from '../../layout/Header'


export default class MessageDisplay extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            token: props.token,
            userId: props.userId,
            sendTo: props.sendTo,
            recipientFirst: props.firstName,
            recipientLast: props.lastName,
            recipientPic: props.profilePicture
        }
        console.log(props.userId)
    }

    render() {
        let {sendTo} = this.state
        
        return (
        <div>
            <Header title="Messages" />
            <h1 style={{color: 'black'}}>{sendTo}</h1>
        </div>
            
        )
    }
}