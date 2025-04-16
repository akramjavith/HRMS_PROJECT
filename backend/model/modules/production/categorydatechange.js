const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categoryDateChangeSchema = new Schema({
    project: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    subcategory:  {
        type: [String],
        required: false
    },
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
module.exports = mongoose.model('categorydatechange', categoryDateChangeSchema);