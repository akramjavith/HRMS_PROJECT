const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assetmaterial = new Schema({

    name: {
        type: String,
        required: false,
    },
    materialcode: {
        type: String,
        required: false,
    },
    assethead: {
        type: String,
        required: false,
    },
    assettype: {
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
module.exports = mongoose.model('Assetmaterial', assetmaterial);