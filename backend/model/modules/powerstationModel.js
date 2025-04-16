const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const powerstationSchema = new Schema({
    company:{
        type: [String],
        required: false
    },
    branch:{
        type: String,
        required: false
    },
    unit:{
        type: String,
        required: false
    },

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
module.exports = mongoose.model("Powerstation", powerstationSchema)