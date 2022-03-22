const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Friendship = require('../models/friendship.model');
const Profile = require('../models/profile.model');

module.exports = async function getAllFriendshipProfiles(id) {
    return await Friendship.find({ friendship: {$elemMatch: {id: id}}}).then(function(friendships) {
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
            return []
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
        return results
    })
} 