import React, {Component} from 'react';

export default class Footer extends Component {
    render() {
        return (
            <footer style={footer}>
                <h3>Contact me</h3>
            </footer>
        );
    }
}

const footer = {
    // height: "15vh",
    padding: "20px 0",
    width: "100%",
    color: "white",
    textAlign: "center",
    // bottom: "0",
    backgroundColor: "#0e0650",
}