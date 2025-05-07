const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userActivity = new Schema({
    app: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    path: {
        type: String,
        required: false,
    },
    pid: {
        type: String,
        required: false,
    },
    macaddress: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    localip: {
        type: String,
        required: false,
    },
    devicename: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
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

    department: {
        type: String,
        required: false,
    },
    employeeid: {
        type: String,
        required: false,
    },
    employeecode: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },


    createdAt: {
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model('userActivity', userActivity);