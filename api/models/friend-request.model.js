const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const requestSchema = new SCHEMA({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
}, 
{
    timestamps: true
});

requestSchema.pre('save', function(next) {
    if (this.isNew) {
      next();
    }
  });
  
module.exports = mongoose.model('FriendRequest', requestSchema);