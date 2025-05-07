const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OnlineTestMasterSchema = new Schema({
    testname: {
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
    questioncount: {
        type: String,
        required: false,
    },
    countfrom: {
        type: String,
        required: false,
    },
    countto: {
        type: String,
        required: false,
    },
    totalmarks: {
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
module.exports = mongoose.model(
    "OnlineTestMaster",
    OnlineTestMasterSchema
);