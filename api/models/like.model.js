const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const likeSchema = new SCHEMA({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
})

likeSchema.pre('save', function(next) {
    if (this.isNew) {
      next();
    }
  });
  
module.exports = mongoose.model('Like', likeSchema);