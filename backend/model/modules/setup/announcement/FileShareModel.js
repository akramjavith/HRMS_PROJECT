const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FileShareSchema = new Schema({

    company: {
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
    department: {
        type: [String],
        required: false,
    },
    employeename: {
        type: [String],
        required: false,
    },
    foldername: {
        type: String,
        required: false,
    },
    url: {
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
module.exports = mongoose.model('fileShare', FileShareSchema);