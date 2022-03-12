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
            bio: "",
            editing: false,
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
                this.getProfile(userId);
                this.getPosts(userId);
            });       
        }
    }

    getProfile = (userId) => {
        let that = this;

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
                    bio: data['bio'],
                    _id: userId,
                });
            });
        });
    }

    getPosts = (userId) => {
        let that = this;
        fetch('http://localhost:9000/feed/getUserPosts?userId='+userId, {
            method: 'GET'
        }).then(async res => {
            await res.json().then(posts => {
                console.log(posts)
            });
        });
    }

    editBio = (e) => {
        this.setState({bio:e.target.value})
    }

    blur = (e) => {
        e.target.style.opacity = '.5';
    }

    removeBlur = (e) => {
        e.target.style.opacity = '1';
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

    createDisplay = (type) => {
        let display = this.state[type].map((object, index) => {
            return (
            <div style={displayed}><h3 >{object}</h3></div>
            )
        });
        return display
    }

    updateBio = async() => {
        let { bio, _id } = this.state;
        let that = this;

        await fetch("http://localhost:9000/profiles/updateBio", {
            method: 'POST',
            body: JSON.stringify({
                bio, 
                userId: _id
            }), 
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status == 200) {
                res.json().then(b => {
                    console.log(b);
                    that.setState({editing: false})
                });
            } 
        });
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

    displayBio = () => {
        let {editing, bio} = this.state;

        if (editing) {
            return (
                <div style={bioContainer}>
                    <textarea 
                        value={bio}
                        type="text" 
                        maxLength={140}
                        style={{minHeight: '7em', backgroundColor: '#192635', color: 'white', resize: 'none'}}
                        onChange={(event) => this.editBio(event)} 
                    />
                    <div style={{alignSelf: 'flex-end'}}>{bio.length}/140</div>
                    <div style={bioButton, {alignContent: 'flex-end'}} >
                        <button 
                            style={bioChangeButtons} 
                            onClick={()=> this.setState({editing: false})}
                        >
                            Cancel
                        </button>
                        <button 
                            style={bioChangeButtons}
                            onClick={() => this.updateBio()}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            );

        } else {
            return (
                <div style={bioContainer}>
                    <p style={{padding: "1em", margin: '0'}}>{bio==""? "Insert bio here.": bio}</p>
                    <img 
                        onClick={() => this.setState({editing: true})} 
                        src={'./img/edit.png'} 
                        style={bioButton}  
                        onMouseEnter={(this.blur)}
                        onMouseLeave={(this.removeBlur)}
                    />
                </div>
            );
        }
    }


    render() {
        let {user, joined, displayS, displayC, firstName, lastName, bio, fileSelector, profilePicture} = this.state;
        let date = new Date(joined)
        
        joined = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear()


        return (
            <div style={account}>           
                <div className="main" style={{minHeight: "100vh"}}>
                <aside className="aside1" style={{borderTop: "1em solid black", borderBottom: "1em solid black", maxWidth: "25em", justifyContent: 'center'}}>
                    <div style={{textAlign: "center", marginTop: "4em", justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div 
                            onClick={this.changePicture}
                            onMouseEnter={this.blur}
                            onMouseLeave={this.removeBlur}
                        >
                            <p style={{margin: "0"}}>
                                <img style={profilePictureStyle} className="profile-picture" src={profilePicture} />
                            </p>
                        </div>
                        <br></br>
                        <h2 style={{margin: '1em 0'}}>{firstName} {lastName}</h2>
                        <div>
                            {this.displayBio()}
                        </div>
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

let profilePictureStyle = {
    boxShadow: "0em 1em 1em 1em black"
} 

let bioButton = {
    alignSelf: 'flex-end',
    margin: '0',
    maxHeight: '2em',
    maxWidth: '2em',
    boxShadow: '0em 0em .25em .015em #2E4053',
    display: 'flex',
    flexDirection: 'row'
}

let bioChangeButtons = {
    backgroundColor: '#007bff',
    borderRadius: '20%',
    border: 'none',
    margin: '1em'
}

let bioContainer = {
    display: 'flex',
    flexDirection: 'column',
    margin: '0',
    maxWidth: '15em',
    // alignItems: 'center',
    width: '100%'
}

let content = {
    display: "flex",
    borderBottom: ".25em black", 
    borderBottomStyle: "solid", 
    justifyContent: "space-between",
    padding: "1em", 
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

let displayed = {
    padding: ".5em", 
    borderBottom: ".1em black", 
    borderBottomStyle:"solid", 
    color: "black"
}
