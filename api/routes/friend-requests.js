const router = require('express').Router();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')

require('dotenv').config();

const FriendRequest = require('../models/friend-request.model.js');
const Profile = require('../models/profile.model');

router.route('/getRequests').get(async (req, res) => {
    const { receiverId } = req.query;
    let userRequests;
    FriendRequest.find({receiverId}).then( function(requests) {
        userRequests = requests;
        if (!requests) {
            res.status(404).json([]);
        } else {
            let queries = [];
            requests.forEach(request => {
                queries.push(
                    Profile.findOne({userId: request['senderId']})
                );
            });
            return Promise.all(queries);
        }
    }).then(profiles => {
        let results = [];
        for (let i = 0; i < profiles.length; i++){
            let profile = profiles[i];
            let request = userRequests[i];

            results.push({
                firstName: profile['firstName'],
                lastName: profile['lastName'],
                profilePicture: profile['profilePicture'],
                _id: request['_id'],
                senderId: profile['userId'],
            });
        }
        res.status(200).json(results);
    })

});

router.route('/getSentRequests').get(async (req, res) => {
    const { senderId } = req.query;

    FriendRequest.find({senderId}, async function(err, requests) {

    });
});

router.route('/checkForRequest').get(async (req, res) => {

});

router.route('/sendRequest').post(async (req, res) => {
    const {senderId, receiverId, firstName, lastName, profilePicture} = req.body

    await FriendRequest.findOne({receiverId, senderId}, async function(err, request) {
        if (request) {
            res.status(401).json("Request already exists");
        } else {
            const friendRequest = new FriendRequest({senderId, receiverId});

            friendRequest.save().then((newRequest) => {
                res.status(200).json("Sent");
            });
        }

    })
});

router.route('/deleteRequest').post(async (req, res) => {
    const { id } = req.body;
    FriendRequest.deleteOne({_id: id}, async function(err, requests) {
        res.status(200).json("Deleted");
    });
});

module.exports = router;