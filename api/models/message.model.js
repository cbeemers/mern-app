const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const messageSchema = new SCHEMA({
    senderId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true,
    },
    conversationId: {
        type: String,
        required: true
    },
    isOpened: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true
});

messageSchema.pre('save', function(next) {
    if (this.isNew) {
      next();
    }
});
  
module.exports = mongoose.model('Message', messageSchema);