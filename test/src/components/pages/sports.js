import React, {Component} from 'react';

import Header from '../layout/Header';
import Search from '../layout/search';

import {search, account} from '../layout/style';

export default class Sports extends Component {

    search = () => {

    }

    handleChange = (event) => {

    }

    handleSubmit = (event) => {

    }

    render() {

        // api += "AIzaSyCN0a7zQQhYb_Y1KFVg5cOYhHVWT_F6DVw$=&q=";
        // api += "&cx=018401184353727186560:nmzhublylkc&q=";

        let url = "http://www.espn.com/search/_/q/";

        return (
            <div style={account}>
            <Header title={"Sports"} />
            <div style={search}>
                <Search placeholder={"Search teams..."} url={url} />
            </div> 
            </div>
        );
    }
}