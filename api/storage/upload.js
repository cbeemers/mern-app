require('dotenv').config();

const multer = require('multer');
const multerS3 = require('multer-s3')
// var upload = multer();

var AWS = require('aws-sdk')
let config = JSON.parse(process.env.config)
const s3 = new AWS.S3(config)

let upload = multer({ storage: multerS3({
    acl: "public-read",
    s3: s3,
    bucket: config.Bucket,
    key: function (req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname)
        }
    }) 
});



module.exports = upload