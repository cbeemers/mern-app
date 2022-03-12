const router = require('express').Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

require('dotenv').config();

const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const getAllFriendshipProfiles = require('../helpers/friendships');

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
                console.log(user)
                if (err) {
                    res.status(500).json(err);
                } else if (posts.length == 0) {
                    res.status(200).json([]);
                } else {
                    let results = [];
                    posts.forEach(post => {
                        post['profilePicture'] = user['profilePicture'];
                        post['userName'] = user['firstName'] + " " + user['lastName']
                        results.push({
                            postId: post['_id'],
                            userId: user['_id'],
                            createdAt: post['createdAt'],
                            profilePicture: user['profilePicture'],
                            content: post['content'],
                            numberLikes: post['numberLikes'],
                            parent: post['parent'],
                            userName: user['firstName'] + " " + user['lastName']
                        });
                    });

                    console.log(posts)
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

router.route('/likePost').post((req, res) => {
    let {postId} = req.body;

});

router.route('unlikePost').post((req, res) => {
    let {postId} = req.body;

});

router.route('/getComments').get((req, res) => {
    let {postId} = req.query;


});

router.route('/addComment').post((req, res) => {
    // May not need
});

module.exports = router;