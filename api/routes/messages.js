const router = require('express').Router();
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const Profile = require('../models/profile.model');

async function getConversation(userId, otherId) {
    return await Conversation.findOne({users: 
        {$all: [
            {$elemMatch: {id: userId}},
            {$elemMatch: {id: otherId}}
        ]}
    });
}

async function saveMessage(senderId, receiverId, content, conversationId) {
    let message = new Message({senderId, receiverId, content, conversationId})
    return await message.save();
}

router.route('/sendMessage').post(async (req, res) => {
    // Need to check for conversation, create if null then create the message
    let {userId, receiverId, messageContent} = req.body;

    await getConversation(userId, receiverId).then(conversation => {
        if (conversation) {
            saveMessage(userId, receiverId, messageContent, conversation['_id']).then(() => {
                res.status(200).json("Sent!")
            });
        } else {
            let newConversation = new Conversation({
                users: [{id: userId}, {id: receiverId}]
            });
            newConversation.save().then(savedConversation => {
                saveMessage(userId, receiverId, messageContent, savedConversation['_id']).then(() => {
                    res.status(200).json("Sent!")
                });
            });
        }
    })
    
});

router.route('/deleteMessages').post(async (req, res) => {
    // Need to rethink how this is going to work, may need to hold an active flag in 
    // conversation collection per user
    // let {}
});

router.route('/getConversation').get(async (req, res) => {
    let {userId, otherId} = req.query;

    await getConversation(userId, otherId).then(async conversation => {
        let conversationId = conversation['id'];

        await Message.find({conversationId}).sort({createdAt: 1}).limit(100).then(messages => {
            res.status(200).json(messages);
        });
        
    });
});

router.route('/getAllConversations').get(async (req, res) => {
    // For each conversation, get user profile and most recent message
    let {userId} = req.query;

    await Conversation.find({users: {$elemMatch: {id: userId}}}).then(conversations => {
        
    });
}); 

router.route('/readMessages').post(async (req, res) => {
    let {conversationId, receiverId} = req.body;

    await Message.updateMany({conversationId, receiverId}, {$set: {isOpened: true}}).then(() => {
        res.status(200).json(false);
    })
});

module.exports = router;