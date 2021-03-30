import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../cookie';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
// import Navbar from 'react-bootstrap/Navbar'


class Navbar extends React.Component {

    constructor(props) {
        super(props);

        let links = [
            <Link to="/" onClick={this.home}className="navbar-brand">Home</Link>,
            // <Link to="/weather" className="navbar-brand">Weather</Link>,
            // <Link to="/stocks" className="navbar-brand">Stocks</Link>,
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
                // <ProfileLink />
                // <NavDropdown title="Profile">
                //     <NavDropdown.Item>Something</NavDropdown.Item>
                // </NavDropdown>
            <Link to="/profile" className="navbar-brand">Profile</Link>
            );
            links.push(<Link onClick={this.logout} to="/" className="navbar-brand">Logout</Link>);
        } else {
            // links.push(<Link to="/login" className="navbar-brand">Login</Link>);
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
        let links = [
            // <Link to="/" className="navbar-brand">Welcome</Link>,
            // <Link to="/login" className="navbar-brand">Login</Link>
        ];
        this.setState({links});

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