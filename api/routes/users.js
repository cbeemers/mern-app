const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

let User = require('../models/user.model.js');

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
    const {email, password} = req.body;
    const newUser = new User({email, password});
    
    User.find({ email }, (err, previous) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error: Server error'
            });
        }
        else if (previous.length > 0) {
            console.log("what")
            return res.status(401).json({
                success: false,
                message: "User already exists"
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
            let values = user[type];
            res.status(200).json({values: values});
        }
    });
});

module.exports = router;