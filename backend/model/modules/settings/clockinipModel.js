const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clockinipSchema = new Schema({
    company: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    ipaddress: [String],
    createdAt: {
        type: Date,
        default: Date.now
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
})
module.exports = mongoose.model('clockinip', clockinipSchema);