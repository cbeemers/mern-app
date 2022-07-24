const router = require('express').Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

require('dotenv').config();

const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const getAllFriendshipProfiles = require('../helpers/friendships');
const Like = require('../models/like.model');

function sortPosts(posts) {
    posts.sort((a, b) => {
        let key1 = new Date(a['createdAt']);
        let key2 = new Date(b['createdAt']);

        if (key1 < key2) return 1;
        else if (key2 < key1) return -1;
        return 0;
    });

    return posts;
}

function createPost(user, post) {
    return {
            postId: post['_id'],
            userId: user['userId'],
            createdAt: post['createdAt'],
            profilePicture: user['profilePicture'],
            content: post['content'],
            numberLikes: post['numberLikes'],
            parent: post['parent'],
            userName: user['firstName'] + " " + user['lastName']
        }
}

router.route('/createPost').post((req, res) => {
    let {userId, content, parent} = req.body;

    const newPost = new Post({
        userId,
        content,
        parent
    });

    newPost.save().then(post => {
        res.status(200).json("New post added.");
    });

});

router.route('/getUserPosts').get(async (req, res) => {
    let {userId} = req.query;

    await Profile.findOne({userId}, async (err, user) => {
        if (err) {
            res.status(500).json(err);
        } else if (!user) {
            res.status(404).json("User not found")
        } else {
            await Post.find({userId, parent: null}, (err, posts) => {
                if (err) {
                    res.status(500).json(err);
                } else if (posts.length == 0) {
                    res.status(200).json([]);
                } else {
                    let results = [];
                    posts.forEach(post => {
                        results.push(createPost(user, post));
                    });
                    res.status(200).json(sortPosts(results));
                }
            });
        }
    });
})

router.route('/getFeed').get(async (req, res) => {
    let {userId} = req.query;
    let friends; 

    await getAllFriendshipProfiles(userId).then((friendships) => {
        if (friendships.length == 0) {
            res.status(404).json([]);
        } else {
            let queries = []
            friends = friendships
            friendships.forEach(friend => {
                queries.push(Post.find({userId: friend['id'], parent: null}));
            });
            return Promise.all(queries);
        }
    }).then(posts => {
        let results = [];
        if (posts.length == 0) {
            res.status(200).json([]);
        } else {
            for (let i = 0; i < posts.length; i++) {
                let userPosts = posts[i];
                let friend = friends[i];

                for (let j = 0; j < userPosts.length; j++) {
                    let post = userPosts[j];
                    
                    results.push({
                        postId: post['_id'],
                        userId: friend['id'],
                        createdAt: post['createdAt'],
                        profilePicture: friend['profilePicture'],
                        content: post['content'],
                        numberLikes: post['numberLikes'],
                        parent: post['parent'],
                        userName: friend['firstName'] + " " + friend['lastName']
                    });
                }
            }
            
            res.status(200).json(sortPosts(results));
        }
    });
});

router.route('/didUserLike').get(async (req, res) => {
    let {postId, userId} = req.query;

    await Like.findOne({postId, userId}, (err, like) => {
        if (like) {
            res.status(200).json(true);
        } else if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(false);
        }
    })
}); 

router.route('/likePost').post(async (req, res) => {
    let {postId, userId} = req.body;
    const newLike = new Like({postId, userId});

    await Post.updateOne({_id: postId}, {$inc: {numberLikes: 1}}).then(() => {
        newLike.save();
        res.status(200).json("Liked");
    });

});

router.route('/unlikePost').post(async (req, res) => {
    let {postId, userId} = req.body;

    await Post.updateOne({_id: postId}, {$inc: {numberLikes: -1}}).then(async () => {
        await Like.deleteOne({postId, userId}).then(() => {
            res.status(200).json("Disliked")
        })
    })
});

router.route('/getComments').get(async (req, res) => {
    let {postId} = req.query;
    let posts = [];
    let queries = [];

    await Post.find({parent: postId}).then(async (comments) => {
        if (comments.length == 0) {
            res.status(200).json([]);
        } else {
            posts = comments;
            comments.forEach((comment) => {
                queries.push(Profile.findOne({userId: comment['userId']}));
            });
            return Promise.all(queries);
        }
    }).then(users => {
        let results = [];
        console.log(users)
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let post = posts[i];
            results.push(createPost(user, post));
        }

        res.status(200).json(sortPosts(results));
    })

});

router.route('/getUserLikes').get(async (req, res) => {
    let {userId} = req.query;
    let allPosts = [];

    await Like.find({userId}).sort({createdAt: -1}).limit(100).then(likes => {
        if (likes.length == 0) {
            res.status(200).json([]);
        } else {
            let queries = [];
            console.log(likes)
            likes.forEach(like => {
                queries.push(Post.findOne({_id: like['postId']}))
            })
            return Promise.all(queries);
        }
    }).then(posts => {
        let queries = [];
        allPosts = posts;
        console.log(posts);

        posts.forEach(post => {
            queries.push(Profile.findOne({userId: post['userId']}));
        })
        return Promise.all(queries);

    }).then(profiles => {
        let results = [];
        console.log(profiles)
        for (let i = 0; i < profiles.length; i++) {
            let profile = profiles[i];
            let post = allPosts[i];

            results.push(createPost(profile, post));
        }

        res.status(200).json(results);
    });
});

module.exports = router;