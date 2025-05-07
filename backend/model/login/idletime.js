const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const idletimeSchema = new Schema({

    userid: {
        type: String,
        required: false,
    },
    // userrole: {
    //     type: String,
    //     required: false,
    // },
    username: {
        type: String,
        required: false,
    },
    companyname: {
        type: String,
        required: false,
    },
    empcode: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    starttime: {
        type: String,
        required: false,
    },
    endtime: {
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
    department: {
        type: String,
        required: false,
    },
    loginstatus: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Idletime', idletimeSchema);