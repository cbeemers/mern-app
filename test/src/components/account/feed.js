import React, {Component} from 'react'
import Post from './layout/post'
import PostInput from './layout/postInput'
import Stack from '../stack'
import { displayPosts, createPost, getComments } from './helpers/functions'

export default class Feed extends Component {
    constructor(props) {
        super(props)

        let posts = displayPosts(props.posts, props.userId, this)

        this.state = {
            userId: props.userId, 
            profilePicture: props.profilePicture,
            posts: posts,
            stack: new Stack({
                parentPost: null, 
                posts: posts,
                parentPostId: null,
            }), 
            parentPost: null, 
            parentPostId: null,
            displayInput: typeof props.displayInput !== 'undefined'? props.displayInput: true
        }
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
            that.setState({posts: [], parentPost: null})
            
            stack.enqueue({parentPost: parent, posts: displayPosts(comments, userId, that), parentPostId: post['postId']})

            that.setState({
                parentPost: parent, 
                parentPostId: post['postId'], 
                stack:stack, 
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

    backPage = async () => {
        let {stack} = this.state;
        let content = stack.dequeue();
        
        await this.setState({posts: null, parentPost: null});
        await this.setState({parentPost: content['parentPost'], posts: content['posts'], parentPostId: content['parentPostId']})
    }

    displayStack = () => {
        let {stack} = this.state;

        if (stack.currIndex() > 0) {
            return (
                <div style={backButtonContainer}>
                    <img onClick={async () => await this.backPage()} style={backButton} src={'./img/backArrow.png'} />
                </div>
            );
        }
        return null;
    }

    render() {
        let {profilePicture, posts, userId, stack, parentPost, parentPostId, displayInput} = this.state;
        
        return (
            <div style={feedContainer}>
                {this.displayStack()}
                {parentPost}
                {displayInput? <PostInput profilePicture={profilePicture} createPost={this.createPost.bind(this)} parentId={parentPostId} /> : null}
                <div style={postContainer}>
                    {posts}
                </div>
            </div>
        );
    }
}

const backButton = {
    width: 30,
    height: 30
}

const backButtonContainer = {
    width: '100%',
    height: 50,
    padding: 10
}

const feedContainer = {
    height: '100%',
}

const postContainer = {
    margin: '10px 0'
}