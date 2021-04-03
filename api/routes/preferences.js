const router = require('express').Router();
const fetch = require('node-fetch');

let Preference = require('../models/preference.model.js');
const userModel = require('../models/user.model.js');

require('dotenv').config();

router.route('/exists').get((req, res) => {
    const {id} = req.query

    Preference.findOne({id}, function(err, preference) {
        if (!preference) {
            res.status(404).json({msg: "Preferences not found for this user"})
        } else {
            res.status(200).json(preference)
        }
    })
});

router.route('/add').post(async (req, res) => {

    const {id, type} = req.query
    const {city, stocks} = req.body

    await fetch("http://localhost:9000/preferences/exists?id="+id, {
        method: "GET"
    }).then(response => {
        response.json().then(data => {
            if (data["msg"]) {
                let newPreference = new Preference({id: id, preferences: []})
                if (type === "city") {
                    newPreference["preferences"] = [{type, city}]
                } 
                
                else if (type === "stock") {

                }

                newPreference.save()
                res.status(200).json("Preference added.")
            } 
            else {
                let preference = data['preference']
                if (type == "city") { 
                    preference[type] = city 
                    // Preference.updateOne({id}, {$set: {preferences:}})
                }
                
            }
        })
    })

});

router.route('/getAll').get((req, res) => {
    const {id} = req.query

    Preference.findOne({id}, function(err, preference) {
        if (!preference) {
            res.status(404).json({msg:"No user preferences"})
        } else {
            res.status(200).json(preference.preferences)
        }
    })
});

module.exports = router;