const router = require('express').Router();
const fetch = require('node-fetch');

require('dotenv').config();

let Profile = require('../models/profile.model.js');
let upload = require('../storage/upload');

router.route('/getProfile').get(async (req, res) => {
    let { userId } = req.query
    await Profile.findOne({userId}, function(err, profile) {
        if (profile === undefined) {
            res.status(404).json("User not found!")
        }
        else {
            res.status(200).json(profile)
        }
    });

});

router.route('/findProfile').get(async (req, res) => {
    const {fullName, userId} = req.query

    await Profile.find({fullName}, function(err, profile) {
        if (profile.length == 0) {
        // if (!user) {
            res.status(404).json({users: []})
        }
        else {
            let result = []
            profile.forEach((data) => {
                if (data['userId'] != userId) {
                    result.push({
                        "firstName": data["firstName"],
                        "lastName": data["lastName"],
                        "_id": data["userId"], 
                        "profilePicture": data['profilePicture']
                    })
                }
            })
            res.status(200).json({users: result})
        }
    }).limit(10)
});

router.route('/getFromProfile').get(async (req, res) => {
    const {userId, type} = req.query;

    await Profile.findOne({userId}, function(err, user) {
        if (!user) {
            res.status(401)
                .json({
                    error: "Incorrect email or password",
                });
        } else {
            
            if (type != "all") {
                let values = user[type];
                res.status(200).json({values: values});
            } 
            else if (type == "picture") {

            }
            else {
                res.status(200).json(user);

            }
        }
    });
});

router.route('/updateProfilePicture').post(upload.any(), async function(req, res) {
    const {userId} = req.query
    console.log(req.body)
    const uri = req.files[0].location
    let newObject = {profilePicture: uri}

    await Profile.updateOne({userId}, {$set: newObject}, async function (err, user) {
        if (err) {
            res.status(500).json({msg: "server error, user not updated"})
        } 
        else {
            res.status(200).json({profilePicture: uri});

            // await Friendship.updateMany( {friendship: {$elemMatch: {id: userId}}}, {$set: {"friendship.$[elem].profilePicture":profilePicture}},
            // {arrayFilters: [ { "elem.id": userId } ]}, 
            //     function(err, friendship) {
            //         if (!err) {
            //             res.status(200).json({picture: profilePicture})
            //         }
            //     });
            
        }
    });

    // await fetch("http://localhost:9000/users/update?type=picture&_id="+userId, {
    //     method: "POST",
    //     body: JSON.stringify({
    //         profilePicture: uri
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then(response => {
    //     response.json().then(data => {
    //         if (data["picture"]) {
    //             res.status(200).json({picture: data['picture']})
    //         }
    //     })
    // })
});

// router.route('/updateProfilePicture').post(async (req, res) => {
//     let { userId } = req.query
//     let { profilePicture } = req.body

//     let newObject = {}

//     if (profilePicture) {newObject = {profilePicture}}

//     await Profile.updateOne({userId}, {$set: newObject}, async function (err, user) {
//         if (err) {
//             res.status(500).json({msg: "server error, user not updated"})
//         } 
//         else {

//             // await Friendship.updateMany( {friendship: {$elemMatch: {id: userId}}}, {$set: {"friendship.$[elem].profilePicture":profilePicture}},
//             // {arrayFilters: [ { "elem.id": userId } ]}, 
//             //     function(err, friendship) {
//             //         if (!err) {
//             //             res.status(200).json({picture: profilePicture})
//             //         }
//             //     });
            
//         }
//     });

// });

// router.route('/update').post(async (req, res) => {
//     let {type, _id} = req.query
//     let {firstName, lastName, password, profilePicture} = req.body

//     console.log(req.body)

//     let newObject = {}

//     if (type === "password") {}
    
//     else if (type === "name" || type === "picture") {
//         if (firstName) {newObject = {firstName}}
//         else if (lastName) {newObject = {lastName}}
//         else if (profilePicture) {newObject = {profilePicture}}

//     }
// });

router.route('/addStock').post(async function (req, res) {
    var { ticker, userId } = req.body;

    Profile.findOne({userId}, async (err, profile) => {
        if (!profile) {
            res.status(404).json({msg: "User not found"});
        } else if (err) {
            res.status(500).json({err});
        } else {
            let stocks = profile['stocks'];
            ticker = ticker.toUpperCase();
            
            if (!stocks.includes(ticker)) {
                stocks.push(ticker);
                await Profile.updateOne({userId}, {$set: {stocks}});
                res.status(200).json(stocks);
            }
            
        }
    });
});

router.route('/getStocks').get(async (req, res) => {
    const { userId } = req.query;

    Profile.findOne({userId}, async (err, profile) => {
        if (!profile) {
            res.status(404).json({msg: "User not found"});
        } else {
            let stocks = profile['stocks'];
            res.status(200).json(stocks);
        }
    });
});

router.route('/addLocation').post(async (req, res) => {
    var { location, userId } = req.body;

    Profile.findOne({userId}, async (err, profile) => {
        if (!profile) {
            res.status(404).json("User not found");
        } else if (err) {
            res.status(500).json(err);
        } else {
            let locations = profile['locations'];
            
            if (!locations.includes(location)) {
                locations.push(location);
                await Profile.updateOne({userId}, {$set: {locations}});
                res.status(200).json(locations);
            }
            
        }
    });
});

router.route('/getLocations').get(async (req, res) => {
    const { userId } = req.query;

    Profile.findOne({userId}, async (err, profile) => {
        if (!profile) {
            res.status(404).json("Profile not found");
        } else {
            let locations = profile['locations'];
            res.status(200).json(locations);
        }
    })
})

module.exports = router;