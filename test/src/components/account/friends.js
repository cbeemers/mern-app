import React, {Component} from 'react';
import {getCookie} from '../cookie';
import FriendsDisplay from '../account/layout/friends'

export default class FriendsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            friends: [],
            query: "",
            searchResults: [],
            display: null,
            firstName: "",
            lastName: "", 
            _id: "",
            token: getCookie('token'),

        }
    }

    componentDidMount() {
        let token = getCookie("token");
        let that = this;

        if (token != "") {
            fetch("http://localhost:9000/users/getFromUser?type=all&token="+token, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                res.json().then(async (data) => {
                    that.setState({
                        friends: data['friends'],
                        firstName: data['firstName'],
                        lastName: data['lastName'],
                        _id: data['_id']
                    })
                    let id = data['_id']
                    await fetch("http://localhost:9000/friendships/getAll?id="+data['_id'], {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then((res) => {
                        res.json().then(friends => {
                            that.setState({
                                display: <FriendsDisplay display="friends" token={token} friends={friends['data']} id={id} firstName={data['firstName']} lastName={data['lastName']} query="" />
                            })
                        })
                    })
                })
            })
        }
    }

    render() {
        let {display} = this.state
        return(
            <div style={{minHeight: "-webkit-calc(100%)"}}>
                {display}
            </div>
        )
    }
}