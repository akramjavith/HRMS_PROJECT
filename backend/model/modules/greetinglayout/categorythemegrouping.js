const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorythemegroupingSchema = new Schema({
    categoryname: {
        type: String,
        required: false,
    },
    subcategoryname: {
        type: String,
        required: false,
    },
    themename: {
        type: [String],
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
module.exports = mongoose.model('categorythemegrouping', categorythemegroupingSchema);