import React from 'react';
import Header from '../layout/Header';
import { Redirect } from 'react-router-dom';
import { authenticate } from './helpers/functions';

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

    submit = async (event) => {
        event.preventDefault();
        let {email, password} = this.state;
        let that = this;

        await authenticate(email, password).then(data => {
            if (data['message']) {
                that.setState({message: data['message']});
            }
        });
    }

    render() {
        const {message} = this.state;
        return (
            <div style={account2}>
            <Header title={"Login"} color={'#191970'} />
            
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