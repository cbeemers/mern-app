const router = require('express').Router();
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const mailer = require('nodemailer');
// const { request } = require('../app.js');
// const multer = require('multer')
// var multers3 = require('multer-s3')
// var AWS = require('aws-sdk')

require('dotenv').config();

let User = require('../models/user.model.js');

 
// User.createIndexes({(firstName + lastName): 1})
const secret = process.env.SECRET;

async function checkToken(token) {
    const user = await fetch("http://localhost:9000/checkToken?token="+token);
    const json = await user.json();
    const email = json['email'];

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
                        "_id": data["_id"]
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
                // if (type == "friends") {

                // }
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

// router.route('/addProfilePicture').post(async (req, res) => {
//     const {id} = req.query
//     const {file} = req.body

//     // const upload = multer({
//     //     storage: multers3({
//     //         s3: s3, 
//     //         bucket: 'my-user-pictures',
//     //         acl: 'public-read',
//     //         metadata: function(req, file, cb) {
//     //             cb(null, {fieldName: file.fieldName})
//     //         },
//     //         key: function(req, file, cb) {
//     //             console.log(file)
//     //             cb(null, req.id)
//     //         }
//     //     })
//     // })
//     const fileUpload = upload.single('image')

//     fileUpload(async (req, res, err) => {
//         if (err) {
            
//         }
//         else {
            
//         }
//     }).then(downloadUrl => {
        
//     })
//     res.status(200).json({msg: "Success"})
//     // res.status(200).json({msg: "Success"})

//     // params.Key = id
//     // var fs = require('fs')
//     // var fileStream = fs.createReadStream(file)


//     // fileStream.on('error', function(err) {
//     //     res.status(401).json({msg: err})
//     // })

//     // params.Body = fileStream
//     // if (!fileStream.error) {
//     //     bucket.upload(params, function(err, data) {
//     //         if (err) {
//     //             res.status(400).json({msg: err})
//     //             return
//     //         } else {
//     //             res.status(200).json({data})
//     //             return
//     //         }
//     //     })
//     // }
// })

// router.route('/getProfilePicture').get(async (req, res) => {
//     // const {id} = req.query
//     params.Key = "profile-default.png"

//     await s3.getObject(params, function(err, data) {
//         if (err) {
//             res.status(400).json({msg: err})
//         }
//         else {
//             res.status(200).json({data})
//         }
//     })

// })

module.exports = router;