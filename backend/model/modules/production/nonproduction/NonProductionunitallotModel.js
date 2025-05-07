const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NonproductionunitallotSchema = new Schema({
    category: {
        type: String,
        required: false
    },
    subcategory: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    team: {
        type: String,
        required: false
    },
    employeename: {
        type: String,
        required: false
    },
    employeecode: {
        type: String,
        required: false
    },
    empid: {
        type: String,
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
module.exports = mongoose.model('nonproductionunitallot', NonproductionunitallotSchema);