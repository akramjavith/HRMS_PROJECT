const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exitInterviewTestMasterSchema = new Schema({
    durationhours: {
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
    testname: {
        type: String,
        required: false,
    },
    totalmarks: {
        type: Number,
        required: false,
    },
    eligiblemarks: {
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
module.exports = mongoose.model("exitinterviewtestmaster", exitInterviewTestMasterSchema);