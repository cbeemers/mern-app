const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const friendshipSchema = new SCHEMA ({
    friendship: {
        type: Array,
        required: true
    }
})

friendshipSchema.pre('save', function(next) {
    if (this.isNew) {
        next()
    }
})

module.exports = mongoose.model('Friendship', friendshipSchema)