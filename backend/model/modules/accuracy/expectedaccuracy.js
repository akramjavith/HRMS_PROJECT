const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExpectedAccuracySchema = new Schema({

    project: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    queue: {
        type: String,
        required: false,
    },
    minimumaccuracy: {
        type: Number,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    expectedaccuracyfrom: {
        type: Number,
        required: false,
    },
    expectedaccuracyto: {
        type: Number,
        required: false,
    },
    statusmode: {
        type: String,
        required: false,
    },
    percentage: {
        type: String,
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
module.exports = mongoose.model("Expectedaccuracy", ExpectedAccuracySchema);