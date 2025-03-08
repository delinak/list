const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    lists: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'List',
        default: [],
    }],
});

module.exports = mongoose.model('ListCollection', collectionSchema);