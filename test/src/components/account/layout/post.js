import React, {Component} from 'react'


export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: props.content,
            userId: props.userId,
            postId: props.postId,
            numberLikes: props.numberLikes,
            createdAt: props.createdAt,
            parentId: props.parent,
            userProfilePicture: props.profilePicture,
            userName: props.userName, 
        }

        this.openPost = props.openPost;
    }

    componentDidMount() {
        // Get all comments
        const {postId} = this.state;
    }

    likePost = () => {
        console.log("like")
    }

    comment = () => {
        console.log("comment")
    }

    render() {
        let {userProfilePicture, content, userName, numberLikes, createdAt} = this.state;
        let date = new Date(createdAt)
        
        let joined = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear()
        
        return (
            <div style={container}>
                {/* entire post */}

                <div style={row} >
                    {/* profile picture  */}
                    <div style={timestamp}>
                        {joined}
                    </div>
                    <img onClick={this.openPost} src={userProfilePicture} style={profilePictureStyle} />

                    <div style={Object.assign({}, column, postContent)}>
                        {/* post content, username */}
                        <h3>{userName}</h3>
                        <p>{content}</p>

                    </div>
                </div>

                <div style={Object.assign({}, row, buttons)}>
                    {/* like/comment */}        
                    <div onClick={this.likePost}><img style={likeButton} src={'./img/empty-thumbs-up.png'} /></div><div style={Object.assign({}, likeButton, likeCount)}>{numberLikes}</div>
                    <div onClick={this.comment}><img style={commentButton} src={'./img/comment.png'} /></div>
                </div>

            </div>
        )
    }
}

const border = '1px solid grey'

const buttons = {
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    margin: 'auto',
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
    borderTop: border,
    borderBottom: border,
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
    alignSelf: 'center',
    textAlign: 'center',
    // top: '50%', 
    // transform: 'translateY(-50%)',
}

const postContent = {
    width: '100%',
    height: '100%'
}

const profilePictureStyle = {
    maxHeight: 150,
    maxWidth: 150,
    marginRight: 10,
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

