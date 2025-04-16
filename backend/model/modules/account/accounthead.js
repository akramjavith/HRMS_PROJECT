
//////model///////////
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accounthead = new Schema({
    groupname: {
        type: String,
        required: false,
    },
    headcode: {
        type: String,
        required: false,
    },
    headname: {
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
        default: Date.now,
    },
})
module.exports = mongoose.model('Accounthead', accounthead);