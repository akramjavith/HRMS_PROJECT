const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const templateListSchema = new Schema({
    company: {
        type: [String],
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
    employeename: {
        type: [String],
        required: false,
    },
    filename: {
        type: String,
        required: false,
    },
    information: {
        type: [String],
        required: false,
    },
    loginvalues: {
        type: [String],
        required: false,
    },
    addressvalues: {
        type: [String],
        required: false,
    },
    documentvalues: {
        type: [String],
        required: false,
    },
    workhistoryvalues: {
        type: [String],
        required: false,
    },
    bankdetailsvalues: {
        type: [String],
        required: false,
    },
    informationstring: {
        type: [String],
        required: false,
    },
    verifiedInfo: [{
        name: {
            type: String,
            require: false,
        },
        edited: {
            type: Boolean,
            require: false,
        },
        corrected: {
            type: Boolean,
            require: false,
        }
    }],

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

module.exports = mongoose.model("TemplateList", templateListSchema);