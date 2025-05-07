const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const queuetypemaster = new Schema({
    vendor: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },

    type: {
        type: String,
        required: false,
    },
    orate: {
        type: String,
        required: false,
    },
    newrate: {
        type: Number,
        required: false,
    },
    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },

        }],
    updatedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

queuetypemaster.index({ vendor: 1, category: 1, subcategory: 1 });

queuetypemaster.index({ type: 1, vendor: 1 });

module.exports = mongoose.model('QueueType Master', queuetypemaster);