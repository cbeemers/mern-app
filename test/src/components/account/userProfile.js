import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {getCookie, checkToken} from '../cookie';

import Header from '../layout/Header';
import {account, profileContent} from '../layout/style';
import { getProfile, getUserPosts, editBio, updateProfilePicture, getAllUserLikes, getAllFriendships } from './helpers/functions';
import Settings from './layout/settings';
import Feed from './feed';
import FriendsController from '../controllers/friends-controller';

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
            _id: "",
            profilePicture: "",
            bio: "",
            editing: false,
            display: null,
            firstName: "",
            lastName: "",
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
            checkToken(token).then(async userId => {
                console.log(userId)
                await this.getProfile(userId);
                await this.getPosts(userId);
            });
            
            
        }
    }

    getProfile = async (userId) => {
        let that = this;

        await getProfile(userId).then(profile => {
            that.setState({
                firstName: profile['firstName'],
                lastName: profile['lastName'], 
                profilePicture: profile['profilePicture'], 
                joined: profile['createdAt'],
                stocks: profile['stocks'],
                cities: profile['locations'],
                bio: profile['bio'],
                _id: userId,
                // display: <Settings stocks={profile['stocks']} cities={profile['locations']} />
            });
        });
    }

    getPosts = async (userId) => {
        let {profilePicture} = this.state;
        let that = this;

        await getUserPosts(userId).then(async posts => {
            console.log(posts)
            await that.setState({display: null})
            await that.setState({display: <Feed userId={userId} posts={posts} profilePicture={profilePicture} />})
        });
    }

    getUserLikes = async () => {
        let {_id, profilePicture} = this.state;
        let that = this;

        await getAllUserLikes(_id).then(data => {
            that.setState({display: null});
            that.setState({display: <Feed userId={_id} posts={data} profilePicture={profilePicture} displayInput={false} />})
        });
    } 

    getFriends = async () => {
        let {_id, lastName, firstName} = this.state;
        let that = this;

        await getAllFriendships(_id).then(friends => {
            that.setState({display: null});
            that.setState({display: <FriendsController userId={_id} lastName={lastName} firstName={firstName} friends={friends} />})
        })
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

            await updateProfilePicture(fileData, _id).then(data => {
                console.log(data)
                that.setState({profilePicture: data['picture']})
            });
        }
    }

    displaySettings = async () => {
        let {stocks, cities} = this.state;
        this.setState({display: null})
        this.setState({display: <Settings stocks={stocks} cities={cities} />})
    }

    // displayPosts = async () => {
    //     let {posts, userId, } = this.state;
    // }

    updateBio = async() => {
        let { bio, _id } = this.state;
        let that = this;

        editBio(bio, _id).then(b => {
            that.setState({editing: false})
        });
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
        let {_id, joined, displayS, display, firstName, lastName, bio, fileSelector, profilePicture} = this.state;
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
                    <div className="main-content" style={{padding: "0 0 2em 0", backgroundColor:"white", border: "1em black", borderStyle: "solid", color:"black"}}>
                        <div style={mainNav}>
                            <div style={mainLinks}>
                                <h4
                                    style={navLink}
                                    onMouseEnter={this.blur}
                                    onMouseLeave={this.removeBlur}
                                    onClick={() => this.getPosts(_id)}
                                >
                                    Posts
                                </h4>
                                <h4
                                    style={navLink}
                                    onMouseEnter={this.blur}
                                    onMouseLeave={this.removeBlur}
                                    onClick={() => this.getUserLikes()}
                                >
                                    Likes
                                </h4>
                                <h4
                                    style={navLink}
                                    onMouseEnter={this.blur}
                                    onMouseLeave={this.removeBlur}
                                    onClick={() => this.getFriends()}
                                >
                                    Friends
                                </h4>
                            </div>
                            <h4 
                                style={navLink}
                                onMouseEnter={this.blur}
                                onMouseLeave={this.removeBlur}
                                onClick={() => this.displaySettings()}
                            >
                                Settings
                            </h4>
                        </div>
                    {/* <div className="over"><Link to="/profile/friends" className="friends-link"><h1 style={link}>Friends</h1></Link></div> */}
                        {display}

                    </div>
                </div>
            </div>
        );
    }
}

const bioButton = {
    alignSelf: 'flex-end',
    margin: '0',
    maxHeight: '2em',
    maxWidth: '2em',
    boxShadow: '0em 0em .25em .015em #2E4053',
    display: 'flex',
    flexDirection: 'row'
}

const bioChangeButtons = {
    backgroundColor: '#007bff',
    borderRadius: '20%',
    border: 'none',
    margin: '1em'
}

const bioContainer = {
    display: 'flex',
    flexDirection: 'column',
    margin: '0',
    maxWidth: '15em',
    width: '100%'
}

const displayed = {
    padding: ".5em", 
    borderBottom: ".1em black", 
    borderBottomStyle:"solid", 
    color: "black"
}

const link = {
    color: "black",
    borderBottom: ".5em black",
    borderBottomStyle: "solid",
    borderTop: ".5em black",
    borderTopStyle: "solid",
    padding: "1em 0"

}

const mainLinks = {
    display: 'flex',
    flexDirection: 'row',
    width: '33%', 
    justifyContent: 'space-between'
}

const mainNav = {
    padding: 10,
    backgroundColor: '#192635',
    width: '100%',
    height: 70,
    borderBottom: '1em solid black',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    margin: 0,
    justifyContent: 'space-between'
}

const navLink = {
    textAlign: 'center',
    margin: 0
}

const profilePictureStyle = {
    boxShadow: "0em 1em 1em 1em black"
} 
