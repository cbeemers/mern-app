const router = require('express').Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

let User = require('../models/user.model');
let Profile = require('../models/profile.model')

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
                    const id = user['_id']
                    console.log(id)
                    const payload = {id};
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
            return res.status(401).json({
                success: false,
                message: "Email already in use!"
            });
        }
    });
        
    newUser.save()
        .then((user) => { 
            let userId = user['_id']
            const newProfile = Profile({userId, email, firstName, lastName, fullName})
            newProfile.save().then(() => {
                res.json("User added!")
            })
        });
});

module.exports = router;