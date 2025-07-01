const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const idletimeworkSchema = new Schema({

    appliedfor: {
        type: String,
        required: false,
    },
    idlework: {
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
    employee: {
        type: String,
        required: false,
    },
    process: {
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
    explanation: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    aname: {
        type: String,
        required: false,
    },
      rejectreason: {
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
module.exports = mongoose.model('Idletimework', idletimeworkSchema);