const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const SCHEMA = mongoose.Schema;

const userSchema = new SCHEMA ({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6
    },
    password : {
        type: String,
        required: true,
        minlength: 6
    },
    stocks: {
      type: Array,
      required: false,
    }, 
    locations: {
      type: Array,
      required: false,
    }, 
    messages: {
      type: Array, 
      required: true
    }, 
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    requests: {
      type: Array,
      required: true
    }, 
    fullName: {
      type: String, 
      required: true,
      index: true,
    },
    bio: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
      default: "https://my-user-pictures.s3.us-east-2.amazonaws.com/profile-default.png"
    }
    // picture {
    //   type:  
    // }
},
    {
        timestamps: true
    });

userSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRounds,
      function(err, hashedPassword) {
      if (err) {
        next(err);
      }
      else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    })
}

module.exports = mongoose.model('User', userSchema);