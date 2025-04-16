const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PenaltyClientErrorSchema = new Schema({
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
    loginid: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: false,
    },
    team: {
        type: String,
        required: false,
    },
    employeename: {
        type: String,
        required: false,
    },



    date: {
        type: String,
        required: false,
    },
    documentnumber: {
        type: String,
        required: false,
    },
    documentlink: {
        type: String,
        required: false,
    },

    fieldname: {
        type: String,
        required: false,
    },
    line: {
        type: String,
        required: false,
    },
    errorvalue: {
        type: String,
        required: false,
    },
    correctvalue: {
        type: String,
        required: false,
    },
    clienterror: {
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
module.exports = mongoose.model("Penaltyclienterror", PenaltyClientErrorSchema);
