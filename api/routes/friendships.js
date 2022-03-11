const router = require('express').Router();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')

let Friendship = require('../models/friendship.model.js');
let Profile = require('../models/profile.model');

require('dotenv').config();

router.route('/').get( async (req, res) => {
    await Friendship.findOne({_id: "604fe9499e4ec0401ce5cc34"}, function(err, friendship) {
        if (!friendship) {
            res.status(404).json({error: "No friendship found"})
        } 
        else {
            res.status(200).json({friendship: friendship})
        }
    });
});

async function getProfilePicture(id) {
    let picture
    await fetch("http://localhost:9000/users/getUser?_id="+id).then(async (res) => {
        await res.json().then(data => {
            picture = data['profilePicture']
        })
    })

    return picture;
}

router.route('/add').post(async (req, res) => {
    let {sender_id, user_id, user_first, user_last, sender_first, sender_last} = req.body;
    // let {userPicture} = req.body

    // await getProfilePicture(added_id).then(async (addingPicture) => {
    //     if (addingPicture) {
            let newFriendship = new Friendship ({friendship: [
                {
                    id: sender_id,
                    firstName: sender_first,
                    lastName: sender_last,
                    // profilePicture: userPicture
                },
                {
                    id: user_id,
                    firstName: user_first,
                    lastName: user_last,
                    // profilePicture: addingPicture
                }
            
            ]})
            
            newFriendship.save().then(() => {
                res.status(200).json({msg: "Friend added!"});
            });
            
        // }

    // })
    



})

router.route('/remove').post(async (req, res) => {
    let {senderId, removedId} = req.query
    await Friendship.deleteMany( {friendship: {$all: [
        {$elemMatch: {"id": senderId}},
        {$elemMatch: {"id": removedId}}
    // ]}}
    // )
    // await Friendship.deleteOne({$and : {friendship:[
    //     {"id": senderId},
    //     {"id": removedId}
    ]}}, function(err) {
        if (err) {
            res.status(400).json({msg: err})
        }
        else {
            res.status(200).json({msg: "success"})
        }
    })
})


router.route('/exists').get(async (req, res) => {
    let {senderId, userId} = req.query
    await Friendship.findOne( {friendship: {$all: [
        {$elemMatch: {"id": senderId}},
        {$elemMatch: {"id": userId}}
    ]}}, 
    function(err, found) {
        if (found) {
            res.status(200).json({result: "found"})
        }
        else {
            res.status(404).json({result: "none"})
        }
    })


})

router.route('/getAll').get(async (req, res) => {
    let {id} = req.query;

    await Friendship.find({ friendship: {$elemMatch: {id: id}}}).then(function(friendships) {
        let queries = [];
        if (friendships.length > 0) {
            friendships.forEach((friendship) => {
                let obj = friendship['friendship']

                queries.push(
                    Profile.findOne({userId: obj[0]['id'] != id? obj[0]['id']: obj[1]['id']})
                );
            });
            return Promise.all(queries);
        } else {
            res.status(404).json([])
        }
        

    }).then(profiles => {
        let results = [];
        for (let i = 0; i < profiles.length; i++) {
            let profile = profiles[i];

            results.push({
                profilePicture: profile['profilePicture'],
                id: profile['userId'],
                firstName: profile['firstName'],
                lastName: profile['lastName'],
                bio: profile['bio']
            });
        }
        res.status(200).json(results);
    })
})

router.route('/update').post(async (req, res) => {
    let {id} = req.query
    let {firstName, lastName, profilePicture} = req.body



})

module.exports = router