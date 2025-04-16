const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ErrorModeSchema = new Schema({

    projectvendor: {
        type: String,
        required: false,
    },
    process: {
        type: String,
        required: false,
    },
    fieldname: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    rate: {
        type: String,
        required: false,
    },

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            companyname: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
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
                type: String,
                required: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("PenaltyErrorMode", ErrorModeSchema);