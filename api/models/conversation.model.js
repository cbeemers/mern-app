const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const conversationSchema = new SCHEMA({
    users: {
        type: Array, 
        required: true
    },
},
{
    timestamps: true
});

conversationSchema.pre('save', function(next) {
    if (this.isNew) {
      next();
    }
});
  
module.exports = mongoose.model('Conversation', conversationSchema);