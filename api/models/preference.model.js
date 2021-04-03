const mongoose = require('mongoose');

const SCHEMA = mongoose.Schema;

const preferenceSchema = new SCHEMA ({
    id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    preferences : {
        type: Object,
        required: true,
    }
})

module.exports = mongoose.model('Preference', preferenceSchema);