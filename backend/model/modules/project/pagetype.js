const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PagetypeSchema = new Schema({

    pagetypename: {
        type: String,
        required: false,
    },


    allmainpages: [
        {
            Sno: {
                type: String,
                required: false
            },
            label: {

                type: String,
                required: false
            },
        }],
    allsubpages: [{
        Sno: {

            type: String,
            required: false
        },
        label: {

            type: String,
            required: false
        },
    }],
    allsubsubpages: [{
        Sno: {
            type: String,
            required: false
        },
        label: {

            type: String,
            required: false
        },
    }],
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
module.exports = mongoose.model("Pagetype", PagetypeSchema)