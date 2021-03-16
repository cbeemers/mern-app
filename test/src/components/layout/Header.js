import React from 'react';
import Navbar from './navbar';

class Header extends React.Component {
    state = {
      title: ""
    };

    render() {
      const title = this.props.title;
      return (
        <header style={head}>
          <h1 style={{paddingTop: "1em"}}>{title}</h1>
        </header>
      );
    }

}

const head = {
  textAlign: "center",
  minHeight: "15em",
  color: "white",
  paddingBottom: "1em",
  backgroundColor: "#0e0650"

}

export default Header;