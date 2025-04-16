const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubpagetwoSchema = new Schema({
    project: {
        type: String,
        required: false,
    },
    subproject: {
        type: String,
        required: false,
    },
    module: {
        type: String,
        required: false,
    },
    submodule: {
        type: String,
        required: false,
    },
    stateassign: {
        type: String,
        required: false,
    },
    taskid: {
        type: String,
        required: false,
    },
    pageview: {
        type: String,
        required: false,
    },
    mainpage: {
        type: String,
        required: false,
    },
    subpageone: {
        type: String,
        required: false,
    },
    subpagetwo: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    estimation: {
        type: String,
        required: false,
    },
    estimationtime: {
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
module.exports = mongoose.model('Subpagethree', SubpagetwoSchema);