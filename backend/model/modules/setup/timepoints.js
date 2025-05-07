const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timepointsSchema = new Schema({

    project: {
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
    time: {
        type: String,
        required: false,
    },
    rate: {
        type: String,
        required: false,
    },
    ratetopoints: {
        type: String,
        required: false,
    },
    points: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    flagcount: {
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
module.exports = mongoose.model('TimePoints', timepointsSchema);