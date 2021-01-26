import React, {Component} from 'react';

import {getCookie} from '../cookie';

import Header from '../layout/Header';
import {account} from '../layout/style';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: ""
        }
    }

    componentDidMount() {
        let user;
        let token = getCookie("token");

        if (token !== "") {
            let that = this;

            fetch("http://localhost:9000/checkToken?token="+token, {
                method: 'GET',
                query: token,
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        user = data['email'];
                        that.setState({user});
                    });
                } 
            });
        }
    }



    render() {
        let {user} = this.state;
        console.log(user);
        return (
            <div style={account}>
                <Header title={"Profile"} />
                <div className="main">
                <aside className="aside1">
                    <div style={{textAlign: "center", marginTop: "4em"}}>
                        <p style={{margin: "0"}}><img className="profile-picture" src="./img/profile-default.png" /></p>
                        <p>on click, allow for change of profile picture</p>
                    </div>
                    <div style={{textAlign: "center", marginTop: "2em"}}>Date Joined</div>

                </aside>
                <div className="main-content" style={{padding: "2em"}}>
                    <div>add username</div>
                    <div>stocks: delete option</div>
                    <div>weather: delete option</div>
                    <div>ability change welcome image</div>
                    <div>delete account</div>
                    <div>change password and or email?</div>
                    <div>could still do games</div>
                </div>
                
                </div>

            </div>
            
        );
    }
}