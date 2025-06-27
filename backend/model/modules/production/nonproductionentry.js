const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nonproductionentrySchema = new Schema({


    categorysubcategory: {
        type: String,
        required: false,
    },

    mode: {
        type: String,
        required: false,
    },
    count: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    fromtime: {
        type: String,
        required: false,
    },
    totime: {
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
                type: Date,
                default: Date.now,
            },
        },
    ],
    updatedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('Nonproductionentry', nonproductionentrySchema);
