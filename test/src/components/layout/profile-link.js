import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

export default class ProfileLink extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            display: false
        }
    }

    

    render() {
        return (
            <Link 
            onMouseEnter={ () => {this.setState({display: <ProfileLink />})} }
            onMouseLeave={() => {this.setState({display: null})}}
            to="/profile" className="navbar-brand">Profile</Link>

        )
    }
}

// export default ProfileLink;