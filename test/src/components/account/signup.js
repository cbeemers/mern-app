import React from 'react';
import Header from '../layout/Header';

import {form_style, label, border, account} from '../layout/style';
import { createAccount, authenticate } from './helpers/functions';


export default class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            email: "",
            password: "",
            confirm: "",
            firstName: "",
            lastName: "",
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

    firstChange = (event) => {
        this.setState({
            firstName: event.target.value,
        });
    }

    lastChange = (event) => {
        this.setState({
            lastName: event.target.value,
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {email, password, confirm, message, firstName, lastName} = this.state;
        let that = this;

        if (password == confirm) {
            if (firstName.length > 0 && lastName.length > 0 && password.length >= 6) {
                createAccount(JSON.stringify(this.state)).then(async response => {
                    if (response['serverError']) {
                        that.setState({message: "Internal server error."});
                    } else if (response["message"]) {
                        that.setState({
                            message: "Email already in use!"
                        });
                    } else {
                        await authenticate(email, password);
                    }
                });
            }
            else if (password.length < 6) {
                this.setState({
                    message: "Password must me 6 characters or more."
                })
            }

            else {
                this.setState({
                    message: "Name is required."
                })
            }
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
                <label style={label} htmlFor="firstName">First Name:</label>
                <input className="form-control" name="firstName" id="firstName" onChange={this.firstChange}></input>
                <lable style={label} htmlFor="lastName" id="lastName">Last Name:</lable>
                <input className="form-control" name="lastName" onChange={this.lastChange}></input>
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

