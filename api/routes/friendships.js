const router = require('express').Router();
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const mailer = require('nodemailer')

let Friendship = require('../models/friendship.model.js');
// let User = require('../models/user.model');

require('dotenv').config();
const secret = process.env.SECRET;

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
    let {sender_id, added_id, added_first, added_last, sender_first, sender_last} = req.query;
    let {userPicture} = req.body

    await getProfilePicture(added_id).then(async (addingPicture) => {
        if (addingPicture) {
            let newFriendship = new Friendship ({friendship: [
                {
                    id: sender_id,
                    firstName: sender_first,
                    lastName: sender_last,
                    profilePicture: userPicture
                },
                {
                    id: added_id,
                    firstName: added_first,
                    lastName: added_last,
                    profilePicture: addingPicture
                }
            
            ]})
            
            await newFriendship.save()
            res.status(200).json({msg: "Friend added!"})
        }

    })
    



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
    let {senderId, addedId} = req.query
    await Friendship.findOne( {friendship: {$all: [
        {$elemMatch: {"id": senderId}},
        {$elemMatch: {"id": addedId}}
    ]}}, 
    function(err, found) {
        if (found) {
            res.status(400).json({result: "found"})
        }
        else {
            res.status(200).json({result: "none"})
        }
    })


})

router.route('/getAll').get(async (req, res) => {
    let {id} = req.query

    await Friendship.find({ friendship: {$elemMatch: {id: id}}}, function(err, friendships) {
        if (friendships.length > 0) {
            res.status(200).json({data: friendships})
        } else {
            res.status(404).json({data: []})
        }
    }) 
})

router.route('/update').post(async (req, res) => {
    let {id} = req.query
    let {firstName, lastName, profilePicture} = req.body

    

})

module.exports = router