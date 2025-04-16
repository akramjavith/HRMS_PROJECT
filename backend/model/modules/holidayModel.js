const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const holidaySchema = new Schema({

    name: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    applicablefor: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    noofdays: {
        type: Number,
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
module.exports = mongoose.model("Holiday", holidaySchema)