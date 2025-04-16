const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const refercandidateSchema = new Schema({

    referingjob: {
        type: String,
        required: false,
    },
    prefix: {
        type: String,
        required: false,
    },
    firstname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    emailid: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: false,
    },
    relation: {
        type: String,
        required: false,
    },
    known: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },

    files: [
        {
            base64: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            preview: {
                type: String,
                required: false
            },
            size: {
                type: String,
                required: false
            },
            type: {
                type: String,
                required: false
            },
        }
    ],
    // today: {
    //     type: String,
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

        }],
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

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Refercandidate', refercandidateSchema);