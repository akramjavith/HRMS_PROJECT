const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProjectmasterSchema = new Schema({

    name: {
        type: String,
        required: false,
    },
    enablepage: {
        type: Boolean,
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
module.exports = mongoose.model("Projectmaster", ProjectmasterSchema)