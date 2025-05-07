const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paidstatusfixSchema = new Schema({
    department: {
        type: [String],
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    year: {
        type: String,
        required: false,
    },
    frequency: {
        type: String,
        required: false,
    },
    absentmodes: {
        type: String,
        required: false,
    },
    fromvalue: {
        type: String,
        required: false,
    },
    tovalue: {
        type: String,
        required: false,
    },
    achievedmodes: {
        type: String,
        required: false,
    },
    frompoint: {
        type: String,
        required: false,
    },
    topoint: {
        type: String,
        required: false,
    },
    currentabsentmodes: {
        type: String,
        required: false,
    },
    currentabsentvalue: {
        type: String,
        required: false,
    },
    currentachievedmodes: {
        type: String,
        required: false,
    },
    currentachievedvalue: {
        type: String,
        required: false,
    },
    paidstatus: {
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
module.exports = mongoose.model("Paidstatusfix", paidstatusfixSchema);
