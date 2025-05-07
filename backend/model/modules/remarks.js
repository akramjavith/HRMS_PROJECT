const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const remarks = new Schema({
    reason:{
        type: String,
        required: false,
    },
    taskname:{
        type: String,
        required: false,
    },
    date:{
        type: String,
        required: false,
    },
    pendingtasks:{
        type: String,
        required: false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
module.exports = mongoose.model('Remarks', remarks);