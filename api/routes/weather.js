const router = require('express').Router();
const fetch = require('node-fetch');

router.route('/').get(async (req, res) => {
    const location = req.query.location.replace(',', " ");

    const uri = "http://api.weatherapi.com/v1/current.json?key=8b18437276014559936174558202704&q="+location;
    
    const response = await fetch(uri);
    const json = await response.json();
    res.json(json);
});

module.exports = router;