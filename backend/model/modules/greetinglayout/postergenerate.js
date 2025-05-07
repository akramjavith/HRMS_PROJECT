const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const posterGenerateSchema = new Schema({
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
    posterdownload: [
        {
            groupId: {
                type: String,
                required: false,
            },
            label: {
                type: String,
                required: false,
            },
            value: {
                type: String,
                required: false,
            },
            _id: {
                type: String,
                required: false,
            },
        }],
    employeedbid: {
        type: String,
        required: false,
    },
    employeegroupid: {
        type: String,
        required: false,
    },
    categoryname: {
        type: String,
        required: false,
    },
    subcategoryname: {
        type: String,
        required: false,
    },
    themename: {
        type: String,
        required: false,
    },
    // templates: {
    //     type: [String],
    //     required: false,
    // },

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

module.exports = mongoose.model("PosterGenerate", posterGenerateSchema);