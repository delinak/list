const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    resetCycle: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none'
    },
    lastReset: {
        type: Date,
        default: Date.now,
    },
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry',
        default: [],
    }],
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }]
});

module.exports = mongoose.model('List', listSchema);