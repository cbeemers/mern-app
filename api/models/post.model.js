const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const postSchema = new SCHEMA({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    numberLikes: {
        type: Number,
        required: true,
        default: 0
    },
    parent: {
        type: String,
        required: false,
        default: null
    }
},
{
    timestamps: true
})

postSchema.pre('save', function(next) {
    if (this.isNew) {
      next();
    }
  });
  
module.exports = mongoose.model('Post', postSchema);