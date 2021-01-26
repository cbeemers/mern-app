import React, {Component, StrictMode} from 'react';
import axios from 'axios';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            placeholder: props.placeholder,
            api: props.api,
            query: '',
            url: props.url,
            type: props.type
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <input id="search" type="text" placeholder={this.state.placeholder} onChange={this.props.handleChange} /><button type="submit">Search</button>
            </form>
        );
    }
}