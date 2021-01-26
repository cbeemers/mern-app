import React from 'react';
import Header from '../layout/Header';

import {form_style, label, border, account} from '../layout/style';


export default class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            email: "",
            password: "",
            confirm: "",
        };
    }

    usernameChange = (event) => {
        this.setState({
            email: event.target.value,
        });
    }

    passwordChange = (event) => {
        this.setState({
            password: event.target.value,
        });
    }

    confirmChange = (event) => {
        this.setState({
            confirm: event.target.value,
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {password, confirm, message} = this.state;

        if (password == confirm) {
            fetch('http://localhost:9000/users/add', {
                method: 'POST', 
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(res => {
                if (res.status == 200) {
                    this.props.history.push('/login');
                } else if (res.status === 401) {
                    console.log(res)
                    this.setState({
                        message: "User already exists!"
                    });
                }
            });
        } else {
            this.setState({
                message: "Passwords don't match!",
            });
        }
    }

    render() { 
        const {message, password, confirm, email} = this.state;
        return (
            <div style={account}>
                <Header title={"Signup"} />
            <div style={form_style}>
            <form style={border} onSubmit={this.handleSubmit}>
                <p>{message}</p>
                <div className="form-group">
                <label style={label} htmlFor="email">Email: </label>
                <input type="email" className="form-control" name="email" id="username" onChange={this.usernameChange}/>
                </div>
                <div className="form-group">
                <label style={label} htmlFor="password">Password: </label>
                <input onChange={this.passwordChange} type="password" className="form-control" name="password" id="password" />
                </div>
                <div className="form-group">
                <label style={label} htmlFor="confirm">Confirm Password: </label>
                <input onChange={this.confirmChange} className="form-control" type="password" name="confirm" id="confirm" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
            </div>
        );
    }
}

