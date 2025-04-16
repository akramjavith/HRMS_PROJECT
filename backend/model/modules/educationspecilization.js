const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const educationspecilizationSchema = new Schema({

    category: {
        type: [String],
        required: false,
    },
    subcategory: {
        type: [String],
        required: false,
    },
    specilizationgrp: [ 
        {
            label: {
                type: String,
                required: false
            },
            time: {
                type: String,
                required: false
            },
        }
    ],
    // today: {
    //     type: String,
    //     required: false,
    // },  

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
module.exports = mongoose.model('Educationspecilization', educationspecilizationSchema);