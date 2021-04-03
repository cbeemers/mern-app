import React, {Component} from 'react'
import Header from '../../layout/Header'


export default class MessageDisplay extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            token: props.token
        }
    }

    render() {
        return (
            <Header title="Messages" />
        )
    }
}