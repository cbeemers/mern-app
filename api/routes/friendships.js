const router = require('express').Router();
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const mailer = require('nodemailer')

let Friendship = require('../models/friendship.model.js');

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
    })
})

router.route('/add').post((req, res) => {
    let {sender_id, added_id, added_first, added_last, sender_first, sender_last} = req.query
    let newFriendship = new Friendship ({friendship: [
        {
            id: sender_id,
            firstName: sender_first,
            lastName: sender_last
        },
        {
            id: added_id,
            firstName: added_first,
            lastName: added_last
        }
    
    ]})

    newFriendship.save()
    res.status(200).json({msg: "Friend added!"})

    
    
    // if (exists['count'] == 0) {
    //     newFriendship.save()
    //     res.status(200).json({msg: "Friend added!"})
    // }
    // else {
    //     res.status(400).json({msg: "Friendship already exists"})
    // }

})


router.route('/exists').get(async (req, res) => {
    let {sender_id, added_id} = req.body
    let count = await Friendship.find( {$and: [
        {"id": sender_id},
        {"id": added_id}
    ]}).countDocuments()

    if (count > 0) {
        res.status(400).json({count: count})
    } else {
        res.status(200).json({count: count})
    }
})

router.route('/getAll').get(async (req, res) => {
    let {id, firstName, lastName} = req.query

    await Friendship.find({ friendship: {$elemMatch: {id: id}}}, function(err, friendships) {
        if (friendships.length > 0) {
            res.status(200).json({data: friendships})
        } else {
            res.status(404).json({data: []})
        }
    }) 
})

module.exports = router