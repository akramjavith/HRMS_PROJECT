const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const weekoffpresentSchema = new Schema({
    company: {
        type: String,
        required: false,
    },
    filtertype: {
        type: String,
        required: false,
    },
    branch: {
        type: [String],
        required: false,
    },
    unit: {
        type: [String],
        required: false,
    },
    team: {
        type: [String],
        required: false,
    },
    employee: {
        type: [String],
        required: false,
    },
    shiftstartday: {
        type: String,
        required: false,
    },
    shiftendday: {
        type: String,
        required: false,
    },
    shiftdaytotal: {
        type: String,
        required: false,
    },
    calstartday: {
        type: String,
        required: false,
    },
    calendday: {
        type: String,
        required: false,
    },
    caldaytotal: {
        type: String,
        required: false,
    },
    weekoffpresentday: {
        type: String,
        required: false,
    },
    startdate: {
        type: String,
        required: false,
    },
    shiftstatus: {
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
module.exports = mongoose.model("Weekoffpresent", weekoffpresentSchema);