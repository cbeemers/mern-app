import React from 'react';
import Header from '../layout/Header';
import { Redirect } from 'react-router-dom';

import {form_style, label, border} from '../layout/style';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            email: "", 
            password: "", 
            data: null,
        }
        this.signup = this.props.signup.bind(this);
    }

    typeUsername = (event) => {
        this.setState({
            email: event.target.value,
        });
    }

    typePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    submit = (event) => {
        event.preventDefault();

        fetch("http://localhost:9000/users/authenticate", {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            
            if (res.status === 200) {
                let that = this;

                res.json().then(data => {
    
                    document.cookie = 'token' + "=" + "bearer " + data['token'];
                    // that.props.history.push('/');
                    window.location.reload()

                });
                
            } else if (res.status === 401) {
                this.setState({
                    message: "Username or password incorrect"
                });
            }
        });
    }

    render() {
        const {message} = this.state;
        return (
            <div style={account2}>
            <Header title={"Login"} />
            
            <div style={form_style}>
            <form style={border} onSubmit={this.submit}>
            <p>{message}</p>
                <div className="form-group">
                <label style={label} htmlFor="email">Email: </label>
                <input onChange={this.typeUsername} type="email" className="form-control" name="email" id="username" />
                </div>
                <div className="form-group">
                <label style={label} htmlFor="password">Password: </label>
                <input onChange={this.typePassword} type="password" className="form-control" name="password" id="password" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <p style={{paddingTop: "1em"}}>Don't have an account? <a onClick={this.signup} href="">Signup</a></p>
            </form>
            </div>
            
            </div>
        );
    }
}

let account2 = {
    minHeight: "-webkit-calc(100%)",
    backgroundColor: "#191970",
    overflow: "hidden",
}

export default Login;