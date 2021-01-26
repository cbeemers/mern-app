const jwt = require('jsonwebtoken');

require('dotenv').config();
const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
    const {token} = res.body;
    // console.log(req.cookies);
    // console.log(req.headers["Set-Cookie"])
    console.log(req.headers);

    // console.log(localStorage.getItem('authorization'));
    // console.log(res.cookie);

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        console.log("yoooo");
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        jwt.verify(bearerToken, secret, (err, payload) => {
            if (err) { return res.sendStatus(403); }
            req.payload = payload;
            next();
        });

    } else {
        res.sendStatus(401);
    }
    


    // if (!token) {
    //     res.status(401).send('Unauthorized: No token provided');
    // } else {
    //     jwt.verify(token, secret, function(err, decoded) {
    //         if (err) {
    //             res.status(401).send("nah");
    //             console.log(err);
    //         } else {
    //             req.email = decoded.email;
    //             next();
    //         }
    //     });
    // }

}

module.exports = withAuth;
