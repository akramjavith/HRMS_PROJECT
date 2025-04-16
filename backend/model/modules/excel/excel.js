const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const excel = new Schema({
    // priority:{
    //     type: String,
    //     required: true,
    // },
    // customer:{
    //     type: String,
    //     required: false,
    // },

    // process:{
    //     type: String,
    //     required: false,
    // },
    // count:{
    //     type: String,
    //     required: false,
    // },
    // tat:{
    //     type: String,
    //     required: false
    // },
    // duration:{
    //     type: String,
    //     required: false
    // },
    // created:{
    //     type: String,
    //     required: false
    // },
    exceldata: [
        {
            customer: {
                type: String,
                required: false,
            },
            priority: {
                type: String,
                required: true,
            },
            process: {
                type: String,
                required: false,
            },
            hyperlink: {
                type: String,
                required: false,
            },
            project: {
                type: String,
                required: false,
            },
            vendor: {
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
            count: {
                type: String,
                required: false,
            },
            tat: {
                type: String,
                required: false
            },
            branch: {
                type: String,
                required: false,
            },
            unit: {
                type: String,
                required: false
            },
            team: {
                type: String,
                required: false
            },
            created: {
                type: String,
                required: false
            },
        }
    ],
    updatedby: [
        {
            name: {
                type: String,
                required: false,
            },
            project: {
                type: String,
                required: false,
            },
            vendor: {
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
module.exports = mongoose.model('Excel', excel);