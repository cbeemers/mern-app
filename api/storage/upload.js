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



// const upload = (file, id) => {
//     console.log(file)
//     const content = fs.readFileSync(file)
    
//     const params = {
//         Bucket: AWS_BUCKET_NAME,
//         Key: "profilePictures/" + id,
//         Body: JSON.stringify(content, null, 2)
//     }

//     s3.upload(params, async function(err, data) {
//         if (err) {
//             throw err;
//         }
//         await fetch("http://localhost:9000/users/addById?_id=id", {
//             method: "POST", 
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({fileData: data.location})
//         })

//     })

// } 


module.exports = upload