const router = require('express').Router();
const fetch = require('node-fetch');
const async = require('express-async-await');

router.route('/').get(async (req, res) => {

    const symbol = req.query.symbol;

    const uri = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&apikey=8XWXL9FB59YWF310"
    
    const response = await fetch(uri);
    const json = await response.json();
    res.json(json);
});

module.exports = router;
