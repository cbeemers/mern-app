import React, {Component} from 'react'

import { likePost, dislikePost, didUserLike } from '../helpers/functions';

export default class Post extends Component {
    constructor(props) {
        super(props);

        let obj = props.state? props.state: props;


        this.state = {
            content: obj.content,
            userId: obj.userId,
            postId: obj.postId,
            numberLikes: obj.numberLikes,
            createdAt: obj.createdAt,
            parentId: obj.parent,
            profilePicture: obj.profilePicture,
            userName: obj.userName, 
            currUserId: obj.currUserId, 
            liked: props.liked? props.liked: false,
        }
        this.openPost = props.openPost;
        this.openProfile = props.openProfile;
    }

    componentDidMount() {
        // Get all comments
        const {postId, currUserId} = this.state;
        let that = this;
        
        didUserLike(postId, currUserId).then((isLiked) => {
            that.setState({liked: isLiked});
        });
    }

    likeController = async () => {
        let {liked} = this.state;
        if (!liked) this.likePost();
        else this.dislikePost();
    }

    dislikePost = async () => {
        let {postId, currUserId, numberLikes} = this.state;
        let that = this;

        dislikePost(postId, currUserId).then((data) => {
            that.setState({liked: false, numberLikes: numberLikes - 1})
        });
    }

    likePost = async () => {
        let {currUserId, postId, numberLikes} = this.state;
        let that = this;

        await likePost(postId, currUserId).then(data => {
            that.setState({liked: true, numberLikes: numberLikes+1})
        });
    }

    render() {
        let {profilePicture, content, userName, numberLikes, createdAt, liked} = this.state;
        let date = new Date(createdAt)
        
        let joined = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear()
        
        return (
            <div style={container}>
                {/* entire post */}

                <div style={Object.assign({}, postObject, row)} onClick={() => this.openPost(this.state)}> 
                    {/* profile picture  */}
                    <div style={timestamp}>
                        {joined}
                    </div>
                    <img onClick={async (e) => await this.openProfile(e)} src={profilePicture} style={profilePictureStyle} />
                    <div style={Object.assign({}, column, postContent)}>
                        {/* post content, username */}
                        <h3>{userName}</h3>
                        <p style={{width: 300 }}>{content}</p>

                    </div>
                </div>

                <div style={Object.assign({}, row, buttons)}>
                    {/* like/comment */}        
                    <div onClick={this.likeController}>
                        <img style={likeButton} src={liked? filledImage: likeImage} />
                    </div>
                    <div style={Object.assign({}, likeButton, likeCount)}>{numberLikes}</div>
                    
                    
                    <div onClick={this.comment}><img style={commentButton} src={'./img/comment.png'} /></div>
                </div>

            </div>
        )
    }
}

const likeImage = './img/empty-thumbs-up.png';
const filledImage = './img/thumbs-up-fill.png';

const buttons = {
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    margin: 'auto',
    marginTop: 5,
    left: 0, 
    right: 0,
}

const column = {
    display: 'flex',
    flexDirection: 'column'
}

const commentButton = {
    height: 30,
    width: 30,
    marginLeft: 20
}

const container = {
    width: '100%',
    minHeight: '2em',
    borderBottom: '1px solid grey',
    color: 'black',
    padding: 10,
    display: 'flex',
    position: 'relative'
}

const likeButton = {
    height: 30,
    width: 30,
    marginRight: 2,
}

const likeCount = {
    // alignSelf: 'center',
    textAlign: 'center',
    // top: '50%', 
    // transform: 'translateY(-50%)',
    height: 30

}

const postContent = {
    maxWidth: 350,
    height: '100%',
    margin: 10
}

const postObject = {
    margin: 'auto', 
    marginBottom: 5,
    maxWidth: 600,
    minWidth: 400
}

const profilePictureStyle = {
    height: 125,
    width: 125,
    // minHeight: 100,
    // minWidth: 100,
    marginRight: 20,
    borderRadius: '50%'
}

const row = {
    display: 'flex',
    flexDirection: 'row'
}

const timestamp = {
    position: 'absolute',
    right: 4
}

