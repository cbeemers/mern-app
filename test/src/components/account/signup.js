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
        const {password, confirm, message, firstName, lastName} = this.state;

        if (password == confirm) {
            if (firstName.length > 0 && lastName.length > 0 && password.length >= 6) {
                fetch('http://localhost:9000/users/add', {
                    method: 'POST', 
                    body: JSON.stringify(this.state),
                    headers: {
                        'Content-Type': 'application/json'
                    }

                }).then(res => {
                    if (res.status == 200) {
                        window.location.reload(true);
                    } else if (res.status === 401) {
                        console.log(res)
                        this.setState({
                            message: "Email already in use!"
                        });
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

