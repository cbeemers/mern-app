import React, { Component } from 'react'

export default class PostInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            profilePicture: props.profilePicture,
            parentId: props.parentId,
            newPostContent: ''
        }
        console.log(props.parentId)
        this.createPost = props.createPost;
    }

    onChange = (e) => {
        // Handle change of new post text input
        this.setState({newPostContent: e.target.value})
    }

    render() {
        let {profilePicture, newPostContent, parentId} = this.state;

        return (
            <div style={postObjectContainer}>
                    <div style={postInputContainer}>
                        <img style={userProfilePicture} src={profilePicture} />
                        <textarea 
                            value={newPostContent}
                            style={postInput}
                            maxLength={140}
                            placeholder='New post...'
                            onChange={(e) => this.onChange(e)}
                        />
                    </div> 
                    <div style={postController}>
                        <p style={{margin: 0}}> {newPostContent.length}/140</p>
                        <button onClick={() => {this.createPost(newPostContent, parentId); this.setState({newPostContent: ''})}} style={postButton}>Post</button>    
                    </div> 
                </div>
        );
    }
}

const postButton = {
    borderRadius: '30%',
    height: 40,
    width: 60,
    marginLeft: 5,
    marginTop: 5,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none'
}

const postController = {
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    color: 'black',
    alignItems: 'center'
}

const postInput = {
    width: '100%',
    padding: 10,
    borderRadius: '2%',
    resize: 'none'
}

const postInputContainer = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const postObjectContainer = {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid grey',
    padding: 5,
    marginTop: 10,
}

const userProfilePicture = {
    width: 50,
    height: 50,
    borderRadius: '50%',
    marginRight: 5
}