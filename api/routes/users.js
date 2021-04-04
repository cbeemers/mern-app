const router = require('express').Router();
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const mailer = require('nodemailer');
// const { request } = require('../app.js');
const multer = require('multer')
// var multers3 = require('multer-s3')
// var AWS = require('aws-sdk')
// const upload = require('../storage/upload')

require('dotenv').config();

let User = require('../models/user.model.js');
let Friendship = require('../models/friendship.model')

const secret = process.env.SECRET;

async function checkToken(token) {
    let email
    const user = await fetch("http://localhost:9000/checkToken?token="+token).then(async (user) => {
        await user.json().then(data => {
            email = data['email'];
        })
    })

    return email
}

router.route('/authenticate').post((req, res) => {
    const {email, password} = req.body;

    User.findOne({email}, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: "Internal error, try again.",
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: "Incorrect email or password",
                });
        } else {
            user.isCorrectPassword(password, function(err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: "Internal error, try again."
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            error: "Email or password incorrect",
                        });
                } else {
                    const payload = {email};
                    const token = jwt.sign(payload, secret, {expiresIn: "1 day"});                    
                    res.status(200).json({token});
                }
            });
        }
    });
});

router.route('/add').post((req, res) => {
    const {email, password, firstName, lastName} = req.body;
    let fullName = (String(firstName) + String(lastName)).replace(/ /g, "").toLowerCase()
    const newUser = new User({email, password, firstName, lastName, fullName});
    
    User.find({ email }, (err, previous) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error: Server error'
            });
        }
        else if (previous.length > 0) {
            // console.log("what")
            return res.status(401).json({
                success: false,
                message: "Email already in use!"
            });
        }
    });
        
    newUser.save()
    .then(() => { 
        res.json("User added!")
    });
});

router.route('/findUser').get(async (req, res) => {
    const {fullName, userId} = req.query

    await User.find({fullName}, function(err, user) {
        if (user.length == 0) {
        // if (!user) {
            res.status(404).json({users: []})
        }
        else {
            let result = []
            user.forEach((data) => {
                if (data['_id'] != userId) {
                    result.push({
                        "firstName": data["firstName"],
                        "lastName": data["lastName"],
                        "_id": data["_id"], 
                        "profilePicture": data['profilePicture']
                    })
                }
            })
            res.status(200).json({users: result})
        }
    }).limit(10)
});

router.route('/addToUser').post(async (req, res) => {
    let {query, token, type} = req.body;

    await checkToken(token).then(async (email) => {
        await User.findOne({email}, async function(err, user) {
            if (!user) {
                res.status(401)
                    .json({
                        error: "User doesn't exist",
                    });
            } else if (!err) {
    
                let values = user[type];
                type === "stocks" ? query = query.toUpperCase() : query=query;
    
                if (!values.includes(query) && query != "") {
                    
                    values.push(query);
    
                    let obj; 
                    if (type == "stocks") { obj = {stocks: values}; }
                    else if (type == "locations") { obj = {locations: values}; }
                    
                    await User.updateOne({email: email.toString()}, {$set:obj});
                }
                
                res.status(200).json({msg: "Success"});
            }
        });
    });
});

router.route('/getUser').get(async (req, res) => {
    const {_id} = req.query

    User.findOne({_id}, function(err, user) {
        if (user) {
            res.status(200).json({firstName: user['firstName'], lastName: user['lastName'], profilePicture: user['profilePicture']})
        }
    })
})

// Gets information pertaining to current user. 
// Not for getting information on others
router.route('/getFromUser').get(async (req, res) => {
    const token = req.query.token;
    const type = req.query.type;

    await checkToken(token).then(async (email) => {
        await User.findOne({email}, function(err, user) {
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
});

router.route('/sendRequest').post(async (req, res) => {
    const {_id, firstName, lastName, token} = req.query
    // let sender_id = firstName
    const user = await fetch("http://localhost:9000/users/getFromUser?type=all&token="+token);
    const json = await user.json();
    const sender_id = json['_id'];
    const senderFirst = json['firstName']
    const senderLast = json['lastName']

    await User.findOne({_id}, async function(err, user) {
        if (!user) {
            res.status(401).json({error: "Unknown error sending request"})
        }
        else {
            let values = user['requests']
            if (_id != sender_id) {
                values.push({
                    _id: sender_id,
                    firstName: senderFirst,
                    lastName: senderLast,
                    profilePicture: json['profilePicture']
                })
                //     {
                //     firstName: firstName, 
                //     lastName: lastName,
                //     _id: sender_id,
                // })
                await User.updateOne({_id: _id}, {$set:{requests: values}});
                res.status(200).json({msg: "Success"});
            }
            else {
                res.status(400).json({msg: "Request already exists."})
            }
        }

    })
})

router.route('/deleteRequest').post(async (req, res) => {
    const {sendId, _id, token} = req.query

    await User.updateOne(
        { _id: _id }, 
        { $pull: { requests: { _id: sendId } }
    })
    res.status(200).json({msg: "Request deleted"})
})

router.route('/addById').post(async (req, res) => {
    const {type, _id} = req.query
    const {fileName} = req.body

    await User.findOne({_id}, async function(err, user) {
        if (!user) {res.status(404).json({msg:"No user found"})}
        else {
            await User.updateOne({_id}, {$set: {profilePicture: fileName}})
            res.status(200).json({msg: fileName})
        }
    })
})

let upload = require('../storage/upload');
const friendshipModel = require('../models/friendship.model.js');
router.route('/addProfilePicture').post(upload.any(), async function(req, res) {
    const {_id} = req.query
    console.log(req.body)
    const uri = req.files[0].location

    await fetch("http://localhost:9000/users/update?type=picture&_id="+_id, {
        method: "POST",
        body: JSON.stringify({
            profilePicture: uri
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        response.json().then(data => {
            if (data["picture"]) {
                res.status(200).json({picture: data['picture']})
            }
        })
    })
    
    // await User.updateOne({_id}, {$set: {profilePicture: uri}}, function (err, user) {
    //     if (!err) {
    //         res.status(200).json({picture: uri})
    //     }
    // })


})

router.route('/update').post(async (req, res) => {
    let {type, _id} = req.query
    let {firstName, lastName, password, profilePicture} = req.body

    console.log(req.body)

    let newObject = {}

    if (type === "password") {}
    
    else if (type === "name" || type === "picture") {
        if (firstName) {newObject = {firstName}}
        else if (lastName) {newObject = {lastName}}
        else if (profilePicture) {newObject = {profilePicture}}

        await User.updateOne({_id}, {$set: newObject}, async function (err, user) {
            if (err) {
                res.status(500).json({msg: "server error, user not updated"})
            } 
            else {

                await Friendship.updateMany( {friendship: {$elemMatch: {id: _id}}}, {$set: {"friendship.$[elem].profilePicture":profilePicture}},
                {arrayFilters: [ { "elem.id": _id } ]}, 
                    function(err, friendship) {
                        if (!err) {
                            res.status(200).json({picture: profilePicture})
                        }
                    })
                
            }
        })

    }


})


module.exports = router;