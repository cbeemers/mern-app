const router = require('express').Router();
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const mailer = require('nodemailer');
const { request } = require('../app.js');

let User = require('../models/user.model.js');

// User.createIndexes({(firstName + lastName): 1})

require('dotenv').config();
const secret = process.env.SECRET;

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
    let fullName = String(firstName).toLowerCase() + String(lastName).toLowerCase()
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

router.route('/addToUser').post(async (req, res) => {
    let {query, token, type} = req.body;

    const user = await fetch("http://localhost:9000/checkToken?token="+token);
    const json = await user.json();
    const email = json['email'];

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

// router.route('/findUserById').get(async, (req, res) => {
//     const {id} = req.id

//     await User.findOne({id}, function(err, user) {
//         if (!user) {
//             res.status(404).json({error: "User not found"})
//         }
//         else {
//             let result
//         }
//     })
// })

router.route('/findUser').get(async (req, res) => {
    const {fullName} = req.query

    await User.find({fullName}, function(err, user) {
        if (user.length == 0) {
        // if (!user) {
            res.status(404).json({error: "user not found"})
        }
        else {
            let result = []
            user.forEach((data) => {
                result.push({
                    "firstName": data["firstName"],
                    "lastName": data["lastName"],
                    "_id": data["_id"]
                })
            })
            res.status(200).json({users: result})
        }
    }).limit(10)
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

router.route('/getFromUser').get(async (req, res) => {
    const token = req.query.token;
    const type = req.query.type;

    const user = await fetch("http://localhost:9000/checkToken?token="+token);
    const json = await user.json();
    const email = json['email'];

    await User.findOne({email}, function(err, user) {
        if (!user) {
            res.status(401)
                .json({
                    error: "Incorrect email or password",
                });
        } else {
            // if (type == "friends") {

            // }
            if (type != "all") {
                let values = user[type];
                res.status(200).json({values: values});
            } 
            else {
                res.status(200).json(user);

            }
        }
    });
});

router.route('/deleteRequest').post(async (req, res) => {
    const {sendId, _id, token} = req.query

    await User.updateOne(
        { _id: _id }, 
        { $pull: { requests: { _id: sendId } }
    })
    res.status(200).json({msg: "Request deleted"})
})

module.exports = router;