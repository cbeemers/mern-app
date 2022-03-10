import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {getCookie, checkToken} from '../cookie';

import Header from '../layout/Header';
import {account, profileContent} from '../layout/style';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: "", 
            name: "",
            stocks: [],
            cities: [],
            friends:[],
            joined: "",
            displayS: [],
            displayC: [],
            stockDisplay: false,
            cityDisplay: false,
            fileSelector: document.createElement('input'),
            token: getCookie('token'),
            _id: "",
            profilePicture: "",
        }
    }

    componentDidMount() {

        let {fileSelector} = this.state
        fileSelector.setAttribute('id', 'fileInput')
        fileSelector.setAttribute('name', "profile") 
        fileSelector.setAttribute('type', 'file')
        fileSelector.setAttribute('multiple', 'multiple')
        fileSelector.setAttribute('accept', ['.jpg', '.png', '.jpeg'])

        let token = getCookie('token')

        if (token !== "") {
            let that = this;
            checkToken(token).then(userId => {
                console.log(userId)
                fetch("http://localhost:9000/profiles/getProfile?userId="+userId, {
                    method: "GET",
                    "Content-Type": "application/json",
                }).then(res => {
                    res.json().then(data => {
                        console.log(data)
                        that.setState({
                            firstName: data['firstName'],
                            lastName: data['lastName'], 
                            profilePicture: data['profilePicture'], 
                            joined: data['createdAt'],
                            stocks: data['stocks'],
                            cities: data['locations'],
                            _id: userId,
                        })
                    })
                })
            });       
        }
    }

    createDisplay = (type) => {
        let display = this.state[type].map((object, index) => {
            return (
            <div style={displayed}><h3 >{object}</h3></div>
            )
        });
        return display

    }

    display = (event) => {
        let display = []
        let id = event.target.getAttribute('id')

        if (id == "stock") {
            if (!this.state.stockDisplay) {
                display = this.createDisplay("stocks")
            }
            this.setState({stockDisplay: !this.state.stockDisplay, displayS: display})
        }
        else if (id == "city") {
            if (!this.state.cityDisplay) {
                display = this.createDisplay("cities")
            }
            this.setState({cityDisplay: !this.state.cityDisplay, displayC: display})
        }
    }

    changePicture = async (event) => {
        let {fileSelector, _id} = this.state
        event.preventDefault()

        fileSelector.click()

        let that = this
        
        fileSelector.onchange = async function () {
            let fileObject = this.files[0]
            console.log(_id)
            
            let fileData = new FormData();
            
            fileData.append('title', _id);
            fileData.append('image', fileObject, fileObject.name);
            fileData.enctype = "multipart/form-data"

            await fetch('http://localhost:9000/profiles/updateProfilePicture?userId=' + _id, {
                method: "POST",
                body: fileData
            }).then((res) => {
                
                res.json().then(data => {
                    that.setState({profilePicture: data['picture']})
                })
            })
        }
    }


    render() {
        let {user, joined, displayS, displayC, firstName, lastName, fileSelector, profilePicture} = this.state;
        let date = new Date(joined)
        
        joined = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear()


        return (
            <div style={account}>           
                <div className="main" style={{minHeight: "100vh"}}>
                <aside className="aside1" style={{borderTop: "1em solid black", borderBottom: "1em solid black", maxWidth: "25em"}}>
                    <div style={{textAlign: "center", marginTop: "4em"}}>
                        <div onClick={this.changePicture}><p style={{margin: "0"}}><img style={{boxShadow: "0em 1em 1em 1em black"}} className="profile-picture" src={profilePicture} /></p></div>
                        <br></br>
                        <h2>{firstName} {lastName}</h2>
                        <p style={{padding: "1em"}}>allow for a bio to be displayed when another user clicks on their profile.</p>
                    </div>
                    <div style={{textAlign: "center", marginTop: "2em"}}>Date Joined: {joined}</div>

                </aside>
                <div className="main-content" style={{padding: "2em 0", backgroundColor:"white", border: "1em black", borderStyle: "solid", color:"black"}}>

                {/* <div className="over"><Link to="/profile/friends" className="friends-link"><h1 style={link}>Friends</h1></Link></div> */}

                    <div id="stock" onClick={this.display} style={content}>
                        <h1 style={{padding: ".2em 0", float:"left"}}>Stocks</h1>
                        <button style={drop} id="stock" onClick={this.display}></button>
                    </div>
                    {displayS}

                    <div id="city" onClick={this.display} style={content}>
                        <h1 style={{padding: ".2em 0", float:"left"}}>Cities</h1>
                        <button style={drop} id="city" onClick={this.display}></button>
                    </div>
                    {displayC}

                    <div style={content}><h1>Change Password</h1></div>
                    

                </div>
                    
                </div>

            </div>
            
        );
    }
}


let link = {
    color: "black",
    borderBottom: ".5em black",
    borderBottomStyle: "solid",
    borderTop: ".5em black",
    borderTopStyle: "solid",
    padding: "1em 0"

}

let content = {
    display: "flex",
    borderBottom: ".25em black", 
    borderBottomStyle: "solid", 
    justifyContent: "space-between",
    padding: "1em", 
    
    // color: "red", 
    // padding: "1em"
}

let drop = {
    width: "4em",
    float:"right", 
    height: "2em", 
    marginTop:"auto", 
    borderRadius: "1em",
    marginBottom: "auto", 
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundImage: "url('./img/arrow.png')",
}
// let dropStyle = {
//     "stock"
// }

let displayed = {
    padding: ".5em", 
    borderBottom: ".1em black", 
    borderBottomStyle:"solid", 
    color: "black"
}

// let cityDisplay = JSON.parse(JSON.stringify(displayed))
// cityDisplay