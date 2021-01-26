import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../cookie';

class Navbar extends React.Component {

    constructor(props) {
        super(props);

        let links = [
            <Link to="/" className="navbar-brand">Welcome</Link>,
            <Link to="/weather" className="navbar-brand">Weather</Link>,
            <Link to="/stocks" className="navbar-brand">Stocks</Link>,
        ];

        if (getCookie('token')) {
            links.push(<Link to="/profile" className="navbar-brand">Profile</Link>);
            links.push(<Link onClick={this.logout} to="/" className="navbar-brand">Logout</Link>);
        } else {
            links.push(<Link to="/login" className="navbar-brand">Login</Link>);
        }

        this.state = {
            links: links
        }
    }

    renderLinks = () => {
        return this.state.links.map((link, index) => {
            return (
                link
            );
        });
    }

    logout = () => {
        document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        let links = [
            <Link to="/" className="navbar-brand">Welcome</Link>,
            <Link to="/weather" className="navbar-brand">Weather</Link>,
            <Link to="/stocks" className="navbar-brand">Stocks</Link>,
            <Link to="/login" className="navbar-brand">Login</Link>
        ];
        this.setState({links});

        if(window.location.pathname == '/') {
            window.location.reload(false);
        }
    }

    render() {
        return (
            <nav className="navbar navbar-dark navbar-expand-lg" style={color}>
                {this.renderLinks()}
            </nav>
        );
    }
}

const color = {
    backgroundColor: "#0e0650",
}

export default Navbar;