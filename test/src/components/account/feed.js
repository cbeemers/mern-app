import React, {Component} from 'react'
import Post from './layout/post'
import PostInput from './layout/postInput'
import Stack from '../stack'
import { displayPosts, createPost, getComments } from './helpers/functions'

export default class Feed extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.userId,
            profilePicture: props.profilePicture,
            // newPostContent: '',
            posts: displayPosts(props.posts, props.userId, this),
            stack: new Stack(null), 
            parentPost: null, 
            parentPostId: null
        }
    }

    componentDidMount() {
        // Get posts
        let { userId } = this.state;
        let that = this;
        
        // getFeed(userId).then(posts => {
        //     that.setState({posts: displayPosts(posts, userId, that), stack: new Stack(null)})
        // });
    }

    createPost = async (newPostContent) => {
        let { userId, parentPostId } = this.state;
        await createPost(userId, newPostContent, parentPostId);
    }

    openPost = async (post) => {
        // Get all comments, magnify the opened post
        let {stack, userId} = this.state;
        let that = this;

        await getComments(post['postId']).then((comments) => {
            let parent = <Post openPost={that.openPost.bind(that)} openProfile={that.openProfile.bind(that)} state={post} />

            stack.enqueue(post['postId'])
            
            that.setState({posts: [], parentPost: null})
            that.setState({
                parentPost: parent, 
                parentPostId: post['postId'], 
                stack, 
                posts: displayPosts(comments, userId, that)
            });
        })
        
        
    }

    openProfile = (e) => {
        e.stopPropagation();
        console.log("profile");
    }

    refreshFeed = () => {
        // Retrieve new posts
    }

    render() {
        let {profilePicture, posts, userId, stack, parentPost, parentPostId} = this.state;
        let index = stack.currIndex();
        console.log(index)
        
        return (
            <div style={feedContainer}>
                {parentPost}
                <PostInput profilePicture={profilePicture} createPost={this.createPost.bind(this)} parentId={parentPostId} />
                <div style={postContainer}>
                    {posts}
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