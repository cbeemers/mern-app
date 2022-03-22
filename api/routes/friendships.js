const router = require('express').Router();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let getAllFriendshipProfiles = require('../helpers/friendships');

const Friendship = require('../models/friendship.model');
const Profile = require('../models/profile.model');

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
            res.status(200).json(true)
        }
        else {
            res.status(404).json(false)
        }
    })


});

router.route('/getAll').get(async (req, res) => {
    let {id} = req.query;

    await getAllFriendshipProfiles(id).then(results => {
        res.status(200).json(results)
    });
});


module.exports = router