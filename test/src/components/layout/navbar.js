import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../cookie';

class Navbar extends React.Component {

    constructor(props) {
        super(props);

        let links = [
            <Link to="/" onClick={this.home}className="navbar-brand">Home</Link>,
        ];

        this.state = {
            links: links,
            display: null,
        }
    }

    componentDidMount() {
        let {links} = this.state
        if (getCookie('token')) {
            links.push( 
                <Link to="/profile" className="navbar-brand">Profile</Link>
            );
            links.push(<Link onClick={this.logout} to="/" className="navbar-brand">Logout</Link>);
        } 
        this.setState({links: links})
    }

    home = () => {
        if (window.location.pathname == "/") {
            window.location.reload(true)
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
        this.setState({links: []});

        if(window.location.pathname == '/') {
            window.location.reload(true);
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
    // backgroundColor: "#0e0650",
    backgroundColor: "#192635",
    borderBottom: ".1em solid #A7C7E7"
    // textAlign: "center"
}

export default Navbar;