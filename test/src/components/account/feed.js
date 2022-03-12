import React, {Component} from 'react'
import Post from './layout/post'
import { displayPosts } from './helpers/post'

export default class Feed extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.userId,
            profilePicture: props.profilePicture,
            newPostContent: '',
            posts: [],
        }
    }

    componentDidMount() {
        // Get posts
        this.getFeed();
    }

    getFeed = async () => {
        let {userId} = this.state;
        let that = this;
        await fetch("http://localhost:9000/feed/getFeed?userId="+userId, {
            method: "GET",
        }).then(async res => {
            await res.json().then(posts => {
                that.setState({posts})
            });
        });
    }

    onChange = (e) => {
        // Handle change of new post text input
        this.setState({newPostContent: e.target.value})
    }

    createPost = async (parentId) => {
        let {userId, newPostContent} = this.state;
        let that = this;

        await fetch('http://localhost:9000/feed/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, content: newPostContent, parent: parentId 
            })
        }).then(async res => {
            await res.json().then(() => {
                this.setState({newPostContent: ''});
            });
        });
    }

    // openPost = () => {
    //     // Get all comments, magnify the opened post
    //     console.log("open")
    // }

    refreshFeed = () => {
        // Retrieve new posts
    }

    // displayPosts = () => {
    //     // Cycle through map of posts 
    //     let {posts} = this.state
    //     return posts.map((post, i) => {
    //         return (<Post 
    //                     numberLikes={post['numberLikes']} 
    //                     content={post['content']}
    //                     userName={post['userName']}
    //                     profilePicture={post['profilePicture']}
    //                     createdAt={post['createdAt']}
    //                     openPost={this.openPost.bind(this)}
    //                 />);
    //     });
    // }

    render() {
        let {profilePicture, newPostContent, posts} = this.state;

        return (
            <div style={feedContainer}>
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
                    <button onClick={() => this.createPost(null)} style={postButton}>Post</button>
                </div>
                <div style={postContainer}>
                    {displayPosts(posts, this)}
                </div>
            </div>
        );
    }
}

const feedContainer = {
    height: '100%',
    // margin: 10,
}

const postButton = {
    borderRadius: '30%',
    height: 40,
    width: 60,
    alignSelf: 'flex-end',
    marginTop: 5,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none'
}

const postContainer = {
    margin: '10px 0'
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
    margin: 10,
    
}

const userProfilePicture = {
    width: 50,
    height: 50,
    borderRadius: '50%',
    marginRight: 5
}