const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const profileSchema = new SCHEMA ({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    stocks: {
      type: Array,
      required: false,
    }, 
    locations: {
      type: Array,
      required: false,
    }, 
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    fullName: {
      type: String, 
      required: true,
      index: true,
    },
    bio: {
      type: String,
      required: true,
      default: "",
      maxlength: 140,
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

profileSchema.pre('save', function(next) {
  if (this.isNew) {
    next();
  }
});

module.exports = mongoose.model('Profile', profileSchema);